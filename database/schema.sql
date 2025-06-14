-- Schema for NotAI DOC application

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
  auto_recognized BOOLEAN DEFAULT false,
  recognition_confidence FLOAT,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Extracted data table
CREATE TABLE IF NOT EXISTS extracted_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  confidence FLOAT
);

-- Document descriptions table
CREATE TABLE IF NOT EXISTS document_descriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  ai_generated_text TEXT,
  user_edited_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User styles table
CREATE TABLE IF NOT EXISTS user_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type_id UUID REFERENCES document_types(id),
  style_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Style examples table
CREATE TABLE IF NOT EXISTS style_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_style_id UUID NOT NULL REFERENCES user_styles(id) ON DELETE CASCADE,
  example_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_examples ENABLE ROW LEVEL SECURITY;

-- User table policies
CREATE POLICY user_select ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY user_insert ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY user_update ON users FOR UPDATE USING (auth.uid() = id);

-- Case table policies
CREATE POLICY case_select ON cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY case_insert ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY case_update ON cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY case_delete ON cases FOR DELETE USING (auth.uid() = user_id);

-- Document table policies
CREATE POLICY document_select ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY document_insert ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY document_update ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY document_delete ON documents FOR DELETE USING (auth.uid() = user_id);

-- Insert some basic document types
INSERT INTO document_types (name, description) VALUES
  ('Akt notarialny', 'Oficjalny dokument sporządzony przez notariusza'),
  ('Wypis aktu notarialnego', 'Odpis aktu notarialnego'),
  ('Pełnomocnictwo', 'Dokument uprawniający do działania w czyimś imieniu'),
  ('Umowa sprzedaży', 'Umowa przeniesienia własności'),
  ('Testament', 'Dokument zawierający rozporządzenie majątkiem na wypadek śmierci');

-- Expert standards table (community standards system)
CREATE TABLE IF NOT EXISTS expert_standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type_id UUID NOT NULL REFERENCES document_types(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  template_text TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Standard proposals table (community improvement system)
CREATE TABLE IF NOT EXISTS standard_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_standard_id UUID NOT NULL REFERENCES expert_standards(id) ON DELETE CASCADE,
  proposed_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  proposed_changes TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Proposal votes table (community voting system)
CREATE TABLE IF NOT EXISTS proposal_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES standard_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

-- RLS Policies for new tables
ALTER TABLE expert_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;

-- Expert standards policies (readable by all authenticated users)
CREATE POLICY expert_standards_select ON expert_standards FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY expert_standards_insert ON expert_standards FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY expert_standards_update ON expert_standards FOR UPDATE USING (auth.uid() = created_by);

-- Standard proposals policies
CREATE POLICY standard_proposals_select ON standard_proposals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY standard_proposals_insert ON standard_proposals FOR INSERT WITH CHECK (auth.uid() = proposed_by);
CREATE POLICY standard_proposals_update ON standard_proposals FOR UPDATE USING (auth.uid() = proposed_by);

-- Proposal votes policies
CREATE POLICY proposal_votes_select ON proposal_votes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY proposal_votes_insert ON proposal_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY proposal_votes_update ON proposal_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY proposal_votes_delete ON proposal_votes FOR DELETE USING (auth.uid() = user_id); 