from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        is_date = pd.to_datetime(sample, errors='coerce').notnull().mean() > 0.5
        
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
    df = df.replace(r'^\s*$', np.nan, regex=True)
    df = df.dropna(how='any')

    df = universal_swap_fix(df)
    meta = discover_column_types(df)

    for col, dtype in meta.items():
        if dtype == "numeric":
            df[col] = df[col].astype(str).str.replace(r'[R\$\s]', '', regex=True)
            df[col] = df[col].str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
            df[col] = pd.to_numeric(df[col], errors='coerce')
        elif dtype == "temporal":
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.date
        else:
            df[col] = df[col].astype(str).str.strip()
            if col.lower() == "categoria":
                df[col] = df[col].str.upper()

    df = df.dropna(how='any')
    return df, meta

@app.post("/api/process")
async def process_data(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df_raw = pd.read_excel(io.BytesIO(contents), engine='openpyxl')
        df, meta = perform_full_cleaning(df_raw)
        
        res_df = df.copy()
        for col in res_df.columns:
            if meta.get(col) == "temporal":
                res_df[col] = res_df[col].apply(lambda x: x.strftime('%Y-%m-%d') if pd.notnull(x) else "")
            elif meta.get(col) == "numeric":
                res_df[col] = pd.to_numeric(res_df[col])
            else:
                res_df[col] = res_df[col].fillna("")

        return {"status": "success", "data": res_df.to_dict(orient="records")}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)