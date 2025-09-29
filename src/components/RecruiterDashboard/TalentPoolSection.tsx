import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MatchScore } from '@/components/MatchScore/MatchScore';
import { 
  Users, 
  Search,
  Filter,
  Star,
  Briefcase,
  MapPin,
  Calendar,
  Eye
} from 'lucide-react';

// Mock data for talent pool
const mockTalentPool = [
  {
    id: 'tp1',
    name: 'Roberto Lima',
    title: 'Desenvolvedor React Senior',
    location: 'São Paulo, SP',
    matchScore: 89,
    avatar: null,
    experience: '6 anos',
    skills: ['React', 'TypeScript', 'GraphQL', 'Next.js'],
    lastInteraction: '2 meses atrás',
    status: 'available',
    notes: 'Candidato forte, não foi contratado apenas por timing'
  },
  {
    id: 'tp2',
    name: 'Fernanda Costa',
    title: 'Product Designer',
    location: 'Remote',
    matchScore: 92,
    avatar: null,
    experience: '4 anos',
    skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping'],
    lastInteraction: '3 semanas atrás',
    status: 'interested',
    notes: 'Mostrou interesse em futuras oportunidades'
  },
  {
    id: 'tp3',
    name: 'Pedro Santos',
    title: 'DevOps Engineer',
    location: 'Belo Horizonte, MG',
    matchScore: 85,
    avatar: null,
    experience: '5 anos',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    lastInteraction: '1 mês atrás',
    status: 'passive',
    notes: 'Candidato passivo, mas aberto a oportunidades'
  }
];

export const TalentPoolSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'Disponível', color: 'bg-green-100 text-green-800' };
      case 'interested':
        return { label: 'Interessado', color: 'bg-blue-100 text-blue-800' };
      case 'passive':
        return { label: 'Passivo', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Todos', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredTalents = mockTalentPool.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || talent.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span>Banco de Talentos</span>
            </div>
            <Badge variant="outline">
              {mockTalentPool.length} talentos
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, cargo ou competências..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'available', 'interested', 'passive'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {getStatusInfo(status).label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map(talent => {
          const statusInfo = getStatusInfo(talent.status);
          
          return (
            <Card key={talent.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {talent.avatar ? (
                        <img 
                          src={talent.avatar} 
                          alt={talent.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{talent.name}</h4>
                        <p className="text-xs text-muted-foreground">{talent.title}</p>
                      </div>
                    </div>
                    <MatchScore 
                      score={talent.matchScore} 
                      size="sm" 
                    />
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center">
                    <Badge className={`text-xs ${statusInfo.color}`}>
                      {statusInfo.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{talent.experience}</span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{talent.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Última interação: {talent.lastInteraction}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {talent.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {talent.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{talent.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Notes */}
                  {talent.notes && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">{talent.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => window.open(`/profile/${talent.id}/hr`, '_blank')}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Perfil
                    </Button>
                    <Button 
                      variant="candidate" 
                      size="sm" 
                      className="flex-1 text-xs"
                    >
                      <Briefcase className="w-3 h-3 mr-1" />
                      Convidar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTalents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum talento encontrado</h3>
            <p className="text-muted-foreground">
              Ajuste os filtros ou tente uma busca diferente
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};