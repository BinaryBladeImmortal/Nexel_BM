import { Users, Target, Award, Mail } from "lucide-react";
import cyberWorkspace from "@/assets/cyber-workspace.jpg";
import slaniImage from "@/assets/Slani_fernandes.png";
import jollsImage from "@/assets/Jolls_dmello.png";
import cristImage from "@/assets/Crist_fernandes.png";

const AboutUs = () => {
  const stats = [
    { value: "50K+", label: "Developers" },
    { value: "10K+", label: "Assets" },
    { value: "2M+", label: "Downloads" },
    { value: "150+", label: "Countries" }
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible in cyberpunk gaming development."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections between creators and fostering collaborative development."
    },
    {
      icon: Award,
      title: "Quality", 
      description: "Maintaining the highest standards in assets, tutorials, and platform experience."
    }
  ];

  const team = [
    {
      name: "Slani Fernandes",
      role: "Founder & Game Developer",
      image: slaniImage,
      bio: "A visionary game developer driven by creativity and innovation. Slani leads NEXEL with the goal of revolutionizing interactive entertainment and empowering the next generation of creators.",
      skills: ["Game Design", "Unity", "C#", "Visual Effects"]
    },
    {
      name: "Jolls Dmello", 
      role: "Full-Stack App Developer",
      image: jollsImage,
      bio: "A passionate developer who played a key role in building NEXEL's core website and digital infrastructure. Jolls combines technical precision with creative problem-solving, aiming to make technology accessible and intelligent.",
      skills: ["Frontend Development", "Backend Systems", "UI/UX", "Machine Learning"]
    },
    {
      name: "Crist Fernandes",
      role: "Research Specialist",
      image: cristImage,
      bio: "A curious mind dedicated to exploring the latest trends, tools, and breakthroughs in the gaming world. Crist stays ahead of the curve, gathering insights and knowledge that fuel innovation within the NEXEL team and the wider game development community.",
      skills: ["Game Industry Research", "Emerging Technologies", "Community Insights", "Innovation Strategy"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 cyber-grid">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold title-orbitron mb-6">
              About NEXEL
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're building the future of cyberpunk gaming development, 
              one creator at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold title-orbitron mb-6">
              Our Mission
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="relative order-2 lg:order-1">
              <img 
                src={cyberWorkspace} 
                alt="Cyberpunk workspace"
                className="rounded-xl shadow-2xl w-full hover:glow-cyan transition-all duration-300"
              />
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At NEXEL, we believe that every creative mind deserves access to professional-grade game development tools and knowledge. Our mission is to democratize game development by providing a comprehensive arsenal of assets, tutorials, and community support.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're building the future of indie game development, where creativity meets cutting-edge technology in a cyberpunk-inspired ecosystem that empowers developers to bring their wildest digital dreams to life.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={stat.label} className="gradient-border p-6 text-center hover:glow-primary transition-all duration-300">
                <div className="text-3xl font-bold font-orbitron title-orbitron mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold title-orbitron mb-6">
              Core Values
            </h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={value.title}
                  className="gradient-border p-8 hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="h-12 w-12 text-primary mb-6" />
                  <h3 className="text-2xl font-bold font-orbitron mb-4">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-orbitron font-bold title-orbitron mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              The creators behind the cyberpunk revolution
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="gradient-border p-4 hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up bg-card rounded-lg"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className={`w-full h-48 rounded-lg mb-4 ${
                    member.name === "Slani Fernandes" ? "object-cover object-top" : 
                    member.name === "Jolls Dmello" ? "object-cover object-center" : 
                    "object-cover"
                  }`}
                />
                <div className="text-center">
                  <h3 className="text-xl font-bold font-orbitron mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3 text-sm">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4 text-left text-sm">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold title-orbitron mb-6">
            Join Our Journey
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Ready to be part of the cyberpunk gaming revolution?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="#"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold text-lg hover:glow-primary hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
            </a>
            
            <a
              href="mailto:hello@nexel.dev"
              className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-secondary text-secondary rounded-lg font-semibold text-lg hover:bg-secondary hover:text-black hover:glow-cyan transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;