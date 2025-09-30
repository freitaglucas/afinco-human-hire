import React, { useState } from 'react';
import { Navigation } from '@/components/Layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MatchScore } from '@/components/MatchScore/MatchScore';
import { CandidateProfileModal } from '@/components/RecruiterDashboard/CandidateProfileModal';
import { TalentPoolSection } from '@/components/RecruiterDashboard/TalentPoolSection';
import { BusinessPartnerSection } from '@/components/RecruiterDashboard/BusinessPartnerSection';
import { 
  Plus, 
  Users, 
  Briefcase, 
  Search,
  Filter,
  MoreVertical,
  MessageSquare,
  UserCheck,
  UserX,
  Eye,
  Clock,
  TrendingUp,
  Star,
  Building2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for candidates - will be replaced with real data from applications
const mockCandidates: any[] = [];

const mockJobStats = {
  activeJobs: 3,
  totalApplications: 47,
  newApplications: 12,
  interviews: 8
};

const RecruiterDashboard = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedJob, setSelectedJob] = useState('Desenvolvedor Full Stack Senior');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  // Mock data for clickable stats
  const [activeJobsData] = useState([
    { id: 1, title: 'Desenvolvedor Full Stack Senior', applications: 15, status: 'active' },
    { id: 2, title: 'Product Designer', applications: 8, status: 'active' },
    { id: 3, title: 'DevOps Engineer', applications: 24, status: 'active' }
  ]);

  const handleViewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  const handleStatsClick = (type: string) => {
    switch (type) {
      case 'jobs':
        // Navigate to jobs tab or show jobs modal
        toast({ title: "Vagas Ativas", description: "Visualizando todas as vagas ativas" });
        break;
      case 'applications':
        toast({ title: "Candidaturas", description: "Visualizando todas as candidaturas" });
        break;
      case 'interviews':
        toast({ title: "Entrevistas", description: "Visualizando entrevistas agendadas" });
        break;
    }
  };

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case 'new':
        return { 
          label: 'Novos Candidatos', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          count: candidates.filter(c => c.stage === 'new').length
        };
      case 'review':
        return { 
          label: 'Em Análise', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          count: candidates.filter(c => c.stage === 'review').length
        };
      case 'interview':
        return { 
          label: 'Entrevista', 
          color: 'bg-green-100 text-green-800 border-green-200',
          count: candidates.filter(c => c.stage === 'interview').length
        };
      case 'approved':
        return { 
          label: 'Aprovados', 
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          count: candidates.filter(c => c.stage === 'approved').length
        };
      case 'rejected':
        return { 
          label: 'Rejeitados', 
          color: 'bg-red-100 text-red-800 border-red-200',
          count: candidates.filter(c => c.stage === 'rejected').length
        };
      default:
        return { label: 'Todos', color: 'bg-gray-100 text-gray-800 border-gray-200', count: 0 };
    }
  };

  const handleMoveCandidate = (candidateId: string, newStage: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, stage: newStage }
          : candidate
      )
    );
    
    const candidate = candidates.find(c => c.id === candidateId);
    const stageInfo = getStageInfo(newStage);
    
    toast({
      title: "Candidato movido!",
      description: `${candidate?.name} foi movido para "${stageInfo.label}".`,
    });
  };

  const stages = ['new', 'review', 'interview', 'approved', 'rejected'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard do Recrutador</h1>
            <p className="text-muted-foreground">
              Gerencie suas vagas e encontre os melhores talentos
            </p>
          </div>
          <Button variant="recruiter" onClick={() => setShowJobForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Vaga
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => handleStatsClick('jobs')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vagas Ativas</p>
                  <p className="text-2xl font-bold">{mockJobStats.activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => handleStatsClick('applications')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Candidaturas</p>
                  <p className="text-2xl font-bold">{mockJobStats.totalApplications}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Novas Candidaturas</p>
                  <p className="text-2xl font-bold text-blue-600">{mockJobStats.newApplications}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => handleStatsClick('interviews')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entrevistas</p>
                  <p className="text-2xl font-bold text-green-600">{mockJobStats.interviews}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline de Talentos</TabsTrigger>
            <TabsTrigger value="talent-pool">Banco de Talentos</TabsTrigger>
            <TabsTrigger value="business">Business Partner</TabsTrigger>
            <TabsTrigger value="jobs">Minhas Vagas</TabsTrigger>
          </TabsList>

          {/* Talent Pipeline */}
          <TabsContent value="pipeline" className="space-y-6">
            {/* Job Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Vaga Selecionada: {selectedJob}</span>
                  <Badge variant="outline">
                    {candidates.length} candidatos
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {stages.map(stage => {
                const stageInfo = getStageInfo(stage);
                const stageCandidates = candidates.filter(c => c.stage === stage);
                
                return (
                  <div key={stage} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{stageInfo.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {stageInfo.count}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 min-h-[500px] bg-muted/20 rounded-lg p-3">
                      {stageCandidates.map(candidate => (
                        <Card key={candidate.id} className="talent-card cursor-pointer hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Candidate Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  {candidate.avatar ? (
                                    <img 
                                      src={candidate.avatar} 
                                      alt={candidate.name} 
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                      <Users className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{candidate.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{candidate.title}</p>
                                  </div>
                                </div>
                                <MatchScore 
                                  score={candidate.matchScore} 
                                  size="sm" 
                                  matchFactors={candidate.matchFactors}
                                />
                              </div>

                              {/* Candidate Info */}
                              <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">
                                  {candidate.location} • {candidate.experience}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 3).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {candidate.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{candidate.skills.length - 3}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Candidatou-se {candidate.appliedAt}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-2">
                                 <Button 
                                   variant="outline" 
                                   size="sm" 
                                   className="flex-1 text-xs h-8"
                                   onClick={() => handleViewCandidate(candidate)}
                                 >
                                   <Eye className="w-3 h-3 mr-1" />
                                   Ver Perfil
                                 </Button>
                                
                                {stage === 'new' && (
                                  <Button 
                                    variant="candidate" 
                                    size="sm" 
                                    className="flex-1 text-xs h-8"
                                    onClick={() => handleMoveCandidate(candidate.id, 'review')}
                                  >
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Analisar
                                  </Button>
                                )}
                                
                                {stage === 'review' && (
                                  <>
                                    <Button 
                                      variant="candidate" 
                                      size="sm" 
                                      className="flex-1 text-xs h-8"
                                      onClick={() => handleMoveCandidate(candidate.id, 'interview')}
                                    >
                                      <MessageSquare className="w-3 h-3 mr-1" />
                                      Entrevistar
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-xs h-8 text-red-600 hover:bg-red-50"
                                      onClick={() => handleMoveCandidate(candidate.id, 'rejected')}
                                    >
                                      <UserX className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}

                                {stage === 'interview' && (
                                  <>
                                    <Button 
                                      variant="candidate" 
                                      size="sm" 
                                      className="flex-1 text-xs h-8"
                                      onClick={() => handleMoveCandidate(candidate.id, 'approved')}
                                    >
                                      <UserCheck className="w-3 h-3 mr-1" />
                                      Aprovar
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-xs h-8 text-red-600 hover:bg-red-50"
                                      onClick={() => handleMoveCandidate(candidate.id, 'rejected')}
                                    >
                                      <UserX className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {stageCandidates.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Nenhum candidato nesta etapa
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Talent Pool */}
          <TabsContent value="talent-pool" className="space-y-6">
            <TalentPoolSection />
          </TabsContent>

          {/* Business Partner */}
          <TabsContent value="business" className="space-y-6">
            <BusinessPartnerSection />
          </TabsContent>

          {/* Jobs Management */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gerencie suas Vagas</h3>
                <p className="text-muted-foreground mb-6">
                  Crie, edite e acompanhe o desempenho das suas vagas publicadas
                </p>
                <Button variant="recruiter" onClick={() => setShowJobForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Nova Vaga
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Job Creation Form (would be a modal in real app) */}
        {showJobForm && (
          <Card className="fixed inset-4 z-50 max-w-2xl mx-auto bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Nova Vaga
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowJobForm(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título da Vaga</Label>
                  <Input id="title" placeholder="Ex: Desenvolvedor Full Stack Senior" />
                </div>
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input id="location" placeholder="Ex: São Paulo, SP ou Remote" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Descreva a vaga, responsabilidades e o que vocês oferecem..." />
              </div>
              
              <div>
                <Label htmlFor="requirements">Competências Obrigatórias</Label>
                <Input id="requirements" placeholder="Ex: React, Node.js, TypeScript (separadas por vírgula)" />
              </div>
              
              <div className="flex gap-3">
                <Button variant="recruiter" className="flex-1" onClick={() => {
                  toast({ title: "Vaga publicada!", description: "Sua vaga está ativa e candidatos podem se candidatar." });
                  setShowJobForm(false);
                }}>
                  Publicar Vaga
                </Button>
                <Button variant="outline" onClick={() => setShowJobForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showJobForm && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowJobForm(false)} />}

        {/* Candidate Profile Modal */}
        <CandidateProfileModal
          candidate={selectedCandidate}
          isOpen={showCandidateModal}
          onClose={() => setShowCandidateModal(false)}
          onMoveCandidate={handleMoveCandidate}
        />
      </div>
    </div>
  );
};

export default RecruiterDashboard;