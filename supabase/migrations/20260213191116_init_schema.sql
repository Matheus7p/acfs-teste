CREATE TABLE dashboard_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  rows JSONB
);