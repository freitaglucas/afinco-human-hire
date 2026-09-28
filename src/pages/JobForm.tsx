import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillSelector } from "@/components/Skills/SkillSelector";
import { fetchJobSkills, saveJobSkills, SelectedSkill } from "@/lib/skills";

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    company_id: "",
    title: "",
    description: "",
    location: "",
    salary_range: "",
    employment_type: "full-time",
    required_skills: [] as string[],
    min_years_experience: 0,
    seniority_level: "",
    pipeline_stages: ["Novas Candidaturas", "Triagem", "Entrevista", "Entrevista Final", "Aprovado", "Rejeitado"],
    status: "active"
  });

  const [jobSkills, setJobSkills] = useState<SelectedSkill[]>([]);
  const [stageInput, setStageInput] = useState("");

  useEffect(() => {
    loadCompanies();
    if (id) loadJob();
  }, [id]);

  const loadCompanies = async () => {
    const { data } = await supabase.from("companies").select("*");
    if (data) setCompanies(data);
  };

  const loadJob = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      toast({ title: "Erro ao carregar vaga", variant: "destructive" });
      return;
    }
    
    if (data) {
      fetchJobSkills(data.id).then(setJobSkills).catch(() => undefined);
      setFormData({
        ...data,
        min_years_experience: (data as any).min_years_experience || 0,
        seniority_level: (data as any).seniority_level || ""
      });
    }
  };

  const addStage = () => {
    if (stageInput.trim() && !formData.pipeline_stages.includes(stageInput.trim())) {
      setFormData({
        ...formData,
        pipeline_stages: [...formData.pipeline_stages, stageInput.trim()]
      });
      setStageInput("");
    }
  };

  const removeStage = (stage: string) => {
    setFormData({
      ...formData,
      pipeline_stages: formData.pipeline_stages.filter(s => s !== stage)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (jobSkills.length === 0) throw new Error("Selecione ao menos uma competência");
      const jobData = {
        ...formData,
        required_skills: jobSkills.map((s) => s.nome),
        recruiter_id: user?.id
      };

      if (id) {
        const { error } = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", id);
        
        if (error) throw error;
        await saveJobSkills(id, jobSkills);
        toast({ title: "Vaga atualizada com sucesso!" });
      } else {
        const { data: created, error } = await supabase
          .from("jobs")
          .insert([jobData])
          .select("id")
          .single();
        
        if (error) throw error;
        await saveJobSkills(created.id, jobSkills);
        toast({ title: "Vaga criada com sucesso!" });
      }
      
      navigate("/recruiter");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar vaga",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/recruiter")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">
            {id ? "Editar Vaga" : "Criar Nova Vaga"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="company_id">Empresa *</Label>
              <select
                id="company_id"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Selecione uma empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="title">Título da Vaga *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Desenvolvedor Full Stack"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a vaga, responsabilidades e requisitos..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              <div>
                <Label htmlFor="salary_range">Faixa Salarial</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="Ex: R$ 5.000 - R$ 8.000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment_type">Tipo de Contrato</Label>
                <select
                  id="employment_type"
                  value={formData.employment_type}
                  onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="full-time">CLT</option>
                  <option value="part-time">Meio Período</option>
                  <option value="contract">PJ</option>
                  <option value="internship">Estágio</option>
                </select>
              </div>

              <div>
                <Label htmlFor="seniority_level">Nível de Senioridade</Label>
                <select
                  id="seniority_level"
                  value={formData.seniority_level}
                  onChange={(e) => setFormData({ ...formData, seniority_level: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione o nível</option>
                  <option value="Estagiário">Estagiário</option>
                  <option value="Júnior">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                  <option value="Especialista">Especialista</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="min_years_experience">Anos de Experiência Mínimos</Label>
              <Input
                id="min_years_experience"
                type="number"
                min="0"
                value={formData.min_years_experience}
                onChange={(e) => setFormData({ ...formData, min_years_experience: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <Label>Competências Necessárias *</Label>
              <p className="text-xs text-muted-foreground mb-2">Defina o nível exigido (1–5), o peso (0–10) e se cada competência é obrigatória.</p>
              <SkillSelector mode="job" value={jobSkills} onChange={setJobSkills} />
            </div>

            <div>
              <Label>Etapas do Funil</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={stageInput}
                  onChange={(e) => setStageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStage())}
                  placeholder="Digite uma etapa"
                />
                <Button type="button" onClick={addStage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.pipeline_stages.map((stage) => (
                  <Badge key={stage} variant="outline" className="gap-1">
                    {stage}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeStage(stage)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Salvando..." : id ? "Atualizar Vaga" : "Criar Vaga"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/recruiter")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default JobForm;
