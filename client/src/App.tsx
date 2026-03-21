import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DisabilityBenefits from "./pages/DisabilityBenefits";
import TaxBenefits from "./pages/TaxBenefits";
import Resources from "./pages/Resources";
import Innovation from "./pages/Innovation";
import Partnership from "./pages/Partnership";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ApplyBenefits from "./pages/ApplyBenefits";
import Contact from "./pages/Contact";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import EmailPreferences from "./pages/EmailPreferences";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ContentModeration from "./pages/ContentModeration";
import EmailCampaigns from "./pages/EmailCampaigns";
import UserManagement from "./pages/UserManagement";
import MemberDashboard from "./pages/MemberDashboard";
import ContentManagement from "./pages/ContentManagement";
import MemberAnalytics from "./pages/MemberAnalytics";
import ArticleManagement from "./pages/ArticleManagement";
import NavigationEnhanced from "@/components/NavigationEnhanced";
import Footer from "./components/Footer";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/disability-benefits" component={DisabilityBenefits} />
      <Route path="/tax-benefits" component={TaxBenefits} />
      <Route path="/resources" component={Resources} />
      <Route path="/innovation" component={Innovation} />
      <Route path="/partnership" component={Partnership} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/learning" component={Learning} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/apply-benefits" component={ApplyBenefits} />
      <Route path="/contact" component={Contact} />
      <Route path="/dashboard-user" component={UserDashboard} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/email-preferences" component={EmailPreferences} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={UserManagement} />
      <Route path="/admin/moderation" component={ContentModeration} />
      <Route path="/admin/campaigns" component={EmailCampaigns} />
      <Route path="/admin/analytics" component={AnalyticsDashboard} />
      <Route path="/admin/content" component={ContentManagement} />      <Route path="/analytics" component={AnalyticsDashboard} />
      <Route path="/member-dashboard" component={MemberDashboard} />
      <Route path="/admin/articles" component={ArticleManagement} />
      <Route path="/*" component={NotFound} />   </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <NavigationEnhanced />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
