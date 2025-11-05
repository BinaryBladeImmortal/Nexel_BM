import { User, Library, MessageSquare, Trophy } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ProfileMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <User className="h-4 w-4" />,
      label: "Profile",
      onClick: () => navigate("/profile"),
      description: `${user?.xp || 0} XP • Rank #${user?.rank || '--'}`
    },
    {
      icon: <Library className="h-4 w-4" />,
      label: "My Library",
      onClick: () => navigate("/library"),
      description: "Saved assets and tutorials"
    },
    {
      icon: <Trophy className="h-4 w-4" />,
      label: "Leaderboard",
      onClick: () => navigate("/leaderboard"),
      description: "See where you rank globally"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "AI Assistant",
      onClick: () => navigate("/chat"),
      description: "Get help with cyber security"
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <AvatarImage src={user?.profileImage} alt={user?.email} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 sm:w-96">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle>Profile Menu</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {/* User Info */}
          <div className="p-4 gradient-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profileImage} alt={user?.email} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.email?.split("@")[0]}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Level Progress</span>
                <span className="text-primary">{user?.xp || 0} XP</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${((user?.xp || 0) % 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full p-3 flex items-start gap-3 hover:bg-primary/5 rounded-lg transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}