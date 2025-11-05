import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  BookOpen, 
  MessageSquare,
  Crown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log('🔐 AdminLayout rendering:', { 
    loading, 
    user: user?.email, 
    role: user?.role,
    pathname: location.pathname
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      console.log('🚫 Non-admin user detected, redirecting to home');
      navigate('/');
    } else if (!loading && !user) {
      console.log('🚫 No user detected, redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Assets', href: '/admin/assets', icon: Package },
    { name: 'Tutorials', href: '/admin/tutorials', icon: BookOpen },
    { name: 'Community', href: '/admin/community', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-card border-r border-primary/20 flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-orbitron font-bold title-orbitron">ADMIN</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary hover:bg-primary/10"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-lg shadow-primary/50'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-primary/20">
          {sidebarOpen && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="font-bold text-primary">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
