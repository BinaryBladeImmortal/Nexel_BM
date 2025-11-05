import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Assets", href: "/assets" },
    { name: "LearnHub", href: "/learn" },
    { name: "Community", href: "/community" },
    { name: "Pricing", href: "/pricing" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-orbitron font-black title-orbitron hover:scale-105 transition-transform">
            NEXEL
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive(item.href)
                    ? "bg-gradient-primary text-white glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:glow-cyan"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <LogOut className="h-4 w-4 inline-block mr-2" />
                  Sign Out
                </button>
                <ProfileMenu />
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:glow-primary hover:scale-105 transition-all duration-300"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary/20 animate-fade-in">
            <div className="flex flex-col space-y-4 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              {user ? (
                <div className="flex flex-col gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm text-muted-foreground">
                    Welcome, <span className="text-primary">{user.email?.split('@')[0]}</span>
                  </span>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:glow-primary hover:scale-105 transition-all duration-300 w-fit mt-4"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;