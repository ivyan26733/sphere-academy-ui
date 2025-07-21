
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  userName?: string;
  profileImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'STUDENT' | 'INSTRUCTOR', firstName: string, address: string,phoneNumber:string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('learnsphere_token');
    const storedUser = localStorage.getItem('learnsphere_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/public/auth/login', { userEmail:email, userPassword:password });
      const { token: authToken, user: userData } = response.data.data;
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('learnsphere_token', authToken);
      localStorage.setItem('learnsphere_user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, role: 'STUDENT' | 'INSTRUCTOR', userName: string, address: string,phoneNumber:string) => {
    try {
      const response = await axios.post('/api/public/auth/register', {
        
        userEmail:email,
        userPassword:password,
        role,
        address,
        userName,
        phoneNumber
      });
      const { token: authToken, user: userData } = response.data.data;
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('learnsphere_token', authToken);
      localStorage.setItem('learnsphere_user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('learnsphere_token');
    localStorage.removeItem('learnsphere_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
