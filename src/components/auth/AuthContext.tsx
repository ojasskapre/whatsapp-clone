import React, {
  useContext,
  ReactNode,
  createContext,
  useState,
  useEffect,
} from 'react';

import { auth, provider } from '../../firebase';
import { onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';

type AuthContextType = {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => console.log(result))
      .catch((error) => alert(error.message));
  };

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
