import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Users, Bot, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import LoadingDots from '@/components/LoadingDots';
import { useSession } from '@/hooks/useSession';
import { sanitizeQuestionInput } from '@/lib/sanitize';

const Answer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { sessionId, currentQuestion, faqAnswer, setMentorData } = useSession();

  const handleContactMentor = async () => {
    setError('');
    setIsLoading(true);

    const sanitizedQuestion = sanitizeQuestionInput(currentQuestion || '');

    const attemptQuery = async (retryCount = 0): Promise<void> => {
      try {
        const response = await fetch('https://n8n.srv1316736.hstgr.cloud/webhook/coffeechAI/query_mentorhelp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            question_text: sanitizedQuestion,
          }),
        });

        const data = await response.json();

        if (data.mentor_ids) {
          // Handle the typo in API response: Mentor_porfiles vs mentor_profiles
          const profiles = data.Mentor_porfiles || data.mentor_profiles || [];
          setMentorData({
            ...data,
            mentor_profiles: profiles,
          });
          navigate('/mentors');
        } else {
          setError('Unable to find mentors. Please try again.');
          setIsLoading(false);
        }
      } catch (err) {
        if (retryCount < 2) {
          await attemptQuery(retryCount + 1);
        } else {
          setError('Connection failed. Please try again.');
          setIsLoading(false);
        }
      }
    };

    await attemptQuery();
  };

  if (!currentQuestion || !faqAnswer) {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <StepIndicator currentStep="answer" />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto animate-slide-up">
          {/* Question Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Your Question</span>
            </div>
            <div className="card-premium p-5 bg-secondary/30">
              <p className="text-foreground font-medium leading-relaxed">{currentQuestion}</p>
            </div>
          </div>

          {/* AI Answer Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">AI-powered answer from internal knowledge</span>
          </div>

          {/* Answer Section */}
          <div className="mb-4">
            <div className="card-premium p-6">
              <div 
                className="text-foreground leading-[1.7] prose prose-sm max-w-none prose-strong:text-foreground prose-p:text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: faqAnswer
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                    .replace(/- /g, '• ')
                }}
              />
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="flex items-center gap-2 mb-10 text-sm text-accent">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">High confidence answer (FAQ match)</span>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in mb-6">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/home')}
              className="flex-1 btn-secondary flex items-center justify-center gap-2 h-12"
            >
              <ArrowLeft className="w-5 h-5" />
              Ask Another Question
            </button>
            <button
              onClick={handleContactMentor}
              disabled={isLoading}
              className="flex-1 btn-accent flex items-center justify-center gap-2 h-12 shadow-lg hover:shadow-xl transition-shadow"
            >
              {isLoading ? (
                <LoadingDots />
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Contact Mentor
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Answer;
