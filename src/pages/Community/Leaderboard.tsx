import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/api";

const rankIcon = (rank: number) => {
  switch (rank) {
    case 1: return "🥇";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return `#${rank}`;
  }
};

const fallback = [
  { rank: 1, username: 'CyberDev_X', level: 28, xp: 15420, projectCount: 12 },
  { rank: 2, username: 'NeonCoder', level: 27, xp: 14890, projectCount: 9 },
  { rank: 3, username: 'RetroMaster', level: 25, xp: 13750, projectCount: 15 },
  { rank: 4, username: 'GlitchArtist', level: 23, xp: 12340, projectCount: 8 },
  { rank: 5, username: 'SynthWave_Dev', level: 22, xp: 11680, projectCount: 11 },
];

export default function Leaderboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => ApiService.getLeaderboard(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // For now, show 3-5 demo entries regardless of backend
  const users = (fallback.slice(0, 5)).map((u, i) => ({ ...u, rank: u.rank || i + 1 }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="gradient-border p-6 animate-fade-in-up">
            <div className="flex items-center gap-6">
              <div className="h-8 w-16 bg-muted/30 rounded animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 bg-muted/30 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted/20 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !users.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">No leaderboard data available</div>
    );
  }

  return (
    <div className="space-y-6">
      {users.map((user, index) => (
        <div 
          key={user.username + index}
          className="gradient-border p-6 hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-6">
            <div className="text-4xl font-bold font-orbitron">
              {rankIcon(user.rank || index + 1)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold font-orbitron">{user.username}</h3>
              </div>
              <div className="flex items-center gap-6 text-muted-foreground">
                <span>Level {user.level}</span>
                <span>{Number(user.xp || 0).toLocaleString()} XP</span>
                <span>{user.projectCount ?? 0} Projects</span>
              </div>
            </div>

            <div className="text-right">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Rank {user.rank || index + 1}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


