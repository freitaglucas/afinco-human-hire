CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  tipo text NOT NULL CHECK (tipo IN ('hard','soft')),
  categoria text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);

CREATE TABLE public.job_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  nivel_exigido int NOT NULL DEFAULT 3 CHECK (nivel_exigido BETWEEN 1 AND 5),
  peso int NOT NULL DEFAULT 5 CHECK (peso BETWEEN 0 AND 10),
  obrigatoria boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, skill_id)
);
GRANT SELECT ON public.job_skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_skills TO authenticated;
GRANT ALL ON public.job_skills TO service_role;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View skills of visible jobs" ON public.job_skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND (j.status = 'active' OR j.recruiter_id = auth.uid())));
CREATE POLICY "Recruiters manage own job skills" ON public.job_skills FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.recruiter_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.recruiter_id = auth.uid()));

CREATE TABLE public.candidate_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  nivel_declarado int NOT NULL DEFAULT 3 CHECK (nivel_declarado BETWEEN 1 AND 5),
  evidenciado_por_projeto boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (candidate_id, skill_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_skills TO authenticated;
GRANT ALL ON public.candidate_skills TO service_role;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Candidates manage own skills" ON public.candidate_skills FOR ALL TO authenticated
  USING (candidate_id = auth.uid()) WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "Recruiters view candidate skills" ON public.candidate_skills FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'recruiter'));

ALTER TABLE public.candidate_profiles ADD COLUMN senioridade_geral text
  CHECK (senioridade_geral IN ('Estagiário','Júnior','Pleno','Sênior','Especialista'));

INSERT INTO public.skills (nome, tipo, categoria) VALUES
('JavaScript','hard','Linguagem'),('TypeScript','hard','Linguagem'),('Python','hard','Linguagem'),('Java','hard','Linguagem'),('C#','hard','Linguagem'),('Go','hard','Linguagem'),('PHP','hard','Linguagem'),('Ruby','hard','Linguagem'),('Kotlin','hard','Linguagem'),('Swift','hard','Linguagem'),('SQL','hard','Linguagem'),
('React','hard','Framework'),('Angular','hard','Framework'),('Vue.js','hard','Framework'),('Next.js','hard','Framework'),('Node.js','hard','Framework'),('Django','hard','Framework'),('Spring Boot','hard','Framework'),('.NET','hard','Framework'),('React Native','hard','Framework'),('Flutter','hard','Framework'),
('Git','hard','Ferramenta'),('Docker','hard','Ferramenta'),('Kubernetes','hard','Ferramenta'),('AWS','hard','Ferramenta'),('Azure','hard','Ferramenta'),('Google Cloud','hard','Ferramenta'),('PostgreSQL','hard','Ferramenta'),('MongoDB','hard','Ferramenta'),('Figma','hard','Ferramenta'),('Power BI','hard','Ferramenta'),
('Liderança','soft','Gestão'),('Comunicação','soft','Relacionamento'),('Gestão de tempo','soft','Gestão'),('Trabalho em equipe','soft','Relacionamento'),('Resolução de problemas','soft','Cognitiva'),('Pensamento crítico','soft','Cognitiva'),('Adaptabilidade','soft','Comportamental'),('Negociação','soft','Relacionamento'),('Inteligência emocional','soft','Comportamental'),('Proatividade','soft','Comportamental');