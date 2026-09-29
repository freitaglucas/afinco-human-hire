import { Building2, Plus, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillSelector } from "@/components/Skills/SkillSelector";
import { SelectedSkill, SENIORITY_LEVELS } from "@/lib/skills";

export interface ExperienceRole {
  title: string;
  seniority: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CompanyExperience {
  company: string;
  roles: ExperienceRole[];
  skills: SelectedSkill[];
  // campos legados, derivados do cargo mais recente
  title?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  period?: string;
}

const emptyRole = (): ExperienceRole => ({ title: "", seniority: "", startDate: "", endDate: "", description: "" });

const fmt = (m: string) => {
  if (!m) return "";
  const [y, mo] = m.split("-");
  return `${mo}/${y}`;
};

export const periodOf = (r: { startDate?: string; endDate?: string }) =>
  r.startDate ? `${fmt(r.startDate)} – ${r.endDate ? fmt(r.endDate) : "atual"}` : "";

/** Converte registros antigos (um cargo, skills em texto) para o formato novo. */
export function normalizeExperience(raw: unknown): CompanyExperience {
  const e = (raw || {}) as Record<string, unknown>;
  const roles = Array.isArray(e.roles) && e.roles.length
    ? (e.roles as ExperienceRole[])
    : [{
        title: (e.title as string) || "",
        seniority: "",
        startDate: (e.startDate as string) || "",
        endDate: (e.endDate as string) || "",
        description: (e.description as string) || "",
      }];
  const skills = Array.isArray(e.skills) ? (e.skills as unknown[]).filter((s): s is SelectedSkill => typeof s === "object" && s !== null && "skill_id" in s) : [];
  return { company: (e.company as string) || "", roles, skills };
}

/** Prepara para salvar: cargo mais recente vira o resumo legado. */
export function serializeExperience(exp: CompanyExperience): CompanyExperience {
  const latest = exp.roles[exp.roles.length - 1] || emptyRole();
  const first = exp.roles[0] || emptyRole();
  return {
    ...exp,
    title: latest.title,
    description: latest.description,
    startDate: first.startDate,
    endDate: latest.endDate,
    period: periodOf({ startDate: first.startDate, endDate: latest.endDate }),
  };
}

interface Props {
  value: CompanyExperience[];
  onChange: (v: CompanyExperience[]) => void;
}

export const ExperienceEditor = ({ value, onChange }: Props) => {
  const setExp = (i: number, patch: Partial<CompanyExperience>) =>
    onChange(value.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const setRole = (i: number, r: number, patch: Partial<ExperienceRole>) =>
    setExp(i, { roles: value[i].roles.map((role, idx) => (idx === r ? { ...role, ...patch } : role)) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" /> Experiências Profissionais
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, { company: "", roles: [emptyRole()], skills: [] }])}>
          <Plus className="w-4 h-4 mr-1" /> Adicionar empresa
        </Button>
      </div>
      {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma empresa registrada ainda.</p>}

      {value.map((exp, i) => (
        <Card key={i} className="p-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label>Empresa</Label>
              <Input value={exp.company} onChange={(e) => setExp(i, { company: e.target.value })} placeholder="Ex: TechCorp" />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Cargos e evolução de senioridade</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setExp(i, { roles: [...exp.roles, emptyRole()] })}>
                <Plus className="w-4 h-4 mr-1" /> Promoção / novo cargo
              </Button>
            </div>
            <div className="border-l-2 border-primary/30 pl-4 space-y-4">
              {exp.roles.map((role, r) => (
                <div key={r} className="relative space-y-3">
                  <span className="absolute -left-[23px] top-2 h-3 w-3 rounded-full bg-primary" />
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Cargo</Label>
                      <Input value={role.title} onChange={(e) => setRole(i, r, { title: e.target.value })} placeholder="Ex: Desenvolvedor Frontend" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Senioridade</Label>
                      <select
                        value={role.seniority}
                        onChange={(e) => setRole(i, r, { seniority: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Selecione</option>
                        {SENIORITY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    {exp.roles.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setExp(i, { roles: exp.roles.filter((_, idx) => idx !== r) })}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Início</Label>
                      <Input type="month" value={role.startDate} onChange={(e) => setRole(i, r, { startDate: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Fim (vazio se atual)</Label>
                      <Input type="month" value={role.endDate} onChange={(e) => setRole(i, r, { endDate: e.target.value })} />
                    </div>
                  </div>
                  <Textarea value={role.description} onChange={(e) => setRole(i, r, { description: e.target.value })} placeholder="Responsabilidades e conquistas nesse cargo..." rows={2} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Competências trabalhadas nesta empresa</Label>
            <SkillSelector mode="candidate" value={exp.skills} onChange={(skills) => setExp(i, { skills })} />
          </div>
        </Card>
      ))}
    </div>
  );
};
