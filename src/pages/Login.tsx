import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Mail, Lock, Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setSession, isAuthenticated } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
      setHasError(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError('');
      setHasError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setHasError(false);
    setIsLoading(true);

    const attemptLogin = async (retryCount = 0): Promise<void> => {
      try {
        const response = await fetch('https://n8n.srv1316736.hstgr.cloud/webhook/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.employee_id === 'E000' || !data.employee_id || !data.session_id) {
          setError('Invalid credentials. Please check your email and password.');
          setHasError(true);
          setPassword('');
          setIsLoading(false);
          // Focus on password field
          setTimeout(() => passwordRef.current?.focus(), 100);
          return;
        }

        setSession(data.session_id, data.employee_id);
        navigate('/home');
      } catch (err) {
        if (retryCount < 2) {
          await attemptLogin(retryCount + 1);
        } else {
          setError('Connection failed. Please try again.');
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    await attemptLogin();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-accent mb-6 shadow-lg">
            <Coffee className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">CoffeechAI</h1>
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-sm mx-auto">
            Get instant answers or connect with the right expert—fast.
          </p>
        </div>

        {/* Login Card */}
        <div className="card-premium p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="employee@demo-co.com"
                  className={`input-field pl-11 ${hasError ? 'border-destructive focus:ring-destructive' : ''}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  className={`input-field pl-11 ${hasError ? 'border-destructive focus:ring-destructive' : ''}`}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in flex items-start gap-2">
                <span className="text-destructive">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-accent flex items-center justify-center gap-2 h-12 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: employee1@demo-co.com / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
