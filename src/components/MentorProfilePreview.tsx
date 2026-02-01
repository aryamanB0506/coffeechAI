import { X, MapPin, Clock, Mail, CheckCircle, Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MentorProject {
  name: string;
  description: string;
  tags: string[];
}

export interface MentorLocation {
  city: string;
  timezone: string;
  remote_ok: boolean;
}

export interface MentorProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  seniority_level: number;
  open_to_mentoring: boolean;
  location: MentorLocation;
  skills: string[];
  projects: MentorProject[];
  mentor_id: string;
}

interface MentorProfilePreviewProps {
  profile: MentorProfile;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
}

// Skill pill colors - rotating through a blue/teal/purple palette
const skillColors = [
  'bg-accent/10 text-accent',
  'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
];

// Project tag colors - muted versions
const tagColors = [
  'bg-muted text-muted-foreground',
  'bg-secondary text-secondary-foreground',
];

const SeniorityStars = ({ level }: { level: number }) => {
  const maxStars = 5;
  const filledStars = Math.min(level, maxStars);
  
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: filledStars }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-accent text-accent" />
      ))}
      {Array.from({ length: maxStars - filledStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 text-muted-foreground/30" />
      ))}
    </div>
  );
};

const MentorProfilePreview = ({ 
  profile, 
  onClose, 
  isModal = false,
  className 
}: MentorProfilePreviewProps) => {
  const maxSkillsToShow = 12;
  const additionalSkills = Math.max(0, profile.skills.length - maxSkillsToShow);
  const displayedSkills = profile.skills.slice(0, maxSkillsToShow);
  
  const maxProjectsToShow = 3;
  const displayedProjects = profile.projects?.slice(0, maxProjectsToShow) || [];

  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-2xl shadow-2xl overflow-hidden",
        isModal ? "w-full max-w-[500px]" : "w-[450px]",
        className
      )}
      role="dialog"
      aria-label={`Mentor profile for ${profile.name}`}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border bg-gradient-to-br from-accent/5 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-semibold text-foreground">
                {profile.name}
              </h3>
              {profile.open_to_mentoring && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Open to Mentoring
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.role} · {profile.team}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Seniority:</span>
              <SeniorityStars level={profile.seniority_level} />
              <span className="text-xs text-muted-foreground">Level {profile.seniority_level}</span>
            </div>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close profile"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="max-h-[450px] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Location Section */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Location
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                {profile.location.city}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <Clock className="w-4 h-4 text-accent" />
                {profile.location.timezone}
              </div>
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                profile.location.remote_ok 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}>
                {profile.location.remote_ok ? '✓ Remote Available' : '📍 On-site'}
              </span>
            </div>
          </div>

          {/* Skills Section */}
          {displayedSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Skills & Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {displayedSkills.map((skill, idx) => (
                  <span
                    key={skill}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-medium",
                      skillColors[idx % skillColors.length]
                    )}
                  >
                    {skill}
                  </span>
                ))}
                {additionalSkills > 0 && (
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    +{additionalSkills} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {displayedProjects.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Recent Projects
              </h4>
              <div className="space-y-3">
                {displayedProjects.map((project, idx) => (
                  <div 
                    key={project.name}
                    className={cn(
                      "p-3 rounded-xl bg-secondary/50",
                      idx !== displayedProjects.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <h5 className="font-medium text-sm text-foreground mb-1">
                      {project.name}
                    </h5>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 5).map((tag, tagIdx) => (
                          <span
                            key={tag}
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-medium",
                              tagColors[tagIdx % tagColors.length]
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="pt-2 border-t border-border">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors group"
            >
              <Mail className="w-4 h-4" />
              {profile.email}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePreview;
