-- Adicionar campos adicionais à tabela candidate_profiles para perfil completo
ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS soft_skills text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS growth_opportunities jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS website_url text;