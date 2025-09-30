import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, X, MapPin, DollarSign, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobSwipe = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      // Buscar vagas ativas que o candidato ainda não se candidatou
      const { data: appliedJobs } = await supabase
        .from("applications")
        .select("job_id")
        .eq("candidate_id", user?.id);

      const appliedJobIds = appliedJobs?.map(app => app.job_id) || [];

      let query = supabase
        .from("jobs")
        .select(`
          *,
          companies (
            name,
            logo_url
          )
        `)
        .eq("status", "active");

      if (appliedJobIds.length > 0) {
        query = query.not("id", "in", `(${appliedJobIds.join(",")})`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vagas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (!liked) {
      // Just skip to next job
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const currentJob = jobs[currentIndex];
    
    try {
      // Calcular match score
      const { data: matchData, error: matchError } = await supabase.functions.invoke(
        'calculate-match-score',
        {
          body: { jobId: currentJob.id, candidateId: user?.id }
        }
      );

      if (matchError) throw matchError;

      const matchScore = matchData?.matchScore || 0;

      // Criar candidatura
      const { error: appError } = await supabase.from("applications").insert([{
        job_id: currentJob.id,
        candidate_id: user?.id,
        current_stage: currentJob.pipeline_stages[0],
        match_score: matchScore,
        status: "active"
      }]);

      if (appError) throw appError;

      // Buscar perfil do candidato para email
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user?.id)
        .single();

      // Enviar email de confirmação
      await supabase.functions.invoke('send-application-email', {
        body: {
          to: profile?.email,
          candidateName: profile?.full_name,
          jobTitle: currentJob.title,
          companyName: currentJob.companies.name,
          type: 'application'
        }
      });

      toast({
        title: "Candidatura enviada!",
        description: `Você se candidatou para ${currentJob.title}. Match: ${matchScore}%`,
      });

      setCurrentIndex(currentIndex + 1);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar candidatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando vagas...</p>
      </div>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">Não há mais vagas disponíveis</h2>
        <p className="text-muted-foreground mb-6">Volte mais tarde para novas oportunidades!</p>
        <Button onClick={() => navigate("/candidate")}>
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  const currentJob = jobs[currentIndex];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="p-8 relative">
          <div className="mb-6">
            {currentJob.companies?.logo_url && (
              <img
                src={currentJob.companies.logo_url}
                alt={currentJob.companies.name}
                className="h-16 w-16 rounded-lg object-cover mb-4"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{currentJob.title}</h1>
            <p className="text-xl text-muted-foreground">{currentJob.companies?.name}</p>
          </div>

          <div className="space-y-4 mb-8">
            {currentJob.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{currentJob.location}</span>
              </div>
            )}
            
            {currentJob.salary_range && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{currentJob.salary_range}</span>
              </div>
            )}
            
            {currentJob.employment_type && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{currentJob.employment_type}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-3">Descrição</h3>
            <p className="text-muted-foreground whitespace-pre-line">{currentJob.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-3">Competências Necessárias</h3>
            <div className="flex flex-wrap gap-2">
              {currentJob.required_skills?.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSwipe(false)}
              className="rounded-full h-16 w-16"
            >
              <X className="h-8 w-8" />
            </Button>
            <Button
              size="lg"
              onClick={() => handleSwipe(true)}
              className="rounded-full h-16 w-16"
            >
              <Heart className="h-8 w-8" />
            </Button>
          </div>
        </Card>

        <div className="text-center mt-4 text-muted-foreground">
          Vaga {currentIndex + 1} de {jobs.length}
        </div>
      </div>
    </div>
  );
};

export default JobSwipe;
