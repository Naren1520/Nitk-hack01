import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, SignupData } from '../types/database';
import { authApi } from '../services/mockApi';
import { toast } from 'sonner@2.0.3';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('campus_link_token');
        if (token) {
          const response = await authApi.getCurrentUser(token);
          if (response.status === 'success') {
            setState({
              user: response.data,
              loading: false,
              error: null,
            });
          } else {
            localStorage.removeItem('campus_link_token');
            setState({
              user: null,
              loading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: 'Failed to initialize authentication',
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authApi.login(credentials);
      
      if (response.status === 'success') {
        localStorage.setItem('campus_link_token', response.data.token);
        setState({
          user: response.data.user,
          loading: false,
          error: null,
        });
        toast.success('Welcome back!');
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message,
        }));
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authApi.signup(data);
      
      if (response.status === 'success') {
        localStorage.setItem('campus_link_token', response.data.token);
        setState({
          user: response.data.user,
          loading: false,
          error: null,
        });
        toast.success('Account created successfully!');
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message,
        }));
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      const errorMessage = 'Signup failed. Please try again.';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await authApi.logout();
      localStorage.removeItem('campus_link_token');
      setState({
        user: null,
        loading: false,
        error: null,
      });
      toast.success('Logged out successfully');
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast.error('Logout failed');
    }
  };

  const refreshUser = async (): Promise<void> => {
    const token = localStorage.getItem('campus_link_token');
    if (!token) return;

    try {
      const response = await authApi.getCurrentUser(token);
      if (response.status === 'success') {
        setState(prev => ({
          ...prev,
          user: response.data,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};