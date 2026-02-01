import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Home, LogOut, Coffee, User, Moon, Sun } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { employeeId, clearSession } = useSession();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleHome = () => {
    setIsOpen(false);
    navigate('/home');
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="w-full px-6 py-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
            <Coffee className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-semibold text-foreground text-lg">CoffeechAI</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-secondary hover:bg-muted border border-border transition-colors duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-medium text-foreground">{employeeId}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 card-premium py-1 animate-scale-in z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium text-foreground">{employeeId}</p>
              </div>
              <button
                onClick={handleHome}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={handleThemeToggle}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
