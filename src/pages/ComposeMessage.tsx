import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, X, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import { useSession } from '@/hooks/useSession';

const ComposeMessage = () => {
  const navigate = useNavigate();
  const { composerData } = useSession();
  const [subject, setSubject] = useState(composerData?.emailSubject || 'Request for Coffee Chat');
  const [message, setMessage] = useState(composerData?.suggestedMessage || '');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!composerData) {
    navigate('/home');
    return null;
  }

  const handleSend = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/mentors');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Message Sent!</h2>
            <p className="text-muted-foreground">
              Your message has been sent to {composerData.mentorName}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <StepIndicator currentStep="expert" />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto animate-slide-up">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Send Message to Mentor
            </h1>
            <p className="text-muted-foreground">
              Review and customize your message before sending
            </p>
          </div>

          {/* Composer Card */}
          <div className="card-premium overflow-hidden">
            {/* Recipient Header */}
            <div className="bg-secondary/50 px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground min-w-[60px]">To:</span>
                <span className="text-sm font-medium text-foreground">{composerData.mentorEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground min-w-[60px]">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 text-sm font-medium text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors py-1"
                  placeholder="Email subject"
                />
              </div>
            </div>

            {/* Message Body */}
            <div className="p-6">
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                className="w-full resize-none border border-border rounded-xl bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors leading-relaxed"
                placeholder="Write your message here..."
              />
              <div className="flex justify-end mt-3">
                <span className="text-xs text-muted-foreground">
                  {message.length} characters
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-5 bg-secondary/30 border-t border-border flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center justify-center gap-2 h-11"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="btn-accent flex items-center justify-center gap-2 h-11 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComposeMessage;
