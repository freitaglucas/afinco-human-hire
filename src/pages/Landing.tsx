import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Layout/Navigation';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Zap,
  Eye,
  Clock
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="mx-auto">
              🚀 Recrutamento Reinventado para o Brasil
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Conectamos{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Talentos
              </span>{' '}
              com{' '}
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Oportunidades
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A primeira plataforma de recrutamento brasileira que prioriza transparência, 
              empatia e relacionamentos genuínos. Candidatos encontram vagas ideais, 
              recrutadores descobrem talentos excepcionais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/jobs">
                  <Heart className="w-5 h-5 mr-2" />
                  Encontrar Vagas Ideais
                </Link>
              </Button>
              <Button variant="recruiter" size="xl" asChild>
                <Link to="/recruiter">
                  <Users className="w-5 h-5 mr-2" />
                  Contratar Talentos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa Filosofia: Humanizar o Recrutamento
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada princípio da Job Match foi criado para revolucionar a experiência 
              de candidatos e recrutadores no mercado brasileiro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Transparência por Padrão</h3>
                <p className="text-muted-foreground">
                  Acabamos com a "caixa preta" do recrutamento. Candidatos e recrutadores 
                  têm clareza total sobre cada etapa do processo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Empatia em Escala</h3>
                <p className="text-muted-foreground">
                  A tecnologia libera os humanos para se conectarem. Automatizamos tarefas 
                  repetitivas para focar em relacionamentos genuínos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/20 to-accent/30">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Foco no Relacionamento</h3>
                <p className="text-muted-foreground">
                  Cada interação é uma oportunidade de construir relacionamentos duradouros, 
                  mesmo com candidatos não contratados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* For Candidates */}
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4">Para Candidatos</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Uma Experiência que Você Vai Amar
                </h2>
                <p className="text-lg text-muted-foreground">
                  Pare de preencher o mesmo formulário repetidamente. Crie seu perfil uma vez 
                  e candidate-se a vagas ideais com transparência total.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Match Score Transparente</h3>
                    <p className="text-muted-foreground">
                      Veja exatamente por que você é compatível com cada vaga, 
                      com detalhes sobre competências e oportunidades de crescimento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Candidatura com Um Clique</h3>
                    <p className="text-muted-foreground">
                      Seu perfil funciona como um "passaporte" para todas as vagas. 
                      Sem formulários repetitivos, sem perda de tempo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Acompanhamento em Tempo Real</h3>
                    <p className="text-muted-foreground">
                      Sempre saiba em que etapa está seu processo seletivo. 
                      Chega de "ghosting" e incertezas.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="candidate" size="lg" asChild>
                <Link to="/jobs">
                  <Heart className="w-5 h-5 mr-2" />
                  Começar Jornada como Candidato
                </Link>
              </Button>
            </div>

            {/* For Recruiters */}
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4">Para Recrutadores</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  O Co-piloto dos Seus Sonhos
                </h2>
                <p className="text-lg text-muted-foreground">
                  Pare de perder tempo triando currículos inadequados. Foque no que importa: 
                  entrevistar os melhores talentos para sua empresa.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Triagem Inteligente por Score</h3>
                    <p className="text-muted-foreground">
                      Os candidatos mais compatíveis aparecem primeiro, automaticamente. 
                      Reduza seu tempo de triagem em até 80%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Pipeline Visual de Talentos</h3>
                    <p className="text-muted-foreground">
                      Gerencie candidatos com arrastar e soltar. Veja seu funil de 
                      recrutamento como nunca antes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comunicação Automática</h3>
                    <p className="text-muted-foreground">
                      Candidatos recebem atualizações automáticas sobre o status. 
                      Fortaleça sua marca empregadora sem esforço extra.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="recruiter" size="lg" asChild>
                <Link to="/recruiter">
                  <Users className="w-5 h-5 mr-2" />
                  Começar a Contratar Melhor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para Revolucionar Seu Recrutamento?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se às empresas brasileiras que já descobriram uma forma mais humana, 
            transparente e eficiente de conectar talentos com oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Começar Gratuitamente
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/demo">
                Ver Demonstração
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 Job Match — Recrutamento Transparente. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              Feito com ❤️ para humanizar o recrutamento no Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;