import { createContext, useState } from 'react';
import { tokenRepository } from '../api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const initialAuth = () => {
    const auth = tokenRepository.getAccessAuth();
    return auth ? JSON.parse(auth) : null;
  };

  const [auth, setAuth] = useState(initialAuth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
