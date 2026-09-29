import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Layout/Navigation';
import { JobCard } from '@/components/JobCard/JobCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  X,
  Search,
  Filter,
  Grid3x3,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { animate, motion, useAnimationControls, useMotionValue, useTransform } from 'framer-motion';

const SWIPE_THRESHOLD = 120;
const SWIPE_EXIT_DISTANCE = 760;

// Mock data for demonstration
const mockJobs = [
  {
    id: '1',
    title: 'Desenvolvedor Full Stack Senior',
    company: 'TechCorp Brasil',
    location: 'São Paulo, SP',
    type: 'Tempo Integral',
    salary: 'R$ 12.000 - R$ 18.000',
    description: 'Procuramos um desenvolvedor experiente para liderar projetos de alta complexidade, trabalhando com React, Node.js e AWS em um ambiente colaborativo e inovador.',
    requirements: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
    matchScore: 87,
    seniorityLevel: 'Sênior',
    matchFactors: {
      technical: ['Excelente aderência em React e TypeScript', 'Experiência sólida em Node.js'],
      experience: ['5+ anos de experiência compatível', 'Background em startups de tecnologia'],
      education: ['Formação em Ciência da Computação'],
      opportunities: ['Liderança técnica', 'Arquitetura de sistemas', 'Mentorar desenvolvedores junior']
    },
    postedAt: '2 dias atrás'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InovaCorp',
    location: 'Remote',
    type: 'Tempo Integral',
    salary: 'R$ 15.000 - R$ 22.000',
    description: 'Lidere a estratégia de produto para nossa plataforma SaaS B2B, trabalhando diretamente com stakeholders e equipes de engenharia.',
    requirements: ['Product Management', 'Analytics', 'SQL', 'Figma', 'Agile', 'B2B SaaS'],
    matchScore: 73,
    seniorityLevel: 'Pleno',
    matchFactors: {
      technical: ['Conhecimento em Analytics e SQL'],
      experience: ['3+ anos em gestão de produto'],
      education: ['MBA ou formação similar'],
      opportunities: ['Transição para liderança de produto', 'Experiência em B2B SaaS']
    },
    postedAt: '1 dia atrás'
  },
  {
    id: '3',
    title: 'UX Designer Senior',
    company: 'DesignLab',
    location: 'Rio de Janeiro, RJ',
    type: 'Tempo Integral',
    salary: 'R$ 8.000 - R$ 12.000',
    description: 'Crie experiências digitais excepcionais para nossos clientes enterprise, liderando pesquisa de usuário e design de interfaces.',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe Creative'],
    matchScore: 91,
    seniorityLevel: 'Pleno',
    matchFactors: {
      technical: ['Expert em Figma e Design Systems', 'Forte em User Research'],
      experience: ['Portfolio excepcional', '4+ anos em UX Design'],
      education: ['Design ou área relacionada'],
      opportunities: ['Liderança de design', 'Construir design system do zero']
    },
    postedAt: '3 dias atrás'
  }
];

