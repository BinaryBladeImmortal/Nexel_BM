import { useState } from "react";
import { Trophy, Heart, MessageCircle, Hash, Bell, Share2 } from "lucide-react";
import Leaderboard from "./Community/Leaderboard";
import Discussions from "./Community/Discussions";
import avatarAlex from "@/assets/avatar-alex.jpg";
import avatarMaya from "@/assets/avatar-maya.jpg";
import avatarKai from "@/assets/avatar-kai.jpg";
import Showcase from "./Community/Showcase";

const Community = () => {
  const [activeTab, setActiveTab] = useState("Showcase");

  const tabs = ["Leaderboard", "Showcase", "Discussions"];

  

  

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="pt-24 pb-16 cyber-grid">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold title-orbitron mb-6">
              Community
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect, compete, and create with fellow cyberpunk developers
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-primary text-white glow-primary"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-primary/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Leaderboard Tab */}
          {activeTab === "Leaderboard" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-orbitron font-bold title-orbitron mb-8 text-center">
                Top Developers
              </h2>
              <Leaderboard />
            </div>
          )}

          {/* Showcase Tab */}
          {activeTab === "Showcase" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-orbitron font-bold title-orbitron mb-8 text-center">
                Amazing projects from our developers
              </h2>
              <Showcase />
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === "Discussions" && (
            <div className="py-10">
              <Discussions />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;