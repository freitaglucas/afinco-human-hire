import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  matchFactors?: {
    technical: string[];
    experience: string[];
    education: string[];
    opportunities: string[];
  };
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  size = 'md',
  showDetails = true,
  matchFactors
}) => {
  const circumference = 2 * Math.PI * 20;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary stroke-primary';
    if (score >= 60) return 'text-secondary stroke-secondary';
    if (score >= 40) return 'text-orange-500 stroke-orange-500';
    return 'text-red-500 stroke-red-500';
  };

  const colorClass = getScoreColor(score);

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 44 44"
        >
          {/* Background circle */}
          <circle
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted"
            opacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx="22"
            cy="22"
            r="20"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClass} transition-all duration-700 ease-out match-score-ring`}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${textSizes[size]} font-bold ${colorClass}`}>
          {score}%
        </div>
      </div>

      {showDetails && matchFactors && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-auto w-auto">
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Detalhes da Compatibilidade</h4>
              
              {matchFactors.technical.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-primary mb-1">✓ Competências Técnicas</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {matchFactors.technical.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {matchFactors.experience.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-secondary mb-1">✓ Experiência</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {matchFactors.experience.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {matchFactors.opportunities.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-orange-600 mb-1">🚀 Oportunidades de Crescimento</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {matchFactors.opportunities.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};