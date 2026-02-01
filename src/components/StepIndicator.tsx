import { HelpCircle, MessageSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'ask' | 'answer' | 'expert';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps = [
  { id: 'ask' as const, label: 'Ask Question', icon: HelpCircle },
  { id: 'answer' as const, label: 'Get Answer', icon: MessageSquare },
  { id: 'expert' as const, label: 'Talk to Expert', icon: Users },
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-4 px-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                isActive && "bg-accent text-accent-foreground",
                isCompleted && "bg-accent/20 text-accent",
                !isActive && !isCompleted && "bg-secondary text-muted-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{index + 1}</span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "w-4 sm:w-8 h-0.5 mx-1",
                  index < currentIndex ? "bg-accent" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
