import { Link } from "react-router-dom";
import { ArrowRight, Users, Package, BookOpen, Gamepad2 } from "lucide-react";
import GlitchText from "@/components/GlitchText";
import cyberpunkHeroBg from "@/assets/cyberpunk-hero-bg.jpg";
import HomeShowcase from "@/components/HomeShowcase";

const Index = () => {
  const stats = [
    { value: "50K+", label: "Active Developers", icon: Users },
    { value: "10K+", label: "Premium Assets", icon: Package },
    { value: "500+", label: "Tutorials", icon: BookOpen },
    { value: "2K+", label: "Community Projects", icon: Gamepad2 },
  ];

  const features = [
    {
      icon: Package,
      title: "Asset Marketplace",
      description: "Premium cyberpunk assets, 3D models, sprites, and audio packs for your games."
    },
    {
      icon: BookOpen,
      title: "LearnHub",
      description: "Master game development with our XP-based learning system and expert tutorials."
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with creators, share projects, and climb the leaderboards."
    }
  ];

  

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center cyber-grid"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${cyberpunkHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-orbitron font-black title-orbitron mb-6 animate-fade-in-up">
            NEXEL
          </h1>
          
          <div className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium">
            <GlitchText text="Chill. Build. Repeat." className="title-retro" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/learn"
              className="group px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold text-xl hover:glow-primary hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Start Building
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/assets"
              className="px-8 py-4 border-2 border-secondary text-secondary rounded-lg font-semibold text-xl hover:bg-secondary hover:text-black hover:glow-cyan transition-all duration-300"
            >
              Explore Assets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="text-center group animate-fade-in-up hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="gradient-border p-6 mb-4 hover:glow-primary transition-all duration-300">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <div className="text-3xl md:text-4xl font-bold font-orbitron title-orbitron mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold title-orbitron mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, learn, and share cyberpunk gaming experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="gradient-border p-8 hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="h-12 w-12 text-primary mb-6" />
                  <h3 className="text-2xl font-bold font-orbitron mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold title-orbitron mb-6">
              Community Showcase
            </h2>
            <p className="text-xl text-muted-foreground">
              Amazing games created by our community developers
            </p>
          </div>
          
          <HomeShowcase />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold title-orbitron mb-6">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of developers creating the future of cyberpunk gaming
          </p>
          
          <Link 
            to="/pricing"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-primary text-white rounded-lg font-bold text-xl hover:glow-primary hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;