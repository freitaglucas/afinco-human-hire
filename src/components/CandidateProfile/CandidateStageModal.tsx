import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  X, 
  MessageSquare,
  Calendar,
  User,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  FileText,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Stage {
  name: string;
  status: 'completed' | 'current' | 'pending';
  date: string | null;
  feedback: string | null;
}

interface ApplicationStage {
  jobId: string;
  jobTitle: string;
  company: string;
  currentStage: string;
  stages: Stage[];
}

interface CandidateStageModalProps {
  application: ApplicationStage;
  onClose: () => void;
  isHRView?: boolean;
}

export const CandidateStageModal: React.FC<CandidateStageModalProps> = ({
  application,
  onClose,
  isHRView = false
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(
    application.stages.findIndex(s => s.status === 'current')
  );
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const getStageStatus = (stage: Stage) => {
    if (stage.status === 'completed') return { 
      color: 'text-green-600', 
      bgColor: 'bg-green-100 border-green-300', 
      icon: CheckCircle 
    };
    if (stage.status === 'current') return { 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100 border-blue-300', 
      icon: Clock 
    };
    return { 
      color: 'text-gray-400', 
      bgColor: 'bg-gray-100 border-gray-300', 
      icon: Clock 
    };
  };

  const handleAdvanceStage = () => {
    toast({
      title: "Candidato avançado!",
      description: `Candidato movido para a próxima etapa do processo.`,
    });
    // In real app, this would update the backend
  };

  const handleRejectCandidate = () => {
    toast({
      title: "Candidato rejeitado",
      description: "Feedback enviado ao candidato automaticamente.",
    });
    // In real app, this would update the backend
    onClose();
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmittingFeedback(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Feedback enviado!",
      description: "Sua avaliação foi registrada com sucesso.",
    });
    
    setFeedback('');
    setIsSubmittingFeedback(false);
  };

  const selectedStage = application.stages[selectedStageIndex];
  const statusInfo = getStageStatus(selectedStage);
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold">{application.jobTitle}</div>
              <div className="text-sm text-muted-foreground font-normal">{application.company}</div>
            </div>
            <Badge variant="outline" className="ml-4">
              Processo Ativo
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Andamento do Processo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                {application.stages.map((stage, index) => {
                  const stageStatusInfo = getStageStatus(stage);
                  const StageIcon = stageStatusInfo.icon;
                  const isSelected = index === selectedStageIndex;
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                      <button
                        onClick={() => setSelectedStageIndex(index)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'ring-2 ring-primary ring-offset-2 ' + stageStatusInfo.bgColor
                            : stageStatusInfo.bgColor
                        } hover:scale-105`}
                      >
                        <StageIcon className={`w-5 h-5 ${stageStatusInfo.color}`} />
                      </button>
                      <div className="text-center">
                        <div className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {stage.name}
                        </div>
                        {stage.date && (
                          <div className="text-xs text-muted-foreground">
                            {stage.date}
                          </div>
                        )}
                      </div>
                      {index < application.stages.length - 1 && (
                        <div className="absolute top-6 w-full h-0.5 bg-border -z-10" 
                             style={{ left: '50%', width: 'calc(100% - 48px)' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stage Navigation */}
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedStageIndex(Math.max(0, selectedStageIndex - 1))}
                  disabled={selectedStageIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Etapa {selectedStageIndex + 1} de {application.stages.length}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedStageIndex(Math.min(application.stages.length - 1, selectedStageIndex + 1))}
                  disabled={selectedStageIndex === application.stages.length - 1}
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Stage Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                  {selectedStage.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className={statusInfo.bgColor.replace('bg-', 'bg-').replace('-100', '-100') + ' text-' + statusInfo.color.replace('text-', '')}>
                    {selectedStage.status === 'completed' ? 'Concluída' : 
                     selectedStage.status === 'current' ? 'Em Andamento' : 'Pendente'}
                  </Badge>
                </div>
                
                {selectedStage.date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data:</span>
                    <span className="text-sm font-medium">{selectedStage.date}</span>
                  </div>
                )}

                {selectedStage.feedback && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Feedback:</Label>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      {selectedStage.feedback}
                    </div>
                  </div>
                )}

                {!selectedStage.feedback && selectedStage.status === 'pending' && (
                  <div className="text-sm text-muted-foreground italic">
                    Aguardando início desta etapa
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Panel */}
            {isHRView && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Ações do Recrutador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedStage.status === 'current' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="feedback">Adicionar Feedback</Label>
                        <Textarea 
                          id="feedback"
                          placeholder="Descreva a avaliação desta etapa..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={3}
                        />
                        <Button 
                          size="sm" 
                          onClick={handleSubmitFeedback}
                          disabled={!feedback.trim() || isSubmittingFeedback}
                          className="w-full"
                        >
                          {isSubmittingFeedback ? 'Enviando...' : 'Salvar Feedback'}
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Button 
                          variant="default"
                          onClick={handleAdvanceStage}
                          className="w-full"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Avançar para Próxima Etapa
                        </Button>
                        
                        <Button 
                          variant="destructive"
                          onClick={handleRejectCandidate}
                          className="w-full"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Reprovar Candidato
                        </Button>
                      </div>
                    </>
                  )}

                  {selectedStage.status === 'completed' && (
                    <div className="text-center py-4">
                      <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                      <div className="text-sm font-medium">Etapa Concluída</div>
                      <div className="text-xs text-muted-foreground">
                        Esta etapa foi finalizada com sucesso
                      </div>
                    </div>
                  )}

                  {selectedStage.status === 'pending' && (
                    <div className="text-center py-4">
                      <Clock className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <div className="text-sm font-medium">Etapa Pendente</div>
                      <div className="text-xs text-muted-foreground">
                        Aguardando conclusão das etapas anteriores
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Candidate View - Timeline */}
            {!isHRView && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedStage.status === 'current' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900">Etapa Atual</div>
                          <div className="text-sm text-blue-700">
                            {selectedStage.feedback || 'Processo em andamento. Aguarde atualizações.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStage.status === 'completed' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-900">Etapa Concluída</div>
                          <div className="text-sm text-green-700">
                            {selectedStage.feedback || 'Esta etapa foi concluída com sucesso.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Timeline do Processo:</div>
                    {application.stages.map((stage, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          stage.status === 'completed' ? 'bg-green-100 border-green-300' :
                          stage.status === 'current' ? 'bg-blue-100 border-blue-300' :
                          'bg-gray-100 border-gray-300'
                        }`}>
                          {stage.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-600" />}
                          {stage.status === 'current' && <Clock className="w-3 h-3 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            stage.status === 'current' ? 'text-blue-900' : 'text-muted-foreground'
                          }`}>
                            {stage.name}
                          </div>
                          {stage.date && (
                            <div className="text-xs text-muted-foreground">{stage.date}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};