import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '@/components/Layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CandidateStageModal } from '@/components/CandidateProfile/CandidateStageModal';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  Code2,
  Lightbulb,
  TrendingUp,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Star,
  Trophy,
  Target,
  ChevronRight,
  Clock,
  CheckCircle,
  X,
  UserCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock data - in real app this would come from API
const mockCandidateData = {
  id: '1',
  name: 'Ana Silva',
  title: 'Desenvolvedora Full Stack Senior',
  location: 'São Paulo, SP',
  email: 'ana.silva@email.com',
  phone: '+55 (11) 99999-9999',
  avatar: null,
  bio: 'Desenvolvedora apaixonada por tecnologia com 5+ anos de experiência em desenvolvimento web. Especializada em React, Node.js e arquiteturas cloud-native. Sempre em busca de novos desafios e oportunidades de crescimento.',
  
  // Professional Info
  experience: [
    {
      title: 'Desenvolvedora Full Stack Senior',
      company: 'TechCorp Brasil',
      period: 'Jan 2022 - Atual',
      description: 'Liderança técnica de equipe de 4 desenvolvedores, desenvolvimento de aplicações React/Node.js para +50k usuários ativos.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
    },
    {
      title: 'Desenvolvedora Frontend',
      company: 'StartupXYZ',
      period: 'Jun 2020 - Dez 2021',
      description: 'Desenvolvimento de interfaces modernas e responsivas, implementação de design systems e otimização de performance.',
      skills: ['React', 'Vue.js', 'CSS3', 'Webpack']
    }
  ],

  education: [
    {
      degree: 'Bacharelado em Ciência da Computação',
      institution: 'Universidade de São Paulo',
      period: '2016 - 2019',
      gpa: '8.5/10'
    }
  ],

  // Skills & Assessment
  technicalSkills: [
    { name: 'React', level: 90, years: 4 },
    { name: 'TypeScript', level: 85, years: 3 },
    { name: 'Node.js', level: 80, years: 3 },
    { name: 'Python', level: 70, years: 2 },
    { name: 'AWS', level: 75, years: 2 },
    { name: 'PostgreSQL', level: 80, years: 3 }
  ],

  softSkills: [
    'Liderança técnica',
    'Comunicação efetiva',
    'Resolução de problemas',
    'Trabalho em equipe',
    'Mentoria',
    'Gestão de tempo'
  ],

  // Projects Portfolio
  projects: [
    {
      id: '1',
      name: 'Sistema de E-commerce B2B',
      description: 'Plataforma completa de e-commerce para empresas com +1M de transações processadas.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      impact: 'Aumento de 35% na conversão de vendas',
      period: '2023',
      role: 'Tech Lead',
      team: '6 pessoas'
    },
    {
      id: '2',
      name: 'Dashboard Analytics Real-time',
      description: 'Dashboard de analytics em tempo real para monitoramento de KPIs empresariais.',
      technologies: ['Vue.js', 'D3.js', 'WebSocket', 'Redis'],
      impact: 'Redução de 50% no tempo de tomada de decisões',
      period: '2022',
      role: 'Frontend Lead',
      team: '4 pessoas'
    },
    {
      id: '3',
      name: 'API Gateway Microserviços',
      description: 'Gateway de APIs para arquitetura de microserviços com autenticação e rate limiting.',
      technologies: ['Node.js', 'Express', 'JWT', 'Docker'],
      impact: 'Suporte para 10k+ requests/min',
      period: '2021',
      role: 'Backend Developer',
      team: '3 pessoas'
    }
  ],

  // Growth Opportunities
  growthOpportunities: [
    {
      area: 'Arquitetura de Software',
      level: 'Avançado',
      interest: 95,
      timeframe: '6-12 meses',
      description: 'Interesse em evoluir para roles de Arquiteto de Software, com foco em sistemas distribuídos'
    },
    {
      area: 'Gestão de Produto',
      level: 'Intermediário',
      interest: 80,
      timeframe: '1-2 anos',
      description: 'Curiosidade sobre Product Management e estratégia de produto'
    },
    {
      area: 'DevOps & Infrastructure',
      level: 'Intermediário',
      interest: 75,
      timeframe: '6 meses',
      description: 'Aprofundar conhecimentos em CI/CD, Kubernetes e observabilidade'
    }
  ],

  // Self Assessment
  seniorityAssessment: {
    overall: 'Senior',
    technical: 85,
    leadership: 80,
    communication: 90,
    problemSolving: 88,
    learning: 92,
    areas: [
      {
        skill: 'Desenvolvimento Frontend',
        level: 'Senior',
        confidence: 90,
        evidence: ['5+ anos React', 'Liderança técnica', 'Projetos de alta escala']
      },
      {
        skill: 'Desenvolvimento Backend',
        level: 'Pleno+',
        confidence: 75,
        evidence: ['3+ anos Node.js', 'APIs REST/GraphQL', 'Microserviços']
      },
      {
        skill: 'Liderança Técnica',
        level: 'Senior',
        confidence: 85,
        evidence: ['Liderança de equipes', 'Mentoria', 'Code review']
      },
      {
        skill: 'DevOps/Cloud',
        level: 'Pleno',
        confidence: 65,
        evidence: ['AWS básico', 'Docker', 'CI/CD básico']
      }
    ]
  },

  // Application stages for different positions
  applicationStages: [
    {
      jobId: '1',
      jobTitle: 'Tech Lead Frontend',
      company: 'TechCorp Innovation',
      currentStage: 'interview',
      stages: [
        { name: 'Candidatura', status: 'completed' as const, date: '15/03/2024', feedback: 'Perfil aprovado para próxima etapa' },
        { name: 'Triagem RH', status: 'completed' as const, date: '18/03/2024', feedback: 'Excelente fit cultural e técnico' },
        { name: 'Entrevista Técnica', status: 'current' as const, date: '22/03/2024', feedback: 'Agendada para hoje às 14h' },
        { name: 'Entrevista Final', status: 'pending' as const, date: null, feedback: null },
        { name: 'Proposta', status: 'pending' as const, date: null, feedback: null }
      ]
    },
    {
      jobId: '2',
      jobTitle: 'Senior Full Stack Developer',
      company: 'StartupABC',
      currentStage: 'review',
      stages: [
        { name: 'Candidatura', status: 'completed' as const, date: '10/03/2024', feedback: 'Candidatura recebida' },
        { name: 'Análise de Perfil', status: 'current' as const, date: null, feedback: 'Em análise pelo time técnico' },
        { name: 'Teste Técnico', status: 'pending' as const, date: null, feedback: null },
        { name: 'Entrevista', status: 'pending' as const, date: null, feedback: null },
        { name: 'Decisão Final', status: 'pending' as const, date: null, feedback: null }
      ]
    }
  ],

  // Social links
  socialLinks: {
    linkedin: 'linkedin.com/in/ana-silva-dev',
    github: 'github.com/ana-silva',
    website: 'anasilva.dev'
  }
};

