import { SENIORITY_LEVELS } from "@/lib/skills";
import { cn } from "@/lib/utils";

interface SeniorityThermometerProps {
  /** Senioridade autodeclarada do candidato */
  candidateLevel?: string | null;
  /** Senioridade exigida pela vaga (opcional, para comparação) */
  requiredLevel?: string | null;
  compact?: boolean;
}

export const SeniorityThermometer = ({ candidateLevel, requiredLevel, compact = false }: SeniorityThermometerProps) => {
  const cIdx = SENIORITY_LEVELS.indexOf(candidateLevel as (typeof SENIORITY_LEVELS)[number]);
  const rIdx = SENIORITY_LEVELS.indexOf(requiredLevel as (typeof SENIORITY_LEVELS)[number]);

  let verdict: string | null = null;
  if (cIdx >= 0 && rIdx >= 0) {
    const diff = cIdx - rIdx;
    verdict = diff === 0 ? "Senioridade alinhada" : diff > 0 ? `Acima do exigido (+${diff})` : `Abaixo do exigido (${diff})`;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {SENIORITY_LEVELS.map((lvl, i) => (
          <div key={lvl} className="flex-1 space-y-1">
            <div
              className={cn(
                "relative rounded-sm transition-colors",
                compact ? "h-2" : "h-3",
                i <= cIdx ? "bg-gradient-to-r from-secondary to-primary" : "bg-muted",
                i === rIdx && "ring-2 ring-offset-1 ring-foreground/60"
              )}
            />
            {!compact && (
              <p className={cn("text-[10px] text-center", i === cIdx ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {lvl}
              </p>
            )}
          </div>
        ))}
      </div>
      {(compact || verdict || cIdx < 0) && (
        <p className="text-xs text-muted-foreground">
          {cIdx < 0 ? "Senioridade não informada" : compact && !verdict ? candidateLevel : null}
          {verdict && (
            <>
              {verdict}
              {rIdx >= 0 && <span> · vaga pede {requiredLevel}</span>}
            </>
          )}
        </p>
      )}
    </div>
  );
};
