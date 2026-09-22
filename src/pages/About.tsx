import React from 'react';
import { Navigation } from '@/components/Layout/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Transparência por Padrão",
      description: "Eliminamos a 'caixa preta' dos processos seletivos. Candidatos e recrutadores têm total clareza sobre cada etapa."
    },
    {
      icon: Users,
      title: "Empatia em Escala",
      description: "A automação libera os humanos para se conectarem genuinamente. Tecnologia que facilita relacionamentos de alto valor."
    },
    {
      icon: Target,
      title: "Foco no Relacionamento",
      description: "Cada interação é uma oportunidade de construir relacionamentos duradouros, mesmo com candidatos não contratados."
    }
  ];

  const features = [
    {
      title: "Match Score Transparente",
      description: "Algoritmo que mostra exatamente por que um candidato é ou não adequado para uma vaga, promovendo transparência total no processo."
    },
    {
      title: "Experiência Gamificada",
      description: "Interface intuitiva tipo 'swipe' que torna a busca por vagas engajante e eficiente para os candidatos."
    },
    {
      title: "Pipeline Visual de Talentos",
      description: "Painel kanban que organiza candidatos por etapas, facilitando a gestão visual do funil de recrutamento."
    },
    {
      title: "Feedback Construtivo",
      description: "Sistema que elimina o 'ghosting' fornecendo feedback útil e construtivo para todos os candidatos."
    }
  ];

  const stats = [
    { number: "87%", label: "Redução no tempo de triagem" },
    { number: "92%", label: "Satisfação dos candidatos" },
    { number: "65%", label: "Aumento na qualidade das contratações" },
    { number: "78%", label: "Melhoria na marca empregadora" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Recrutamento Humanizado
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Sobre a Job Match
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolucionamos o recrutamento brasileiro substituindo a experiência frustrante dos ATS legados 
            por uma abordagem centrada no ser humano, transparente e verdadeiramente eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/jobs">
                Começar como Candidato
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/recruiter">Para Recrutadores</Link>
            </Button>
          </div>
        </div>

        {/* Mission Section */}
        <Card className="mb-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                <strong className="text-primary">Humanizar o recrutamento através da tecnologia.</strong> 
                {" "}Acreditamos que uma experiência de candidato superior, combinada com ferramentas 
                inteligentes para recrutadores, reduz o tempo e o custo de contratação enquanto 
                fortalece a marca empregadora.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores Fundamentais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Como Revolucionamos o Recrutamento</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                      <CheckCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="mb-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-12">Resultados que Comprovam nossa Eficácia</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-red-700">O Problema</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  Candidatos frustrados com processos opacos e "ghosting"
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  Recrutadores sobrecarregados com triagem manual ineficiente
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  ATS legados que prejudicam a experiência e a marca empregadora
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  Algoritmos "caixa preta" que descartam talentos qualificados
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-green-700">Nossa Solução</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Transparência total com Match Score explicativo
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Experiência de candidato engajante e respeitosa
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Automação inteligente que libera tempo para conexões humanas
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Pipeline visual que otimiza o trabalho do recrutador
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para Revolucionar seu Recrutamento?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se às empresas que já descobriram como atrair e reter os melhores talentos 
              com uma experiência verdadeiramente humanizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/recruiter">
                  <Shield className="w-5 h-5 mr-2" />
                  Começar Teste Gratuito
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Agendar Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;