const CandidateProfile = () => {
  const { id, view } = useParams();
  const { user } = useAuth();
  const [selectedStageModal, setSelectedStageModal] = useState<typeof mockCandidateData.applicationStages[0] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isHRView = view === 'hr';

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        const profileId = id || user?.id;
        
        if (!profileId) {
          toast({
            title: "Erro",
            description: "Usuário não encontrado",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(profileId)) {
          toast({
            title: "Erro",
            description: "ID de perfil inválido",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) {
          toast({
            title: "Perfil não encontrado",
            description: "O perfil solicitado não existe",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { data: candidateProfile, error: candidateError } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('user_id', profileId)
          .maybeSingle();

        if (candidateError) throw candidateError;

        if (!candidateProfile) {
          toast({
            title: "Perfil incompleto",
            description: "Complete seu perfil de candidato para continuar",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Combine profile and candidate_profile data
        const combinedData = {
          id: profile.id,
          name: profile.full_name || 'Usuário',
          title: candidateProfile?.current_position || 'Profissional',
          location: candidateProfile?.location || 'Não informado',
          email: profile.email || '',
          phone: candidateProfile?.phone || '',
          avatar: profile.avatar_url || null,
          bio: 'Perfil em construção',
          experience: [],
          education: [],
          technicalSkills: (candidateProfile?.skills || []).map((skill: string) => ({
            name: skill,
            level: 70,
            years: 2
          })),
          softSkills: [],
          projects: [],
          growthOpportunities: [],
          seniorityAssessment: {
            overall: 'Pleno',
            technical: 70,
            leadership: 60,
            communication: 70,
            problemSolving: 70,
            learning: 75,
            areas: []
          },
          applicationStages: [],
          socialLinks: {
            linkedin: candidateProfile?.linkedin_url || '',
            github: '',
            website: ''
          }
        };

        setCandidateData(combinedData);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        currentPosition: formData.get("currentPosition") as string,
        location: formData.get("location") as string,
        phone: formData.get("phone") as string,
        skills: formData.get("skills") as string,
        desiredPositions: formData.get("desiredPositions") as string,
        yearsOfExperience: parseInt(formData.get("yearsOfExperience") as string) || 0,
      };

      const skillsArray = data.skills.split(",").map(s => s.trim()).filter(Boolean);
      const desiredPositionsArray = data.desiredPositions.split(",").map(s => s.trim()).filter(Boolean);

      const { error } = await supabase
        .from("candidate_profiles")
        .upsert({
          user_id: user?.id,
          current_position: data.currentPosition,
          location: data.location,
          phone: data.phone || null,
          skills: skillsArray,
          desired_positions: desiredPositionsArray,
          years_of_experience: data.yearsOfExperience,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Perfil criado!",
        description: "Seu perfil foi configurado com sucesso.",
      });

      // Reload the page to show the profile
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (!candidateData || !candidateData.name || !candidateData.title) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showProfileForm ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Perfil não encontrado</CardTitle>
                <CardDescription>Complete seu perfil para começar a usar a plataforma</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setShowProfileForm(true)} size="lg">
                  Criar perfil
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Complete seu perfil</CardTitle>
                <CardDescription>Preencha as informações para começar a usar a plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPosition">Cargo Atual *</Label>
                    <Input
                      id="currentPosition"
                      name="currentPosition"
                      placeholder="Ex: Desenvolvedor Frontend"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Ex: São Paulo, SP"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Habilidades * (separadas por vírgula)</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      placeholder="Ex: React, TypeScript, Node.js"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desiredPositions">Cargos Desejados * (separados por vírgula)</Label>
                    <Textarea
                      id="desiredPositions"
                      name="desiredPositions"
                      placeholder="Ex: Desenvolvedor Senior, Tech Lead"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Anos de Experiência *</Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      defaultValue="0"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowProfileForm(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={formLoading}>
                      {formLoading ? "Salvando..." : "Criar perfil"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  const candidate = candidateData;

  const getStageStatus = (stage: any) => {
    if (stage.status === 'completed') return { color: 'text-green-600', icon: CheckCircle };
    if (stage.status === 'current') return { color: 'text-blue-600', icon: Clock };
    return { color: 'text-gray-400', icon: Clock };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={candidate.avatar || ''} />
              <AvatarFallback className="text-2xl">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
              <p className="text-xl text-muted-foreground mb-3">{candidate.title}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {candidate.location}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {candidate.email}
                </div>
                {candidate.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {candidate.phone}
                  </div>
                )}
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {candidate.socialLinks.linkedin && (
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </Button>
                )}
                {candidate.socialLinks.github && (
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4 mr-1" />
                    GitHub
                  </Button>
                )}
                {candidate.socialLinks.website && (
                  <Button variant="outline" size="sm">
                    <Globe className="w-4 h-4 mr-1" />
                    Website
                  </Button>
                )}
              </div>
            </div>
          </div>

          {isHRView && (
            <div className="flex space-x-2">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-1" />
                Contatar
              </Button>
              <Button variant="recruiter">
                <UserCheck className="w-4 h-4 mr-1" />
                Avançar Processo
              </Button>
            </div>
          )}
        </div>

        {/* Bio */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed">{candidate.bio}</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="experience">Experiência</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="skills">Competências</TabsTrigger>
            <TabsTrigger value="growth">Crescimento</TabsTrigger>
            <TabsTrigger value="processes">Processos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Highlights */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Principais Destaques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">5+</div>
                      <div className="text-sm text-muted-foreground">Anos de Experiência</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">15+</div>
                      <div className="text-sm text-muted-foreground">Projetos Entregues</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experiência Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.experience && candidate.experience.length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{candidate.experience[0].title}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.experience[0].company} • {candidate.experience[0].period}</p>
                      </div>
                      <p className="text-sm">{candidate.experience[0].description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {candidate.experience[0].skills?.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma experiência cadastrada</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Technical Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Competências Principais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {candidate.technicalSkills.slice(0, 4).map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Seniority Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Auto-avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{candidate.seniorityAssessment.overall}</div>
                    <div className="text-sm text-muted-foreground">Nível Geral</div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Técnico</span>
                      <span className="font-medium">{candidate.seniorityAssessment.technical}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Liderança</span>
                      <span className="font-medium">{candidate.seniorityAssessment.leadership}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Comunicação</span>
                      <span className="font-medium">{candidate.seniorityAssessment.communication}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Professional Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experiência Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {index > 0 && <div className="absolute left-4 -top-3 w-0.5 h-3 bg-border"></div>}
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-semibold">{exp.title}</h4>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                            <p className="text-xs text-muted-foreground">{exp.period}</p>
                          </div>
                          <p className="text-sm">{exp.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {exp.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Formação Acadêmica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">{edu.period}</p>
                      </div>
                      {edu.gpa && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Nota: </span>
                          <span className="font-medium">{edu.gpa}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Portfólio de Projetos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.projects.map((project, index) => (
                  <div key={project.id} className="border-l-4 border-primary/20 pl-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.period} • {project.role} • {project.team}</p>
                      </div>
                    </div>
                    <p className="text-sm">{project.description}</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-800">Impacto:</div>
                      <div className="text-sm text-green-700">{project.impact}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Technical Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Competências Técnicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.technicalSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{skill.level}%</div>
                          <div>{skill.years} anos</div>
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Soft Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Competências Comportamentais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {candidate.softSkills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seniority Assessment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Auto-avaliação Detalhada de Senioridade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.seniorityAssessment.areas.map((area, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{area.skill}</h4>
                      <Badge variant={area.level === 'Senior' ? 'default' : 'outline'}>
                        {area.level}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Confiança</span>
                        <span>{area.confidence}%</span>
                      </div>
                      <Progress value={area.confidence} className="h-2" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium mb-1">Evidências:</div>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {area.evidence.map((evidence, evidenceIndex) => (
                          <li key={evidenceIndex}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Oportunidades de Crescimento Almejadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.growthOpportunities.map((opportunity, index) => (
                  <div key={index} className="border-l-4 border-primary pl-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{opportunity.area}</h4>
                        <p className="text-sm text-muted-foreground">Nível atual: {opportunity.level}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Interesse</div>
                        <div className="font-bold text-primary">{opportunity.interest}%</div>
                      </div>
                    </div>
                    <p className="text-sm">{opportunity.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Meta: {opportunity.timeframe}</span>
                      </div>
                      <Progress value={opportunity.interest} className="w-32 h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Processos Seletivos em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.applicationStages.map((application, index) => (
                  <div 
                    key={application.jobId} 
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedStageModal(application)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{application.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">{application.company}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{application.currentStage}</Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Mini Pipeline */}
                    <div className="grid grid-cols-5 gap-2">
                      {application.stages.map((stage, stageIndex) => {
                        const statusInfo = getStageStatus(stage);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <div key={stageIndex} className="text-center">
                            <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center ${
                              stage.status === 'completed' ? 'bg-green-100 border-green-300' :
                              stage.status === 'current' ? 'bg-blue-100 border-blue-300' :
                              'bg-gray-100 border-gray-300'
                            }`}>
                              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                            </div>
                            <div className="text-xs mt-1 text-muted-foreground truncate">
                              {stage.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stage Modal */}
      {selectedStageModal && (
        <CandidateStageModal 
          application={selectedStageModal}
          onClose={() => setSelectedStageModal(null)}
          isHRView={isHRView}
        />
      )}
    </div>
  );
};

export default CandidateProfile;