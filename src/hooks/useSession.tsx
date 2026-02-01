import { createContext, useContext, useState, ReactNode } from 'react';
import { MentorProfile } from '@/components/MentorProfilePreview';

export interface ComposerData {
  mentorEmail: string;
  mentorName: string;
  suggestedMessage: string;
  emailSubject?: string;
}

export interface MentorFreeTime {
  day: string;
  free_blocks: { start: string; end: string }[];
}

export interface MentorAvailability {
  employee_id: string;
  name: string;
  free_times: MentorFreeTime[];
}

export interface MentorData {
  mentor_ids: string[];
  mentor_names: string[];
  reason: string;
  handoff_message: string;
  mentor_free_times: MentorAvailability[];
  mentor_profiles: MentorProfile[];
}

interface SessionContextType {
  sessionId: string | null;
  employeeId: string | null;
  currentQuestion: string | null;
  faqAnswer: string | null;
  mentorData: MentorData | null;
  composerData: ComposerData | null;
  setSession: (sessionId: string, employeeId: string) => void;
  setCurrentQuestion: (question: string) => void;
  setFaqAnswer: (answer: string) => void;
  setMentorData: (data: MentorData) => void;
  setComposerData: (data: ComposerData) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(() => 
    localStorage.getItem('session_id')
  );
  const [employeeId, setEmployeeId] = useState<string | null>(() => 
    localStorage.getItem('employee_id')
  );
  const [currentQuestion, setCurrentQuestionState] = useState<string | null>(() => 
    localStorage.getItem('current_question')
  );
  const [faqAnswer, setFaqAnswerState] = useState<string | null>(() => 
    localStorage.getItem('faq_answer')
  );
  const [mentorData, setMentorDataState] = useState<MentorData | null>(() => {
    const stored = localStorage.getItem('mentor_data');
    return stored ? JSON.parse(stored) : null;
  });
  const [composerData, setComposerDataState] = useState<ComposerData | null>(() => {
    const stored = localStorage.getItem('composer_data');
    return stored ? JSON.parse(stored) : null;
  });

  const setSession = (newSessionId: string, newEmployeeId: string) => {
    setSessionId(newSessionId);
    setEmployeeId(newEmployeeId);
    localStorage.setItem('session_id', newSessionId);
    localStorage.setItem('employee_id', newEmployeeId);
  };

  const setCurrentQuestion = (question: string) => {
    setCurrentQuestionState(question);
    localStorage.setItem('current_question', question);
  };

  const setFaqAnswer = (answer: string) => {
    setFaqAnswerState(answer);
    localStorage.setItem('faq_answer', answer);
  };

  const setMentorData = (data: MentorData) => {
    setMentorDataState(data);
    localStorage.setItem('mentor_data', JSON.stringify(data));
  };

  const setComposerData = (data: ComposerData) => {
    setComposerDataState(data);
    localStorage.setItem('composer_data', JSON.stringify(data));
  };

  const clearSession = () => {
    setSessionId(null);
    setEmployeeId(null);
    setCurrentQuestionState(null);
    setFaqAnswerState(null);
    setMentorDataState(null);
    setComposerDataState(null);
    localStorage.removeItem('session_id');
    localStorage.removeItem('employee_id');
    localStorage.removeItem('current_question');
    localStorage.removeItem('faq_answer');
    localStorage.removeItem('mentor_data');
    localStorage.removeItem('composer_data');
  };

  const isAuthenticated = !!sessionId && !!employeeId;

  return (
    <SessionContext.Provider value={{
      sessionId,
      employeeId,
      currentQuestion,
      faqAnswer,
      mentorData,
      composerData,
      setSession,
      setCurrentQuestion,
      setFaqAnswer,
      setMentorData,
      setComposerData,
      clearSession,
      isAuthenticated,
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
