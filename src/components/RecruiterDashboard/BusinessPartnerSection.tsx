import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Mock company data
const mockCompanyData = {
  company: {
    name: 'TechCorp Brasil',
    industry: 'Tecnologia',
    size: '300-500 funcionários',
    location: 'São Paulo, SP'
  },
  metrics: {
    headcount: {
      total: 387,
      growth: '+12%',
      trend: 'up'
    },
    turnover: {
      rate: 8.5,
      trend: 'down',
      benchmark: 15.2
    },
    timeToHire: {
      average: 28,
      target: 21,
      trend: 'up'
    },
    diversity: {
      women: 42,
      target: 50,
      minorities: 28
    }
  },
  departments: [
    { name: 'Engenharia', headcount: 156, openPositions: 8, priority: 'high' },
    { name: 'Produto', headcount: 45, openPositions: 3, priority: 'medium' },
    { name: 'Marketing', headcount: 32, openPositions: 2, priority: 'low' },
    { name: 'Vendas', headcount: 68, openPositions: 5, priority: 'high' },
    { name: 'RH', headcount: 18, openPositions: 1, priority: 'low' },
    { name: 'Financeiro', headcount: 24, openPositions: 0, priority: 'low' }
  ],
  hiringGoals: {
    q4Target: 25,
    completed: 18,
    inProgress: 12
  }
};

export const BusinessPartnerSection: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    const isGood = isPositive ? trend === 'up' : trend === 'down';
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Visão da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Empresa</p>
              <p className="font-semibold">{mockCompanyData.company.name}</p>
              <p className="text-sm text-muted-foreground">{mockCompanyData.company.industry}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tamanho</p>
              <p className="font-semibold">{mockCompanyData.company.size}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Localização</p>
              <p className="font-semibold">{mockCompanyData.company.location}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Headcount */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Headcount Total</p>
                <p className="text-2xl font-bold">{mockCompanyData.metrics.headcount.total}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-sm text-green-600">{mockCompanyData.metrics.headcount.growth}</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Turnover */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Turnover</p>
                <p className="text-2xl font-bold">{mockCompanyData.metrics.turnover.rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-sm text-green-600">vs {mockCompanyData.metrics.turnover.benchmark}% mercado</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Time to Hire */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time to Hire</p>
                <p className="text-2xl font-bold">{mockCompanyData.metrics.timeToHire.average} dias</p>
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Meta: {mockCompanyData.metrics.timeToHire.target} dias</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* Hiring Goal */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta Q4 2024</p>
                <p className="text-2xl font-bold">{mockCompanyData.hiringGoals.completed}/{mockCompanyData.hiringGoals.q4Target}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">{mockCompanyData.hiringGoals.inProgress} em andamento</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Visão por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCompanyData.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-semibold">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">{dept.headcount} funcionários</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{dept.openPositions} vagas abertas</p>
                    <Badge className={`text-xs ${getPriorityColor(dept.priority)}`}>
                      Prioridade {dept.priority === 'high' ? 'Alta' : dept.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diversity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Diversidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Representação Feminina</span>
                <span className="text-sm font-bold">{mockCompanyData.metrics.diversity.women}%</span>
              </div>
              <Progress value={mockCompanyData.metrics.diversity.women} className="h-2" />
              <p className="text-xs text-muted-foreground">Meta: {mockCompanyData.metrics.diversity.target}%</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Grupos Sub-representados</span>
                <span className="text-sm font-bold">{mockCompanyData.metrics.diversity.minorities}%</span>
              </div>
              <Progress value={mockCompanyData.metrics.diversity.minorities} className="h-2" />
              <p className="text-xs text-muted-foreground">Benchmark mercado: 25%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hiring Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso das Contratações Q4</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progresso da Meta</span>
              <span className="text-sm font-bold">
                {mockCompanyData.hiringGoals.completed} / {mockCompanyData.hiringGoals.q4Target} 
                ({Math.round((mockCompanyData.hiringGoals.completed / mockCompanyData.hiringGoals.q4Target) * 100)}%)
              </span>
            </div>
            <Progress 
              value={(mockCompanyData.hiringGoals.completed / mockCompanyData.hiringGoals.q4Target) * 100} 
              className="h-3" 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{mockCompanyData.hiringGoals.completed} contratados</span>
              <span>{mockCompanyData.hiringGoals.inProgress} em processo</span>
              <span>{mockCompanyData.hiringGoals.q4Target - mockCompanyData.hiringGoals.completed - mockCompanyData.hiringGoals.inProgress} restantes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};