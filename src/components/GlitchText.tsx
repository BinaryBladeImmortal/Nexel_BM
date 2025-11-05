import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchDuration?: number;
  glitchInterval?: number;
}

const GlitchText = ({ 
  text, 
  className = "", 
  glitchDuration = 200,
  glitchInterval = 4000 
}: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  const scrambleText = (originalText: string) => {
    return originalText
      .split("")
      .map(char => 
        char === " " ? " " : glitchChars[Math.floor(Math.random() * glitchChars.length)]
      )
      .join("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      
      // Quick scramble effect
      const scrambleTimeout = setTimeout(() => {
        setDisplayText(scrambleText(text));
      }, 50);

      // Return to original text
      const resetTimeout = setTimeout(() => {
        setDisplayText(text);
        setIsGlitching(false);
      }, glitchDuration);

      return () => {
        clearTimeout(scrambleTimeout);
        clearTimeout(resetTimeout);
      };
    }, glitchInterval);

    return () => clearInterval(interval);
  }, [text, glitchDuration, glitchInterval]);

  return (
    <span 
      className={`${className} ${isGlitching ? "glitch" : ""}`}
      data-text={text}
    >
      {displayText}
    </span>
  );
};

export default GlitchText;