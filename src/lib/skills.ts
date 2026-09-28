import { supabase } from "@/integrations/supabase/client";

export const SENIORITY_LEVELS = ["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista"] as const;
export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number];

export const SKILL_LEVEL_LABELS: Record<number, string> = {
  1: "Básico",
  2: "Iniciante",
  3: "Intermediário",
  4: "Avançado",
  5: "Expert",
};

export interface Skill {
  id: string;
  nome: string;
  tipo: "hard" | "soft";
  categoria: string | null;
}

export interface SelectedSkill {
  skill_id: string;
  nome: string;
  tipo: "hard" | "soft";
  nivel: number;
  peso?: number;
  obrigatoria?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// New tables are not yet in generated types; use an untyped handle locally.
export const db = supabase as any;

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await db.from("skills").select("id, nome, tipo, categoria").order("nome");
  if (error) throw error;
  return data as Skill[];
}

export async function fetchCandidateSkills(candidateId: string): Promise<SelectedSkill[]> {
  const { data, error } = await db
    .from("candidate_skills")
    .select("skill_id, nivel_declarado, skills(nome, tipo)")
    .eq("candidate_id", candidateId);
  if (error) throw error;
  return (data || []).map((r: { skill_id: string; nivel_declarado: number; skills: { nome: string; tipo: "hard" | "soft" } }) => ({
    skill_id: r.skill_id,
    nome: r.skills.nome,
    tipo: r.skills.tipo,
    nivel: r.nivel_declarado,
  }));
}

export async function saveCandidateSkills(candidateId: string, skills: SelectedSkill[]) {
  const del = await db.from("candidate_skills").delete().eq("candidate_id", candidateId);
  if (del.error) throw del.error;
  if (skills.length === 0) return;
  const { error } = await db.from("candidate_skills").insert(
    skills.map((s) => ({ candidate_id: candidateId, skill_id: s.skill_id, nivel_declarado: s.nivel }))
  );
  if (error) throw error;
}

export async function fetchJobSkills(jobId: string): Promise<SelectedSkill[]> {
  const { data, error } = await db
    .from("job_skills")
    .select("skill_id, nivel_exigido, peso, obrigatoria, skills(nome, tipo)")
    .eq("job_id", jobId);
  if (error) throw error;
  return (data || []).map((r: { skill_id: string; nivel_exigido: number; peso: number; obrigatoria: boolean; skills: { nome: string; tipo: "hard" | "soft" } }) => ({
    skill_id: r.skill_id,
    nome: r.skills.nome,
    tipo: r.skills.tipo,
    nivel: r.nivel_exigido,
    peso: r.peso,
    obrigatoria: r.obrigatoria,
  }));
}

export async function saveJobSkills(jobId: string, skills: SelectedSkill[]) {
  const del = await db.from("job_skills").delete().eq("job_id", jobId);
  if (del.error) throw del.error;
  if (skills.length === 0) return;
  const { error } = await db.from("job_skills").insert(
    skills.map((s) => ({
      job_id: jobId,
      skill_id: s.skill_id,
      nivel_exigido: s.nivel,
      peso: s.peso ?? 5,
      obrigatoria: s.obrigatoria ?? false,
    }))
  );
  if (error) throw error;
}
