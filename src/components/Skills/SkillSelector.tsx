import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { fetchSkills, SelectedSkill, Skill, SKILL_LEVEL_LABELS } from "@/lib/skills";
import { cn } from "@/lib/utils";

interface SkillSelectorProps {
  value: SelectedSkill[];
  onChange: (skills: SelectedSkill[]) => void;
  mode: "job" | "candidate";
}

const LevelPicker = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <div className="w-56 space-y-1 pt-1">
    <Slider min={1} max={5} step={1} value={[value]} onValueChange={([n]) => onChange(n)} />
    <div className="flex justify-between text-[10px] text-muted-foreground">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={cn(n === value && "font-semibold text-primary")}>{n}</span>
      ))}
    </div>
  </div>
);

export const SkillSelector = ({ value, onChange, mode }: SkillSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: skills = [], isLoading } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills, staleTime: Infinity });

  const selectedIds = new Set(value.map((s) => s.skill_id));

  const toggle = (skill: Skill) => {
    if (selectedIds.has(skill.id)) {
      onChange(value.filter((s) => s.skill_id !== skill.id));
    } else {
      onChange([
        ...value,
        { skill_id: skill.id, nome: skill.nome, tipo: skill.tipo, nivel: 3, ...(mode === "job" ? { peso: 5, obrigatoria: false } : {}) },
      ]);
    }
  };

  const update = (id: string, patch: Partial<SelectedSkill>) =>
    onChange(value.map((s) => (s.skill_id === id ? { ...s, ...patch } : s)));

  const groups = [
    { label: "Competências técnicas", items: skills.filter((s) => s.tipo === "hard") },
    { label: "Competências comportamentais", items: skills.filter((s) => s.tipo === "soft") },
  ];

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-start text-muted-foreground">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "Carregando competências..." : "Buscar e adicionar competências"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Digite para buscar..." />
            <CommandList>
              <CommandEmpty>Nenhuma competência encontrada.</CommandEmpty>
              {groups.map((g) => (
                <CommandGroup key={g.label} heading={g.label}>
                  {g.items.map((skill) => (
                    <CommandItem key={skill.id} value={skill.nome} onSelect={() => toggle(skill)}>
                      <Check className={cn("mr-2 h-4 w-4", selectedIds.has(skill.id) ? "opacity-100" : "opacity-0")} />
                      {skill.nome}
                      {skill.categoria && <span className="ml-auto text-xs text-muted-foreground">{skill.categoria}</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma competência selecionada.</p>}

      <div className="space-y-2">
        {value.map((s) => (
          <div key={s.skill_id} className="rounded-lg border p-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{s.nome}</span>
                <Badge variant={s.tipo === "hard" ? "secondary" : "outline"} className="text-xs">
                  {s.tipo === "hard" ? "Técnica" : "Comportamental"}
                </Badge>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((v) => v.skill_id !== s.skill_id))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  {mode === "job" ? "Nível exigido" : "Meu nível"}: {SKILL_LEVEL_LABELS[s.nivel]}
                </Label>
                <LevelPicker value={s.nivel} onChange={(n) => update(s.skill_id, { nivel: n })} />
              </div>
              {mode === "job" && (
                <>
                  <div className="space-y-2 min-w-[160px] flex-1">
                    <Label className="text-xs text-muted-foreground">Peso: {s.peso ?? 5}/10</Label>
                    <Slider min={0} max={10} step={1} value={[s.peso ?? 5]} onValueChange={([p]) => update(s.skill_id, { peso: p })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={!!s.obrigatoria} onCheckedChange={(c) => update(s.skill_id, { obrigatoria: c })} />
                    <Label className="text-xs">Obrigatória</Label>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
