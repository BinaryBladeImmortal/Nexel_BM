import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { parseShowcaseGame } from "@/utils/parseJsonFields";

export default function Showcase() {
  const qc = useQueryClient();
  const { user, token } = useAuth();
  const [active, setActive] = useState<any | null>(null);

  // Use hardcoded data instead of API call
  const isLoading = false;
  const error = false;
  
  // Hardcoded games data
  const games: any[] = [
    {
      _id: '1',
      title: 'Cyber Heist',
      description: 'Break into a high-security corporate server and steal valuable data without getting caught.',
      thumbnail: '/game-cyber-heist.jpg',
      gameUrl: '/games/cyber-heist',
      author: 'CyberDev',
      likes: 1245,
      tags: ['action', 'stealth']
    },
    {
      _id: '2',
      title: 'Neon Runner',
      description: 'Dash through glowing cityscapes and collect energy orbs.',
      thumbnail: '/game-synthwave-racing.jpg',
      gameUrl: '/games/neon-runner',
      author: 'NeonMaster',
      likes: 890,
      tags: ['racing', 'arcade']
    },
    {
      _id: '3',
      title: 'Synthwave Drift',
      description: 'Race through neon highways in a synthwave atmosphere.',
      thumbnail: '/game-synthwave-racing.jpg',
      gameUrl: '/games/synthwave-drift',
      author: 'RetroWave',
      likes: 1120,
      tags: ['racing', 'music']
    },
    {
      _id: '4',
      title: 'Hologram Defense',
      description: 'Protect your mainframe with holographic shields.',
      thumbnail: '/game-cyber-heist.jpg',
      gameUrl: '/games/hologram-defense',
      author: 'HoloTech',
      likes: 750,
      tags: ['strategy', 'defense']
    }
  ];

  const likeMut = useMutation({
    mutationFn: ({ id, like }: { id: string; like: boolean }) => ApiService.likeShowcase(id, like, token || undefined),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['showcases'] }),
  });

  const handleLike = (g: any) => {
    if (!user) {
      sonnerToast("Please login first", { description: "Login to interact", duration: 2000 });
      return;
    }
    likeMut.mutate({ id: g._id, like: true });
  };

  const handlePlay = (g: any) => setActive(g);

  const handleComplete = () => {
    if (!user) {
      sonnerToast("Login Required", {
        description: "Please login to earn XP rewards",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    // Reward 5 XP (placeholder feedback)
    sonnerToast("+5 XP", { description: "Thanks for playing!", duration: 2000 });
    setActive(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="gradient-border p-6 animate-fade-in-up">
            <div className="h-[220px] bg-muted/20 rounded mb-4 animate-pulse" />
            <div className="h-6 w-1/3 bg-muted/20 rounded mb-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-muted/20 rounded mb-4 animate-pulse" />
            <div className="h-10 w-32 bg-muted/20 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !games.length) {
    return <div className="text-center py-10 text-muted-foreground">No showcase games available</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {games.map((g, index) => (
          <div
            key={g._id || index}
            className="group relative overflow-hidden gradient-border hover:glow-primary transition-transform duration-300 animate-fade-in-up hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="relative">
              <img
                src={g.thumbnail}
                alt={g.title}
                className="w-full h-[220px] object-cover rounded-t-[calc(var(--radius))] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 rounded-t-[calc(var(--radius))] bg-gradient-to-t from-background/70 via-background/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold font-orbitron leading-tight">{g.title}</h3>
                  <p className="text-muted-foreground text-sm">by {g.author}</p>
                </div>
                <button
                  className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center hover:glow-primary hover:scale-110 transition-all duration-300"
                  onClick={() => handlePlay(g)}
                >
                  <Play className="h-4 w-4 ml-0.5" />
                </button>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">{g.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(g.tags || []).map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-primary/15 text-primary rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <button
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                    onClick={() => handleLike(g)}
                    title={user ? "Like" : "Login to interact"}
                  >
                    <Heart className="h-5 w-5" />
                    <span>{g.likes || 0}</span>
                  </button>
                </div>
                <Button className="bg-gradient-primary hover:glow-primary" onClick={() => handlePlay(g)}>
                  Play Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={() => { /* prevent outside close */ }}>
        <DialogContent className="max-w-3xl bg-background">
          <DialogHeader>
            <DialogTitle className="font-orbitron">{active?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video w-full gradient-border overflow-hidden">
              {active?.gameUrl && (
                <iframe
                  src={active.gameUrl}
                  title={active.title}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                />
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActive(null)}>
                {user ? "Cancel (No reward)" : "Close"}
              </Button>
              {user ? (
                <Button className="bg-gradient-primary hover:glow-primary" onClick={handleComplete}>
                  I Completed It (+5 XP)
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={() => {
                    setActive(null);
                    sonnerToast("Login Required", {
                      description: "Please login to earn XP rewards",
                      action: {
                        label: "Login",
                        onClick: () => window.location.href = "/auth"
                      }
                    });
                  }}
                >
                  Login to Earn XP
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


