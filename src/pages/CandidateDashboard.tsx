import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobs, setJobs] = useState(mockJobs);

  const handleLike = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast({
        title: "Candidatura enviada! 🎉",
        description: `Sua candidatura para ${job.title} na ${job.company} foi enviada com sucesso.`,
      });
      nextJob();
    }
  };

  const handleDislike = (jobId: string) => {
    toast({
      title: "Vaga descartada",
      description: "Vamos encontrar outras oportunidades mais adequadas para você.",
    });
    nextJob();
  };

  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
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
          <h1 className="text-3xl font-bold mb-2">Bem-vinda, Ana! 👋</h1>
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
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {currentJob ? (
                  <JobCard
                    job={currentJob}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    variant="swipe"
                  />
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