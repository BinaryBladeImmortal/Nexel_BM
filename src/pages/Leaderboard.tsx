import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import ApiService from "@/services/api";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import GlitchText from "@/components/GlitchText";

interface LeaderboardUser {
  id: string;
  email: string;
  username?: string;
  xp: number;
  rank: number;
  profileImage?: string;
}

export default function Leaderboard() {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const data = await ApiService.getLeaderboard();
      return data.users as LeaderboardUser[];
    },
  });

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-orbitron font-bold mb-6">
        <GlitchText text="Global Leaderboard" />
      </h1>

      <div className="space-y-8">
        {/* Top 3 */}
        {!isLoading && leaderboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((player, index) => (
              <Card 
                key={player.id}
                className={`p-6 flex flex-col items-center text-center ${
                  index === 0 ? 'bg-gradient-primary/10 border-primary' : ''
                }`}
              >
                <div className="mb-4">
                  {getPositionIcon(index + 1)}
                </div>
                <div className="mb-2">
                  <div className="font-bold">{player.username || player.email.split('@')[0]}</div>
                  <div className="text-sm text-muted-foreground">Rank #{player.rank}</div>
                </div>
                <div className="text-lg font-bold text-primary">{player.xp} XP</div>
              </Card>
            ))}
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="px-6 py-4 text-left font-medium">Rank</th>
                  <th className="px-6 py-4 text-left font-medium">User</th>
                  <th className="px-6 py-4 text-right font-medium">XP</th>
                  <th className="px-6 py-4 text-right font-medium">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 w-8 bg-muted rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-32 bg-muted rounded" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 w-16 bg-muted rounded ml-auto" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 w-8 bg-muted rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : leaderboard?.map((player) => (
                  <tr
                    key={player.id}
                    className={`${
                      player.id === user?.id ? 'bg-primary/5' : 'hover:bg-muted/5'
                    }`}
                  >
                    <td className="px-6 py-4">#{player.rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">
                          {player.username || player.email.split('@')[0]}
                        </div>
                        {player.id === user?.id && (
                          <span className="text-xs text-primary">(You)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-primary">
                      {player.xp} XP
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      Level {Math.floor(player.xp / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}