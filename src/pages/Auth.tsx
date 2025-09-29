import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Briefcase, User } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const candidateSchema = loginSchema.extend({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  phone: z.string().optional(),
  currentPosition: z.string().optional(),
  location: z.string().optional(),
});

const recruiterSchema = loginSchema.extend({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  position: z.string().optional(),
  phone: z.string().optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "recruiter">("candidate");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      loginSchema.parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      const schema = userType === "candidate" ? candidateSchema : recruiterSchema;
      
      const data: any = {
        email,
        password,
        fullName,
      };

      if (userType === "recruiter") {
        data.companyName = formData.get("companyName") as string;
        data.position = formData.get("position") as string;
        data.phone = formData.get("phone") as string;
      } else {
        data.phone = formData.get("phone") as string;
        data.currentPosition = formData.get("currentPosition") as string;
        data.location = formData.get("location") as string;
      }

      schema.parse(data);

      const redirectUrl = `${window.location.origin}/`;

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: userType === "candidate" ? "candidate" : "recruiter",
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create role-specific profile
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (userType === "recruiter") {
          const { error: profileError } = await supabase
            .from("recruiter_profiles")
            .insert({
              user_id: user.id,
              company_name: data.companyName,
              position: data.position || null,
              phone: data.phone || null,
            });

          if (profileError) throw profileError;
        } else {
          const { error: profileError } = await supabase
            .from("candidate_profiles")
            .insert({
              user_id: user.id,
              phone: data.phone || null,
              current_position: data.currentPosition || null,
              location: data.location || null,
            });

          if (profileError) throw profileError;
        }
      }

      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer login.",
      });
      
      // Auto-login after signup
      await supabase.auth.signInWithPassword({ email, password });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
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
          <CardTitle className="text-3xl font-bold">Afin.co</CardTitle>
          <CardDescription>Recrutamento Afetivo</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-6 mt-4">
                <div className="space-y-3">
                  <Label>Você é:</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value) => setUserType(value as "candidate" | "recruiter")}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="candidate" id="candidate" className="peer sr-only" />
                      <Label
                        htmlFor="candidate"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <User className="mb-3 h-6 w-6" />
                        <span className="text-sm font-medium">Candidato</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="recruiter" id="recruiter" className="peer sr-only" />
                      <Label
                        htmlFor="recruiter"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Briefcase className="mb-3 h-6 w-6" />
                        <span className="text-sm font-medium">Recrutador</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullName">Nome Completo *</Label>
                    <Input
                      id="signup-fullName"
                      name="fullName"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha *</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>

                  {userType === "recruiter" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Empresa *</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Nome da empresa"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Cargo</Label>
                        <Input
                          id="position"
                          name="position"
                          placeholder="Ex: Gerente de RH"
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
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="currentPosition">Cargo Atual</Label>
                        <Input
                          id="currentPosition"
                          name="currentPosition"
                          placeholder="Ex: Desenvolvedor Frontend"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="Ex: São Paulo, SP"
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
                    </>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
