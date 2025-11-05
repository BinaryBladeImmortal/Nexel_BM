import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";

// Simple test component
function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>🚀 NEXEL Test</h1>
        <p>If you can see this, React is working!</p>
        <p>Port: 3001</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>
);
