import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { SkillSelector } from "@/components/Skills/SkillSelector";
import { SeniorityThermometer } from "@/components/Seniority/SeniorityThermometer";
import { saveCandidateSkills, SelectedSkill, SENIORITY_LEVELS } from "@/lib/skills";

const onboardingSchema = z.object({
  currentPosition: z.string().min(2, "Cargo atual é obrigatório"),
  location: z.string().min(2, "Localização é obrigatória"),
  phone: z.string().optional(),
  desiredPositions: z.string().min(2, "Informe pelo menos um cargo desejado"),
  yearsOfExperience: z.number().min(0, "Experiência deve ser um número positivo"),
});

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SelectedSkill[]>([]);
  const [seniority, setSeniority] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        currentPosition: formData.get("currentPosition") as string,
        location: formData.get("location") as string,
        phone: formData.get("phone") as string,
        desiredPositions: formData.get("desiredPositions") as string,
        yearsOfExperience: parseInt(formData.get("yearsOfExperience") as string) || 0,
      };

      onboardingSchema.parse(data);

      if (skills.length === 0) throw new Error("Selecione ao menos uma competência");
      if (!seniority) throw new Error("Selecione sua senioridade geral");
      const skillsArray = skills.filter(s => s.tipo === "hard").map(s => s.nome);
      const desiredPositionsArray = data.desiredPositions.split(",").map(s => s.trim()).filter(Boolean);

      const { error } = await supabase
        .from("candidate_profiles")
        .upsert({
          user_id: user?.id,
          current_position: data.currentPosition,
          location: data.location,
          phone: data.phone || null,
          skills: skillsArray,
          soft_skills: skills.filter(s => s.tipo === "soft").map(s => s.nome),
          senioridade_geral: seniority,
          desired_positions: desiredPositionsArray,
          years_of_experience: data.yearsOfExperience,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      if (user) await saveCandidateSkills(user.id, skills);

      toast({
        title: "Perfil completo!",
        description: "Seu perfil foi configurado com sucesso.",
      });

      navigate("/jobs");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete seu perfil</CardTitle>
          <CardDescription>Preencha as informações para começar a usar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="seniority">Senioridade geral *</Label>
              <select
                id="seniority"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecione</option>
                {SENIORITY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {seniority && <SeniorityThermometer candidateLevel={seniority} />}
            </div>

            <div className="space-y-2">
              <Label>Competências *</Label>
              <SkillSelector mode="candidate" value={skills} onChange={setSkills} />
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Completar perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateOnboarding;
