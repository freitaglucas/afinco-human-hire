import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MatchScore } from '@/components/MatchScore/MatchScore';
import { MapPin, Building, Clock, Heart, X } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[];
    matchScore: number;
    matchFactors: {
      technical: string[];
      experience: string[];
      education: string[];
      opportunities: string[];
    };
    companyLogo?: string;
    postedAt: string;
  };
  onLike?: (jobId: string) => void;
  onDislike?: (jobId: string) => void;
  showActions?: boolean;
  variant?: 'swipe' | 'list';
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onLike,
  onDislike,
  showActions = true,
  variant = 'swipe'
}) => {
  const handleLike = () => {
    onLike?.(job.id);
  };

  const handleDislike = () => {
    onDislike?.(job.id);
  };

  // List variant for serious mode
  if (variant === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <MatchScore score={job.matchScore} size="sm" />
              </div>
              <p className="text-muted-foreground mb-1">{job.company}</p>
              <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{job.salary}</p>
              <p className="text-xs text-muted-foreground">{job.postedAt}</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.requirements.slice(0, 4).map((req, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
            {job.requirements.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.requirements.length - 4} mais
              </Badge>
            )}
          </div>

          {showActions && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDislike}
                className="flex-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <X className="w-4 h-4 mr-2" />
                Não Interessado
              </Button>
              <Button 
                variant="candidate" 
                size="sm" 
                onClick={handleLike}
                className="flex-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                Tenho Interesse
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'swipe') {
    return (
      <Card className="swipe-card w-full max-w-md mx-auto bg-gradient-to-br from-white to-muted/20 border-0 shadow-lg">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={job.company} 
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg leading-tight">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <MatchScore 
              score={job.matchScore} 
              size="md" 
              matchFactors={job.matchFactors}
            />
          </div>

          {/* Job Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.postedAt}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {job.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {job.salary}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {job.description}
          </p>

          {/* Key Requirements */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Principais Requisitos:</h4>
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 4).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {job.requirements.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.requirements.length - 4} mais
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={handleDislike}
              >
                <X className="w-5 h-5 mr-2" />
                Não Interessado
              </Button>
              <Button
                variant="candidate"
                size="lg"
                className="flex-1"
                onClick={handleLike}
              >
                <Heart className="w-5 h-5 mr-2" />
                Candidatar-se
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // List variant for recruiter view
  return (
    <Card className="talent-card hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company} 
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{job.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{job.company}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {job.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{job.location}</span>
              </div>
            </div>
          </div>
          <MatchScore score={job.matchScore} size="sm" showDetails={false} />
        </div>
      </CardContent>
    </Card>
  );
};