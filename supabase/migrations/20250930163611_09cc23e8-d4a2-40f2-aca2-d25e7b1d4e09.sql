-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  employment_type TEXT,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  pipeline_stages TEXT[] NOT NULL DEFAULT '{"Novas Candidaturas","Triagem","Entrevista","Entrevista Final","Aprovado","Rejeitado"}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_stage TEXT NOT NULL,
  match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'rejected', 'hired', 'withdrawn')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create interactions table
CREATE TABLE public.interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('status_change', 'feedback', 'message', 'note')),
  content TEXT,
  metadata JSONB,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create talent_pool table (medalhistas de prata)
CREATE TABLE public.talent_pool (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, candidate_id)
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_pool ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Anyone can view companies"
  ON public.companies FOR SELECT
  USING (true);

CREATE POLICY "Recruiters can create companies"
  ON public.companies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'recruiter'
  ));

CREATE POLICY "Recruiters can update companies"
  ON public.companies FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'recruiter'
  ));

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active' OR recruiter_id = auth.uid());

CREATE POLICY "Recruiters can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (recruiter_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'recruiter'
  ));

CREATE POLICY "Recruiters can update their jobs"
  ON public.jobs FOR UPDATE
  USING (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can delete their jobs"
  ON public.jobs FOR DELETE
  USING (recruiter_id = auth.uid());

-- RLS Policies for applications
CREATE POLICY "Candidates can view their applications"
  ON public.applications FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid()
  ));

CREATE POLICY "Candidates can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Recruiters can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid()
  ));

-- RLS Policies for interactions
CREATE POLICY "Users can view interactions for their applications"
  ON public.interactions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT candidate_id FROM public.applications WHERE id = application_id
      UNION
      SELECT recruiter_id FROM public.jobs 
      JOIN public.applications ON jobs.id = applications.job_id
      WHERE applications.id = application_id
    )
  );

CREATE POLICY "Recruiters can create interactions"
  ON public.interactions FOR INSERT
  WITH CHECK (created_by = auth.uid() AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'recruiter'
  ));

-- RLS Policies for talent_pool
CREATE POLICY "Recruiters can view talent pool for their companies"
  ON public.talent_pool FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.recruiter_profiles
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Recruiters can add to talent pool"
  ON public.talent_pool FOR INSERT
  WITH CHECK (added_by = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_jobs_recruiter ON public.jobs(recruiter_id);
CREATE INDEX idx_jobs_company ON public.jobs(company_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_candidate ON public.applications(candidate_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_interactions_application ON public.interactions(application_id);
CREATE INDEX idx_talent_pool_company ON public.talent_pool(company_id);
CREATE INDEX idx_talent_pool_candidate ON public.talent_pool(candidate_id);