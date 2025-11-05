import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/api";
import { Link } from "react-router-dom";

interface ShowcaseGame {
  _id?: string;
  title: string;
  thumbnail: string;
  author: string;
  description?: string;
  gameUrl?: string;
  likes?: number;
}

export default function HomeShowcase() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['home-showcases'],
    queryFn: () => ApiService.getShowcases(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  const items: ShowcaseGame[] = (data?.games || []).slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="gradient-border p-0 overflow-hidden rounded-lg animate-fade-in-up">
            <div className="h-48 bg-muted/20 animate-pulse" />
            <div className="p-6">
              <div className="h-6 w-1/2 bg-muted/20 rounded mb-2 animate-pulse" />
              <div className="h-4 w-2/3 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !items.length) {
    return <div className="text-center text-muted-foreground">No showcase games available</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map((g, index) => (
        <Link
          to="/community"
          key={g._id || index}
          className="gradient-border hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="p-0 overflow-hidden rounded-lg">
            <img src={g.thumbnail} alt={g.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold font-orbitron mb-2">{g.title}</h3>
              <p className="text-muted-foreground">by {g.author}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}


