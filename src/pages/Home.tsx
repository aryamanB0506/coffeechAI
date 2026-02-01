import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import LoadingDots from '@/components/LoadingDots';
import { useSession } from '@/hooks/useSession';
import { sanitizeQuestionInput } from '@/lib/sanitize';

const placeholderExamples = [
  "How do I design a scalable API?",
  "Who can help me with Kubernetes?",
  "What's the best practice for database indexing?",
  "How do I write a good design doc?",
  "What's the process for code reviews?",
];

const Home = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();
  const { sessionId, setCurrentQuestion, setFaqAnswer, setMentorData } = useSession();

  // Rotate placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setError('');
    setIsLoading(true);
    
    const sanitizedQuestion = sanitizeQuestionInput(question);
    setCurrentQuestion(sanitizedQuestion);

    const attemptQuery = async (retryCount = 0): Promise<void> => {
      try {
        const response = await fetch('https://n8n.srv1316736.hstgr.cloud/webhook/coffeechAI/query', {
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

        if (data.faq_answered && data.answer) {
          setFaqAnswer(data.answer);
          navigate('/answer');
        } else if (data.mentor_ids) {
          // Handle the typo in API response: Mentor_porfiles vs mentor_profiles
          const profiles = data.Mentor_porfiles || data.mentor_profiles || [];
          setMentorData({
            ...data,
            mentor_profiles: profiles,
          });
          navigate('/mentors');
        } else {
          setError('Unexpected response. Please try again.');
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <StepIndicator currentStep="ask" />

      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="w-full max-w-2xl animate-slide-up relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-4xl font-semibold text-foreground mb-4 tracking-tight">
              How can we help?
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              Ask a question and we'll find the best answer or connect you with a coworker
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card-premium p-6">
              <label htmlFor="question" className="sr-only">
                Your question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={placeholderExamples[placeholderIndex]}
                rows={5}
                className="w-full resize-none border-0 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="w-full btn-accent flex items-center justify-center gap-2 h-14 text-base shadow-lg hover:shadow-xl transition-shadow"
            >
              {isLoading ? (
                <LoadingDots />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Get Answer or Find Mentor
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
