-- Check and fix database structure for NotAI DOC

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'cases', 'documents', 'document_types');

-- 2. Check foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('documents', 'cases');

-- 3. If tables don't exist, create them
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  document_type_id UUID REFERENCES document_types(id),
  original_filename TEXT,
  scan_file_path TEXT,
  scan_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 5. Create/recreate policies
DROP POLICY IF EXISTS user_select ON users;
DROP POLICY IF EXISTS user_insert ON users;
DROP POLICY IF EXISTS user_update ON users;

CREATE POLICY user_select ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY user_insert ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY user_update ON users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS case_select ON cases;
DROP POLICY IF EXISTS case_insert ON cases;
DROP POLICY IF EXISTS case_update ON cases;
DROP POLICY IF EXISTS case_delete ON cases;

CREATE POLICY case_select ON cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY case_insert ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY case_update ON cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY case_delete ON cases FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS document_select ON documents;
DROP POLICY IF EXISTS document_insert ON documents;
DROP POLICY IF EXISTS document_update ON documents;
DROP POLICY IF EXISTS document_delete ON documents;

CREATE POLICY document_select ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY document_insert ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY document_update ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY document_delete ON documents FOR DELETE USING (auth.uid() = user_id);

-- 6. Insert basic document types if they don't exist
INSERT INTO document_types (name, description) 
SELECT 'Akt notarialny', 'Oficjalny dokument sporządzony przez notariusza'
WHERE NOT EXISTS (SELECT 1 FROM document_types WHERE name = 'Akt notarialny');

INSERT INTO document_types (name, description) 
SELECT 'Wypis aktu notarialnego', 'Odpis aktu notarialnego'
WHERE NOT EXISTS (SELECT 1 FROM document_types WHERE name = 'Wypis aktu notarialnego');

INSERT INTO document_types (name, description) 
SELECT 'Pełnomocnictwo', 'Dokument uprawniający do działania w czyimś imieniu'
WHERE NOT EXISTS (SELECT 1 FROM document_types WHERE name = 'Pełnomocnictwo');

INSERT INTO document_types (name, description) 
SELECT 'Umowa sprzedaży', 'Umowa przeniesienia własności'
WHERE NOT EXISTS (SELECT 1 FROM document_types WHERE name = 'Umowa sprzedaży');

INSERT INTO document_types (name, description) 
SELECT 'Testament', 'Dokument zawierający rozporządzenie majątkiem na wypadek śmierci'
WHERE NOT EXISTS (SELECT 1 FROM document_types WHERE name = 'Testament'); 