const mockApplications = [
  {
    id: '1',
    jobTitle: 'Desenvolvedor Full Stack Senior',
    company: 'TechCorp Brasil',
    status: 'interview',
    appliedAt: '5 dias atrás',
    nextStep: 'Entrevista técnica agendada para amanhã às 14h'
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    company: 'InovaCorp',
    status: 'review',
    appliedAt: '3 dias atrás',
    nextStep: 'Currículo em análise pelo time de RH'
  },
  {
    id: '3',
    jobTitle: 'Frontend Developer',
    company: 'StartupXYZ',
    status: 'rejected',
    appliedAt: '1 semana atrás',
    nextStep: 'Processo encerrado - feedback disponível'
  }
];

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobs, setJobs] = useState(mockJobs);
  const [viewMode, setViewMode] = useState<'swipe' | 'serious'>('swipe');
  const [userName, setUserName] = useState<string>('');
  const [isSwipeLocked, setIsSwipeLocked] = useState(false);
  const swipeX = useMotionValue(0);
  const swipeRotate = useTransform(swipeX, [-300, 0, 300], [-11, 0, 11]);
  const matchOpacity = useTransform(swipeX, [20, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(swipeX, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const [candidateSeniority, setCandidateSeniority] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from('candidate_profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setCandidateSeniority((data as { senioridade_geral?: string | null } | null)?.senioridade_geral ?? null));
  }, [user]);
  const swipeControls = useAnimationControls();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setUserName(data.full_name || user.email?.split('@')[0] || 'Usuário');
      } else {
        setUserName(user.email?.split('@')[0] || 'Usuário');
      }
    };

    fetchUserProfile();
  }, [user]);

  const completeSwipe = (liked: boolean, jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && liked) {
      toast({
        title: "Candidatura enviada! 🎉",
        description: `Sua candidatura para ${job.title} na ${job.company} foi enviada com sucesso.`,
      });
    } else if (job) {
      toast({
        title: "Vaga descartada",
        description: "Vamos encontrar outras oportunidades mais adequadas para você.",
      });
    }
    nextJob();
  };

  const resetSwipeCard = async () => {
    swipeControls.set({ opacity: 1 });
    await animate(swipeX, 0, { type: 'spring', stiffness: 440, damping: 32 });
  };

  const commitSwipe = async (liked: boolean, jobId: string) => {
    if (isSwipeLocked) return;
    setIsSwipeLocked(true);
    const direction = liked ? 1 : -1;

    await Promise.all([
      animate(swipeX, direction * SWIPE_EXIT_DISTANCE, { duration: 0.28, ease: 'easeIn' }),
      swipeControls.start({ opacity: 0, transition: { duration: 0.24, ease: 'easeIn' } }),
    ]);

    completeSwipe(liked, jobId);
    swipeX.set(0);
    swipeControls.set({ opacity: 1 });
    setIsSwipeLocked(false);
  };

  const handleLike = (jobId: string) => void commitSwipe(true, jobId);
  const handleDislike = (jobId: string) => void commitSwipe(false, jobId);

  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(index => index + 1);
    } else {
      // No more jobs - could show empty state or load more
      toast({
        title: "Você viu todas as vagas!",
        description: "Novas oportunidades aparecem aqui regularmente. Volte em breve!",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'review':
        return { 
          label: 'Em Análise', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock 
        };
      case 'interview':
        return { 
          label: 'Entrevista', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Briefcase 
        };
      case 'approved':
        return { 
          label: 'Aprovado', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle 
        };
      case 'rejected':
        return { 
          label: 'Não selecionado', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: X 
        };
      default:
        return { 
          label: 'Enviado', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock 
        };
    }
  };

  const currentJob = jobs[currentJobIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo(a), {userName}! 👋</h1>
          <p className="text-muted-foreground">
            Encontramos <span className="font-semibold text-primary">{jobs.length} vagas</span> perfeitas para seu perfil
          </p>
        </div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Descobrir Vagas
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Minhas Candidaturas
            </TabsTrigger>
          </TabsList>

          {/* Job Discovery Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-muted/50 p-1 rounded-lg flex">
                <Button
                  variant={viewMode === 'swipe' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('swipe')}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Modo Swipe
                </Button>
                <Button
                  variant={viewMode === 'serious' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('serious')}
                  className="flex items-center gap-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                  Visualização Serious
                </Button>
              </div>
            </div>

            {/* Swipe Mode */}
            {viewMode === 'swipe' && (
              <div className="text-center">
                <div className="relative mx-auto mb-6 min-h-[430px] w-full max-w-md">
                  {currentJob ? (
                    <>
                      {jobs[currentJobIndex + 1] && (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-5 scale-[0.96] opacity-45">
                          <JobCard candidateSeniority={candidateSeniority} job={jobs[currentJobIndex + 1]} showActions={false} variant="swipe" />
                        </div>
                      )}
                      <motion.div
                        key={currentJob.id}
                        data-testid="dashboard-swipe-card"
                        drag={isSwipeLocked ? false : 'x'}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.72}
                        dragMomentum={false}
                        animate={swipeControls}
                        style={{ x: swipeX, rotate: swipeRotate }}
                        onDragEnd={(_, info) => {
                          if (Math.abs(info.offset.x) >= SWIPE_THRESHOLD) {
                            void commitSwipe(info.offset.x > 0, currentJob.id);
                          } else {
                            void resetSwipeCard();
                          }
                        }}
                        className="absolute inset-x-0 top-0 z-10 cursor-grab touch-pan-y select-none active:cursor-grabbing"
                      >
                        <motion.div
                          style={{ opacity: matchOpacity }}
                          className="pointer-events-none absolute right-5 top-5 z-20 rotate-6 rounded-md border-4 border-secondary px-4 py-2 text-2xl font-black text-secondary"
                        >
                          MATCH
                        </motion.div>
                        <motion.div
                          style={{ opacity: passOpacity }}
                          className="pointer-events-none absolute left-5 top-5 z-20 -rotate-6 rounded-md border-4 border-destructive px-4 py-2 text-2xl font-black text-destructive"
                        >
                          PASSAR
                        </motion.div>
                        <JobCard candidateSeniority={candidateSeniority}
                          job={currentJob}
                          onLike={handleLike}
                          onDislike={handleDislike}
                          variant="swipe"
                        />
                      </motion.div>
                    </>
                  ) : (
                    <Card className="w-full max-w-md mx-auto">
                      <CardContent className="p-12 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                          <Heart className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Parabéns!</h3>
                        <p className="text-muted-foreground">
                          Você viu todas as vagas disponíveis. Novas oportunidades 
                          aparecem regularmente!
                        </p>
                        <Button variant="candidate" onClick={() => setCurrentJobIndex(0)}>
                          Ver Vagas Novamente
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Progress Indicator */}
                {currentJob && (
                  <div className="flex justify-center space-x-2">
                    {jobs.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentJobIndex ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Serious Mode */}
            {viewMode === 'serious' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filtros:</span>
                    <Badge variant="outline">Todas as áreas</Badge>
                    <Badge variant="outline">Remoto/Presencial</Badge>
                    <Badge variant="outline">Match Score &gt; 70%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {jobs.length} vagas encontradas
                  </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid gap-6">
                  {jobs.map((job) => (
                    <JobCard candidateSeniority={candidateSeniority}
                      key={job.id}
                      job={job}
                      onLike={handleLike}
                      onDislike={handleDislike}
                      variant="list"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Dicas para Maximizar seu Match
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Complete seu perfil:</strong> Mais informações = matches mais precisos</li>
                  <li>• <strong>Seja específico:</strong> Inclua tecnologias e ferramentas que domina</li>
                  <li>• <strong>Atualize regularmente:</strong> Novos projetos aumentam suas chances</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-4">
              {mockApplications.map((application) => {
                const statusInfo = getStatusInfo(application.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{application.jobTitle}</h3>
                            <Badge className={`text-xs ${statusInfo.color} border`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{application.company}</p>
                          <p className="text-xs text-muted-foreground">
                            Candidatura enviada {application.appliedAt}
                          </p>
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">
                              <strong>Próximo passo:</strong> {application.nextStep}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {mockApplications.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">Nenhuma candidatura ainda</h3>
                    <p className="text-muted-foreground">
                      Comece descobrindo vagas ideais para seu perfil!
                    </p>
                    <Button variant="candidate" asChild>
                      <TabsTrigger value="discover">Descobrir Vagas</TabsTrigger>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateDashboard;