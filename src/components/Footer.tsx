import { Link } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";

const Footer = () => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const openGameModal = () => {
    setIsGameModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Close modal on ESC key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeGameModal();
    }
  };

  return (
    <>
      <footer className="bg-card border-t border-primary/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Brand */}
            <div className="col-span-1">
              <Link to="/" className="text-2xl font-orbitron font-black title-orbitron inline-block mb-4">
                NEXEL
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The ultimate cyberpunk gaming platform for developers and creators.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 h-8 flex items-center">Platform</h3>
              <div className="space-y-2.5">
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/learn" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LearnHub
                </Link>
                <Link to="/community" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
                <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            {/* Global Communities */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 h-8 flex items-center">🌐 Global Communities</h3>
              <div className="space-y-2.5">
                <a 
                  href="https://itch.io/community" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">🌎</span>
                  <span className="group-hover:glow-primary">Itch.io Community</span>
                </a>
                <a 
                  href="https://www.indiedb.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">🎮</span>
                  <span className="group-hover:glow-accent">Indie DB</span>
                </a>
                <a 
                  href="https://www.gamedev.net/forums/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-all duration-300 hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">💬</span>
                  <span className="group-hover:glow-secondary">GameDev.net Forums</span>
                </a>
                <a 
                  href="https://forum.unity.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">⚙️</span>
                  <span className="group-hover:glow-primary">Unity Forum</span>
                </a>
                <a 
                  href="https://forums.unrealengine.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">🎯</span>
                  <span className="group-hover:glow-accent">Unreal Engine Forum</span>
                </a>
                <a 
                  href="https://www.reddit.com/r/gamedev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-all duration-300 hover:translate-x-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">💭</span>
                  <span className="group-hover:glow-secondary">Reddit r/gamedev</span>
                </a>
              </div>
            </div>

            {/* Mini Game */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 h-8 flex items-center">🎮 Try Our First Game</h3>
              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                Become a lone shard of light, absorb every fragment, dodge the shadows, and surge to the prism gateway.
              </p>
              <div 
                onClick={openGameModal}
                className="relative cursor-pointer group overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary hover:glow-primary transition-all duration-300"
                style={{ height: '160px' }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="text-center">
                    <h4 className="font-orbitron font-black text-2xl title-orbitron">
                      <span className="bg-gradient-primary bg-clip-text text-transparent">PRiSM:</span>
                      <span className="bg-gradient-accent bg-clip-text text-transparent ml-2">Light Seeker</span>
                    </h4>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-bold text-sm bg-primary/90 px-4 py-2 rounded-lg shadow-lg">
                    ▶ Play Fullscreen
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/20 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NEXEL. All rights reserved. Chill. Build. Repeat.</p>
          </div>
        </div>
      </footer>

      {/* Game Modal */}
      {isGameModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg animate-fade-in p-4"
          onClick={closeGameModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div 
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] rounded-2xl overflow-hidden border-4 border-primary/50 shadow-2xl glow-primary bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeGameModal}
              className="absolute top-2 right-2 z-10 bg-red-500/90 hover:bg-red-600 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 glow-secondary shadow-lg"
              aria-label="Close game"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Game Iframe */}
            <iframe
              src="https://prsmf.xyz"
              className="w-full h-full border-0"
              title="NEXEL Mini Game"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; keyboard-map"
              allowFullScreen
              style={{ display: 'block' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;