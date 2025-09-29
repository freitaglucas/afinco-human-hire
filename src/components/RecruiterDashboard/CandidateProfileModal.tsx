import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchScore } from '@/components/MatchScore/MatchScore';
import { 
  Users, 
  MapPin, 
  Calendar, 
  MessageSquare,
  UserCheck,
  UserX,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

interface CandidateProfileModalProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
  onMoveCandidate: (candidateId: string, newStage: string) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onMoveCandidate
}) => {
  if (!candidate) return null;

  const mockContactInfo = {
    email: 'ana.silva@email.com',
    phone: '(11) 99999-9999',
    linkedin: 'linkedin.com/in/ana-silva'
  };

  const mockExperience = [
    {
      company: 'TechCorp',
      role: 'Desenvolvedora Full Stack Senior',
      period: '2021 - Atual',
      description: 'Desenvolvimento de aplicações web usando React, Node.js e AWS.'
    },
    {
      company: 'StartupXYZ',
      role: 'Desenvolvedora Frontend',
      period: '2019 - 2021',
      description: 'Criação de interfaces responsivas e experiência do usuário.'
    }
  ];

  const getNextStageAction = (currentStage: string) => {
    switch (currentStage) {
      case 'new':
        return { stage: 'review', label: 'Mover para Análise', icon: UserCheck };
      case 'review':
        return { stage: 'interview', label: 'Agendar Entrevista', icon: MessageSquare };
      case 'interview':
        return { stage: 'approved', label: 'Aprovar Candidato', icon: UserCheck };
      default:
        return null;
    }
  };

  const nextAction = getNextStageAction(candidate.stage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {candidate.avatar ? (
              <img 
                src={candidate.avatar} 
                alt={candidate.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.title}</p>
            </div>
            <div className="ml-auto">
              <MatchScore 
                score={candidate.matchScore} 
                size="lg" 
                matchFactors={candidate.matchFactors}
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{mockContactInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{mockContactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{mockContactInfo.linkedin}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Candidatou-se {candidate.appliedAt}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experiência Profissional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockExperience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-semibold">{exp.role}</h4>
                    <p className="text-sm text-primary font-medium">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Match Details */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`/profile/${candidate.id}/hr`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Perfil Completo
                </Button>
                
                {nextAction && (
                  <Button 
                    variant="candidate" 
                    className="w-full"
                    onClick={() => {
                      onMoveCandidate(candidate.id, nextAction.stage);
                      onClose();
                    }}
                  >
                    <nextAction.icon className="w-4 h-4 mr-2" />
                    {nextAction.label}
                  </Button>
                )}
                
                {candidate.stage !== 'rejected' && (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:bg-red-50"
                    onClick={() => {
                      onMoveCandidate(candidate.id, 'rejected');
                      onClose();
                    }}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Rejeitar Candidato
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Match Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fatores de Match</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Competências Técnicas</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {candidate.matchFactors.technical.map((factor: string, index: number) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Experiência</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {candidate.matchFactors.experience.map((factor: string, index: number) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Formação</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {candidate.matchFactors.education.map((factor: string, index: number) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Oportunidades</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {candidate.matchFactors.opportunities.map((factor: string, index: number) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};