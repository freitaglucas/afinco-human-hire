import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, candidateId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar skills da vaga
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('required_skills')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Buscar skills do candidato
    const { data: candidate, error: candidateError } = await supabase
      .from('candidate_profiles')
      .select('skills')
      .eq('user_id', candidateId)
      .single();

    if (candidateError) throw candidateError;

    // Calcular match score
    const jobSkills = job.required_skills || [];
    const candidateSkills = candidate.skills || [];
    
    let matchCount = 0;
    jobSkills.forEach((skill: string) => {
      if (candidateSkills.some((cs: string) => 
        cs.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(cs.toLowerCase())
      )) {
        matchCount++;
      }
    });

    const matchScore = jobSkills.length > 0 
      ? Math.round((matchCount / jobSkills.length) * 100)
      : 0;

    return new Response(
      JSON.stringify({ matchScore }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error calculating match score:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
