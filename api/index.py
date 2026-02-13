from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import numpy as np
import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client
import unicodedata

load_dotenv()

app = FastAPI()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def normalize_string(s):
    if not isinstance(s, str):
        return s
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('utf-8')
    return s.strip().upper()

def find_real_header(df_raw):
    df_raw = df_raw.dropna(how='all', axis=1)
    
    if any("Unnamed" in str(col) for col in df_raw.columns):
        for i, row in df_raw.iterrows():
            if row.notnull().sum() >= 2:
                new_header = row.values
                new_header = [str(h).strip() if pd.notnull(h) else f"col_{idx}" for idx, h in enumerate(new_header)]
                df_raw.columns = new_header
                df_raw = df_raw.iloc[i+1:].reset_index(drop=True)
                break
    
    df_raw.columns = [str(c).strip() for c in df_raw.columns]
    return df_raw

def discover_column_types(df):
    column_metadata = {}
    for col in df.columns:
        sample = df[col].replace(['nan', 'None', 'NaT', ''], np.nan).dropna()
        if sample.empty:
            column_metadata[col] = "empty"
            continue
        sample_str = sample.astype(str).str.strip()
        check_num = sample_str.replace(r'[R\$\s]', '', regex=True).str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
        is_numeric = pd.to_numeric(check_num, errors='coerce').notnull().mean() > 0.5
        is_date = pd.to_datetime(sample, errors='coerce', format='mixed').notnull().mean() > 0.5
        
        if is_numeric:
            column_metadata[col] = "numeric"
        elif is_date:
            column_metadata[col] = "temporal"
        else:
            column_metadata[col] = "categorical"
    return column_metadata

def universal_swap_fix(df):
    cols = df.columns.tolist()
    profiles = {}
    for col in cols:
        vals_as_str = df[col].astype(str).replace(['nan', 'None', 'NaT'], '').str.strip()
        profiles[col] = {
            "avg_len": vals_as_str.str.len().mean(),
            "avg_spaces": vals_as_str.str.count(" ").mean()
        }

    for i in range(len(cols)):
        for j in range(i + 1, len(cols)):
            col_a, col_b = cols[i], cols[j]
            p_a, p_b = profiles[col_a], profiles[col_b]

            if abs(p_a['avg_spaces'] - p_b['avg_spaces']) > 0.2 or abs(p_a['avg_len'] - p_b['avg_len']) > 2:
                for idx in df.index:
                    val_a_raw = df.at[idx, col_a]
                    val_b_raw = df.at[idx, col_b]
                    
                    val_a_str = str(val_a_raw).strip() if pd.notnull(val_a_raw) else ""
                    val_b_str = str(val_b_raw).strip() if pd.notnull(val_b_raw) else ""

                    if not val_a_str or not val_b_str: continue

                    if (val_a_str.count(" ") > val_b_str.count(" ") and p_a['avg_spaces'] < p_b['avg_spaces']) or \
                       (len(val_a_str) > len(val_b_str) + 5 and p_a['avg_len'] < p_b['avg_len']):
                        df.at[idx, col_a], df.at[idx, col_b] = val_b_raw, val_a_raw
    return df

def perform_full_cleaning(df):
    df = find_real_header(df)
    df = df.dropna(how='all', axis=1)

    meta = discover_column_types(df)

    for col, dtype in meta.items():
        if dtype == "numeric":
            df[col] = df[col].astype(str).str.replace(r'[R\$\s]', '', regex=True)
            df[col] = df[col].str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
            df[col] = pd.to_numeric(df[col], errors='coerce')
        elif dtype == "temporal":
            df[col] = pd.to_datetime(df[col], errors='coerce')
        else:
            df[col] = df[col].apply(normalize_string)
            df[col] = df[col].replace(['NAN', 'NONE', 'NAT', ''], np.nan)

    df = df.dropna(how='any').reset_index(drop=True)

    return df, meta


@app.post("/api/process")
async def process_data(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df_raw = pd.read_excel(io.BytesIO(contents), engine='openpyxl', header=0)
        
        df, meta = perform_full_cleaning(df_raw)
        
        res_df = df.copy()
        for col in res_df.columns:
            if meta.get(col) == "temporal":
                res_df[col] = res_df[col].apply(lambda x: x.strftime('%Y-%m-%d') if pd.notnull(x) else "")
            elif meta.get(col) == "numeric":
                res_df[col] = pd.to_numeric(res_df[col]).fillna(0)
            else:
                res_df[col] = res_df[col].fillna("")

        rows_data = res_df.to_dict(orient="records")

        upload_payload = {
            "filename": file.filename,
            "metadata": meta,
            "rows": rows_data
        }

        response = supabase.table("dashboard_uploads").insert(upload_payload).execute()

        if not response.data:
            raise Exception("The database did not return the entered record.")
            
        db_id = str(response.data[0].get("id"))

        return {
            "status": "success", 
            "db_id": db_id, 
            "data": rows_data, 
            "metadata": meta,
            "message": "Data processed and saved successfully"
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)