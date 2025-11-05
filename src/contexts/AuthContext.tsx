import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import ApiService from '@/services/api';

export type SubscriptionPlan = 'Free' | 'Starter' | 'Pro' | 'Power' | 'Ultra';

export interface User {
  id: string;
  _id?: string; // Backwards compatibility
  name: string;
  email: string;
  role?: 'user' | 'admin';
  subscription: {
    plan: SubscriptionPlan;
    startDate?: string;
    endDate?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in using token from localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await ApiService.getProfile(token);
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
        setUser({
          id: data._id,
          _id: data._id,
          name: data.username || data.name,
          email: data.email,
          role: data.role,
          subscription: data.subscription || { plan: 'Free' },
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        // Don't force redirect here to avoid loops; let pages guard if needed
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const data = await ApiService.login(email, password);
      const tokenValue = data.token;
      if (tokenValue) {
        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);
      }
      setUser({
        id: data._id,
        _id: data._id,
        name: data.username || data.name,
        email: data.email,
        role: data.role,
        subscription: data.subscription || { plan: 'Free' },
      });
      toast.success('Logged in successfully!');
      
      // Redirect admin users to admin dashboard
      if (data.role === 'admin') {
        toast.success('⚡ Welcome, Admin!', { description: 'Redirecting to admin dashboard...' });
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await ApiService.register(name, email, password);
      const tokenValue = data.token;
      if (tokenValue) {
        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);
      }
      setUser({
        id: data._id,
        _id: data._id,
        name: data.username || name,
        email: data.email,
        role: data.role || 'user',
        subscription: data.subscription || { plan: 'Free' },
      });
      toast.success('Registration successful!');
      
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    } else if (userData) {
      // If there's no user but we're trying to update, set the user
      // This is useful for initial user setup
      setUser(userData as User);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        token, 
        loading, 
        login, 
        register, 
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
