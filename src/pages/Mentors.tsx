import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Calendar, Clock, Mail, Info, User } from 'lucide-react';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import LoadingDots from '@/components/LoadingDots';
import MentorProfilePreview, { MentorProfile } from '@/components/MentorProfilePreview';
import { useSession, MentorAvailability } from '@/hooks/useSession';
import { useIsMobile } from '@/hooks/use-mobile';
import { sanitizeQuestionInput } from '@/lib/sanitize';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Generate email from employee_id (e.g., E002 -> employee2@demo-co.com)
const generateEmail = (employeeId: string) => {
  const num = parseInt(employeeId.replace('E', ''), 10);
  return `employee${num}@demo-co.com`;
};

// Generate initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface MentorCardProps {
  mentor: MentorAvailability;
  description: string;
  profile?: MentorProfile;
  onTimeSlotClick: (mentor: MentorAvailability, day: string, timeBlock: string) => void;
  isLoading: boolean;
  loadingSlot: { mentorId: string; day: string; time: string } | null;
  isMobile: boolean;
}

const MentorCard = ({ 
  mentor, 
  description, 
  profile,
  onTimeSlotClick, 
  isLoading, 
  loadingSlot,
  isMobile
}: MentorCardProps) => {
  const mentorEmail = profile?.email || generateEmail(mentor.employee_id);
  const initials = getInitials(mentor.name);
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (isMobile || !profile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    if (isMobile || !profile) return;
    hideTimeoutRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 150);
  };

  const handleProfileClick = () => {
    if (!profile) return;
    if (isMobile) {
      setShowModal(true);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={cardRef}
        className="card-premium p-6 animate-fade-in relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar with initials */}
          <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-lg font-semibold text-accent-foreground">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">
                {mentor.name}
              </h3>
              {profile && (
                <button
                  onClick={handleProfileClick}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors",
                    "bg-accent/10 text-accent hover:bg-accent/20",
                    isMobile ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <User className="w-3 h-3" />
                  {isMobile ? 'View Profile' : 'Hover for profile'}
                </button>
              )}
            </div>
            {profile && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile.role} · {profile.team}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-sm text-accent mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{mentorEmail}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
              "{description}"
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
            <Calendar className="w-4 h-4 text-accent" />
            Available Times
          </div>

          <div className="space-y-4">
            {mentor.free_times.map((day, idx) => (
              <div key={idx} className="bg-secondary/50 rounded-xl p-4">
                <p className="text-sm font-medium text-foreground mb-3">
                  {formatDate(day.day)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {day.free_blocks.map((block, blockIdx) => {
                    const timeString = `${block.start}-${block.end}`;
                    const isThisLoading = loadingSlot?.mentorId === mentor.employee_id && 
                                          loadingSlot?.day === day.day && 
                                          loadingSlot?.time === timeString;
                    
                    return (
                      <button
                        key={blockIdx}
                        onClick={() => onTimeSlotClick(mentor, day.day, timeString)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        {isThisLoading ? (
                          <LoadingDots />
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            {block.start} - {block.end}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop hover popover */}
        {!isMobile && profile && showPreview && (
          <div 
            ref={previewRef}
            className="absolute left-full top-0 ml-4 z-50 animate-fade-in"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ animationDuration: '200ms' }}
          >
            <MentorProfilePreview profile={profile} />
          </div>
        )}
      </div>

      {/* Mobile modal */}
      {isMobile && profile && showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div 
            className="relative z-10 w-full max-w-[500px] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <MentorProfilePreview 
              profile={profile} 
              isModal 
              onClose={() => setShowModal(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

// Parse handoff_message or reason to extract individual mentor descriptions
const parseMentorDescriptions = (reason: string, mentorIds: string[], mentorNames: string[]): Record<string, string> => {
  const descriptions: Record<string, string> = {};
  
  if (!reason) {
    mentorIds.forEach(id => {
      descriptions[id] = 'Experienced team member ready to help with your question.';
    });
    return descriptions;
  }
  
  const lines = reason.split('\n').filter(line => line.trim().startsWith('-'));
  
  lines.forEach(line => {
    // Match pattern: "- Name (ID): Description"
    const match = line.match(/^-\s*([^(]+)\s*\(([^)]+)\):\s*(.+)$/);
    if (match) {
      const [, , employeeId, description] = match;
      descriptions[employeeId.trim()] = description.trim();
    }
  });
  
  // Fill in any missing descriptions with a generated one
  mentorIds.forEach((id, index) => {
    if (!descriptions[id]) {
      const name = mentorNames[index] || 'This mentor';
      descriptions[id] = `${name} is an experienced team member ready to help with your question.`;
    }
  });
  
  return descriptions;
};

// Create a lookup map from mentor profiles
const createProfileLookup = (profiles: MentorProfile[]): Record<string, MentorProfile> => {
  const lookup: Record<string, MentorProfile> = {};
  profiles.forEach(profile => {
    lookup[profile.id] = profile;
    if (profile.mentor_id && profile.mentor_id !== profile.id) {
      lookup[profile.mentor_id] = profile;
    }
  });
  return lookup;
};

const Mentors = () => {
  const navigate = useNavigate();
  const { currentQuestion, mentorData, setComposerData } = useSession();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSlot, setLoadingSlot] = useState<{ mentorId: string; day: string; time: string } | null>(null);
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  if (!currentQuestion || !mentorData) {
    navigate('/home');
    return null;
  }

  const mentorDescriptions = parseMentorDescriptions(
    mentorData.reason, 
    mentorData.mentor_ids,
    mentorData.mentor_names
  );

  // Create profile lookup - handle the typo in API response
  const profiles = mentorData.mentor_profiles || [];
  const profileLookup = createProfileLookup(profiles);

  const hasProfiles = profiles.length > 0;
  
  if (!hasProfiles) {
    console.warn('Mentor profiles data not available');
  }

  const handleTimeSlotClick = async (mentor: MentorAvailability, day: string, timeBlock: string) => {
    setShowDemoNotice(false);
    setIsLoading(true);
    setLoadingSlot({ mentorId: mentor.employee_id, day, time: timeBlock });

    const profile = profileLookup[mentor.employee_id];
    const mentorEmail = profile?.email || generateEmail(mentor.employee_id);
    const sanitizedQuestion = sanitizeQuestionInput(currentQuestion);

    const attemptSchedule = async (retryCount = 0): Promise<void> => {
      try {
        const response = await fetch('https://n8n.srv1316736.hstgr.cloud/webhook/coffeechAI/schedule_call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selected_date: day,
            selected_time: timeBlock,
            mentor_name: mentor.name,
            original_question: sanitizedQuestion,
            reasoning: mentorData.reason,
          }),
        });

        const data = await response.json();

        // Parse the nested response structure
        let subject = '';
        let emailBody = '';
        
        try {
          // Handle the nested response: data.choices[0].message.content contains stringified JSON
          if (data.choices && data.choices[0]?.message?.content) {
            const contentStr = data.choices[0].message.content;
            const parsed = JSON.parse(contentStr);
            subject = parsed.subject || '';
            emailBody = parsed.email_body || '';
          } else if (data.suggested_message) {
            // Fallback for simpler response format
            emailBody = data.suggested_message;
            subject = 'Request for Coffee Chat';
          }
        } catch (parseErr) {
          // If parsing fails, try to use the raw data
          if (data.suggested_message) {
            emailBody = data.suggested_message;
            subject = 'Request for Coffee Chat';
          }
        }

        if (emailBody) {
          // Unescape newlines for display
          const formattedBody = emailBody.replace(/\\n/g, '\n');
          
          setComposerData({
            mentorEmail,
            mentorName: mentor.name,
            suggestedMessage: formattedBody,
            emailSubject: subject,
          });
          navigate('/compose-message');
        } else {
          // Graceful handling - show demo notice instead of error
          setShowDemoNotice(true);
          setIsLoading(false);
          setLoadingSlot(null);
        }
      } catch (err) {
        if (retryCount < 2) {
          await attemptSchedule(retryCount + 1);
        } else {
          // Graceful handling - show demo notice instead of error
          setShowDemoNotice(true);
          setIsLoading(false);
          setLoadingSlot(null);
        }
      }
    };

    await attemptSchedule();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <StepIndicator currentStep="expert" />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Question Section */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Your Question</span>
            </div>
            <div className="card-premium p-5 bg-secondary/30">
              <p className="text-foreground font-medium leading-relaxed">{currentQuestion}</p>
            </div>
          </div>

          {/* Section Title */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-semibold text-foreground">
              Recommended Mentors
            </h2>
            <p className="text-muted-foreground mt-2">
              {hasProfiles 
                ? (isMobile ? 'Tap "View Profile" for more details' : 'Hover over a mentor card for their full profile')
                : 'Click on a time slot to schedule a call'
              }
            </p>
          </div>

          {showDemoNotice && (
            <div className="p-4 rounded-xl bg-accent/10 text-accent text-sm animate-fade-in mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Scheduling is currently unavailable in demo mode. In production, this would send a calendar invite to the mentor.</span>
            </div>
          )}

          {/* Mentor Cards */}
          <div className="space-y-6 mb-10">
            {mentorData.mentor_free_times.map((mentor, idx) => (
              <div key={mentor.employee_id} style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                <MentorCard 
                  mentor={mentor} 
                  description={mentorDescriptions[mentor.employee_id]}
                  profile={profileLookup[mentor.employee_id]}
                  onTimeSlotClick={handleTimeSlotClick}
                  isLoading={isLoading}
                  loadingSlot={loadingSlot}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => navigate('/home')}
              className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 h-12"
            >
              <ArrowLeft className="w-5 h-5" />
              Ask Another Question
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mentors;
