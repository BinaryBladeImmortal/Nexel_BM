import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "./components/ScrollToTop";
import RootLayout from "./components/layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import Index from "./pages/Index";
import Assets from "./pages/Assets";
import AboutUs from "./pages/AboutUs";
import LearnHub from "./pages/LearnHub";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminAssets from "./pages/Admin/Assets";
import AdminTutorials from "./pages/Admin/Tutorials";
import AdminCommunity from "./pages/Admin/Community";

// Create a separate component for routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Index />} />
        <Route path="assets" element={<Assets />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="learn" element={<LearnHub />} />
        <Route path="community" element={<Community />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="auth" element={<Auth />} />
        <Route path="profile" element={<Profile />} />
        <Route path="library" element={<Library />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="assets" element={<AdminAssets />} />
        <Route path="tutorials" element={<AdminTutorials />} />
        <Route path="community" element={<AdminCommunity />} />
      </Route>
    </Routes>
  );
};

function App() {
  console.log('🚀 App component rendering');
  
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster />
      <Sonner />
    </>
  );
}

export default App;
