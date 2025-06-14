-- Migration: Add auto recognition fields to documents table
-- Date: 2024-12-15

-- Add auto_recognized field to track if document type was automatically recognized
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS auto_recognized BOOLEAN DEFAULT false;

-- Add recognition_confidence field to store AI confidence level (0-100)
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS recognition_confidence FLOAT;

-- Add comment for documentation
COMMENT ON COLUMN documents.auto_recognized IS 'Indicates if document type was automatically recognized by AI';
COMMENT ON COLUMN documents.recognition_confidence IS 'AI confidence level for document type recognition (0-100)'; 