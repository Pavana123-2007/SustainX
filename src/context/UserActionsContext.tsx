import { createContext, useContext, useState, ReactNode } from 'react';

interface UserAction {
  type: string;
  value: string;
  timestamp: number;
}

interface UserActionsContextType {
  userActions: UserAction[];
  addAction: (type: string, value: string) => void;
}

const UserActionsContext = createContext<UserActionsContextType | undefined>(undefined);

export function UserActionsProvider({ children }: { children: ReactNode }) {
  const [userActions, setUserActions] = useState<UserAction[]>([]);

  const addAction = (type: string, value: string) => {
    const newAction: UserAction = {
      type,
      value,
      timestamp: Date.now(),
    };
    setUserActions(prev => [...prev, newAction]);
  };

  return (
    <UserActionsContext.Provider value={{ userActions, addAction }}>
      {children}
    </UserActionsContext.Provider>
  );
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) {
    throw new Error('useUserActions must be used within UserActionsProvider');
  }
  return context;
}
