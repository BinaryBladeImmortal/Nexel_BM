import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import App from "./App";
import "./index.css";

// Create a client
const queryClient = new QueryClient();

// Add error boundary for the root component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Root Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("Starting application...");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  
  root.render(
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="nexel-theme">
            <TooltipProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
  
  console.log("Application rendered successfully");
} catch (error) {
  console.error("Failed to render application:", error);
  
  // Fallback rendering in case of critical errors
  const fallbackElement = document.createElement('div');
  fallbackElement.style.padding = '20px';
  fallbackElement.style.color = 'white';
  fallbackElement.style.backgroundColor = '#1a1a1a';
  fallbackElement.style.minHeight = '100vh';
  fallbackElement.innerHTML = `
    <h1>Critical Error</h1>
    <p>${error?.toString()}</p>
    <button onclick="window.location.reload()">Reload Page</button>
  `;
  
  document.body.innerHTML = '';
  document.body.appendChild(fallbackElement);
}
