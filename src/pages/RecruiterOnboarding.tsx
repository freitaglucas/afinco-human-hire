import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const onboardingSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  position: z.string().min(2, "Cargo é obrigatório"),
  phone: z.string().optional(),
});

const RecruiterOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
        companyName: formData.get("companyName") as string,
        position: formData.get("position") as string,
        phone: formData.get("phone") as string,
      };

      onboardingSchema.parse(data);

      const { error } = await supabase
        .from("recruiter_profiles")
        .upsert({
          user_id: user?.id,
          company_name: data.companyName,
          position: data.position,
          phone: data.phone || null,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Perfil completo!",
        description: "Seu perfil foi configurado com sucesso.",
      });

      navigate("/recruiter");
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
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Ex: Tech Solutions"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Seu Cargo *</Label>
              <Input
                id="position"
                name="position"
                placeholder="Ex: Gerente de RH"
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Completar perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterOnboarding;
