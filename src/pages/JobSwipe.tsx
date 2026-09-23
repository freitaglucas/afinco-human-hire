import { useEffect, useState } from "react";
import { animate, motion, useAnimationControls, useMotionValue, useTransform } from "framer-motion";
import { Briefcase, DollarSign, Heart, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

type SwipeJob = JobRow & {
  companies: {
    name: string;
    logo_url: string | null;
  } | null;
};

const SWIPE_THRESHOLD = 120;
const EXIT_DISTANCE = 760;

const JobSwipe = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<SwipeJob[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isInteractionLocked, setIsInteractionLocked] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-11, 0, 11]);
  const matchOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const cardControls = useAnimationControls();

  useEffect(() => {
    if (user) {
      void loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      const { data: appliedJobs } = await supabase
        .from("applications")
        .select("job_id")
        .eq("candidate_id", user?.id);

      const appliedJobIds = appliedJobs?.map((application) => application.job_id) ?? [];

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
      setJobs((data as SwipeJob[] | null) ?? []);
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar vagas",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    const currentJob = jobs[currentIndex];
    if (!currentJob) return false;

    if (!liked) {
      setCurrentIndex((index) => index + 1);
      return true;
    }

    try {
      const { data: matchData, error: matchError } = await supabase.functions.invoke(
        "calculate-match-score",
        {
          body: { jobId: currentJob.id, candidateId: user?.id },
        },
      );

      if (matchError) throw matchError;

      const matchScore = matchData?.matchScore ?? 0;
      const firstPipelineStage = currentJob.pipeline_stages[0];
      if (!firstPipelineStage) throw new Error("Esta vaga ainda não possui uma etapa inicial.");

      const { error: appError } = await supabase.from("applications").insert([
        {
          job_id: currentJob.id,
          candidate_id: user?.id,
          current_stage: firstPipelineStage,
          match_score: matchScore,
          status: "active",
        },
      ]);

      if (appError) throw appError;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user?.id)
        .single();

      await supabase.functions.invoke("send-application-email", {
        body: {
          to: profile?.email,
          candidateName: profile?.full_name,
          jobTitle: currentJob.title,
          companyName: currentJob.companies?.name,
          type: "application",
        },
      });

      toast({
        title: "Candidatura enviada!",
        description: `Você se candidatou para ${currentJob.title}. Match: ${matchScore}%`,
      });

      setCurrentIndex((index) => index + 1);
      return true;
    } catch (error: unknown) {
      toast({
        title: "Erro ao enviar candidatura",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetCard = async () => {
    cardControls.set({ opacity: 1 });
    await animate(x, 0, { type: "spring", stiffness: 440, damping: 32 });
  };

  const commitSwipe = async (liked: boolean) => {
    if (isInteractionLocked) return;
    setIsInteractionLocked(true);

    const direction = liked ? 1 : -1;
    await Promise.all([
      animate(x, direction * EXIT_DISTANCE, { duration: 0.28, ease: "easeIn" }),
      cardControls.start({ opacity: 0, transition: { duration: 0.24, ease: "easeIn" } }),
    ]);

    const succeeded = await handleSwipe(liked);
    x.set(0);
    cardControls.set({ opacity: 1 });

    if (!succeeded) {
      await resetCard();
    }

    setIsInteractionLocked(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Carregando vagas...</p>
      </div>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold">Não há mais vagas disponíveis</h2>
        <p className="mb-6 text-muted-foreground">Volte mais tarde para novas oportunidades!</p>
        <Button onClick={() => navigate("/jobs")}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 sm:p-6">
      <main className="w-full max-w-2xl">
        <div className="relative min-h-[570px] sm:min-h-[600px]">
          {nextJob && (
            <Card
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-6 h-[calc(100%-1.5rem)] scale-[0.96] overflow-hidden border-border/70 bg-card p-8 opacity-45 shadow-sm"
            >
              <div className="mb-6 pt-3">
                <h2 className="text-2xl font-bold">{nextJob.title}</h2>
                <p className="text-muted-foreground">{nextJob.companies?.name}</p>
              </div>
            </Card>
          )}

          <motion.div
            key={currentJob.id}
            data-testid="swipe-card"
            drag={isInteractionLocked ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.72}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) >= SWIPE_THRESHOLD) {
                void commitSwipe(info.offset.x > 0);
              } else {
                void resetCard();
              }
            }}
            animate={cardControls}
            style={{ x, rotate }}
            className="absolute inset-x-0 top-0 z-10 cursor-grab touch-pan-y select-none active:cursor-grabbing"
            whileTap={{ scale: 1.01 }}
          >
            <Card className="relative min-h-[550px] overflow-hidden p-6 shadow-xl sm:min-h-[580px] sm:p-8">
              <motion.div
                style={{ opacity: matchOpacity }}
                className="pointer-events-none absolute right-6 top-7 z-20 rotate-6 rounded-md border-4 border-secondary px-4 py-2 text-2xl font-black text-secondary"
              >
                MATCH
              </motion.div>
              <motion.div
                style={{ opacity: passOpacity }}
                className="pointer-events-none absolute left-6 top-7 z-20 -rotate-6 rounded-md border-4 border-destructive px-4 py-2 text-2xl font-black text-destructive"
              >
                PASSAR
              </motion.div>

              <div className="mb-6">
                {currentJob.companies?.logo_url && (
                  <img
                    src={currentJob.companies.logo_url}
                    alt={currentJob.companies.name}
                    className="mb-4 h-16 w-16 rounded-lg object-cover"
                    draggable={false}
                  />
                )}
                <h1 className="mb-2 pr-20 text-2xl font-bold sm:text-3xl">{currentJob.title}</h1>
                <p className="text-lg text-muted-foreground sm:text-xl">{currentJob.companies?.name}</p>
              </div>

              <div className="mb-7 space-y-3">
                {currentJob.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{currentJob.location}</span>
                  </div>
                )}
                {currentJob.salary_range && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span>{currentJob.salary_range}</span>
                  </div>
                )}
                {currentJob.employment_type && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span>{currentJob.employment_type}</span>
                  </div>
                )}
              </div>

              <div className="mb-7">
                <h3 className="mb-3 font-semibold">Descrição</h3>
                <p className="line-clamp-5 whitespace-pre-line text-muted-foreground">{currentJob.description}</p>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Competências necessárias</h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.required_skills?.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="relative z-20 mt-6 flex justify-center gap-5">
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Passar esta vaga"
            title="Passar"
            disabled={isInteractionLocked}
            onClick={() => void commitSwipe(false)}
            className="h-16 w-16 rounded-full border-destructive/40 text-destructive shadow-md hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-7 w-7" />
          </Button>
          <Button
            type="button"
            size="icon"
            aria-label="Dar match nesta vaga"
            title="Match"
            disabled={isInteractionLocked}
            onClick={() => void commitSwipe(true)}
            className="h-16 w-16 rounded-full bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90"
          >
            <Heart className="h-7 w-7" />
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Vaga {currentIndex + 1} de {jobs.length}
        </p>
      </main>
    </div>
  );
};

export default JobSwipe;