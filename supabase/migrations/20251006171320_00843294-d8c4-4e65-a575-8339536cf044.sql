-- Adicionar colunas de experiência e senioridade na tabela jobs
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS min_years_experience integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS seniority_level text;