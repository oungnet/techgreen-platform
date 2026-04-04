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
import ArticleDetail from "./pages/ArticleDetail";
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
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "./components/Footer";
import AdminRouteGuard from "./components/AdminRouteGuard";
import AdminContentStudio from "./pages/AdminContentStudio";
import OpenDataDashboard from "./pages/OpenDataDashboard";
import EnergyDataPage from "./pages/EnergyDataPage";
import OpenDataCatalog from "./pages/OpenDataCatalog";
import ComponentShowcase from "./pages/ComponentShowcase";
import LoginMembership from "./pages/LoginMembership";
import UserProfileMembership from "./pages/UserProfileMembership";
import ProtectedRoute from "./components/ProtectedRoute";

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
      <Route path="/learning/:slug" component={ArticleDetail} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={LoginMembership} />
      <Route path="/login-legacy" component={Login} />
      <Route path="/apply-benefits" component={ApplyBenefits} />
      <Route path="/contact" component={Contact} />
      <Route path="/dashboard-user">
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <UserProfileMembership />
        </ProtectedRoute>
      </Route>
      <Route path="/profile-legacy" component={UserProfile} />
      <Route path="/email-preferences" component={EmailPreferences} />
      <Route path="/admin">
        <AdminRouteGuard>
          <AdminDashboard />
        </AdminRouteGuard>
      </Route>
      <Route path="/admin/users">
        <AdminRouteGuard>
          <UserManagement />
        </AdminRouteGuard>
      </Route>
      <Route path="/admin/moderation">
        <AdminRouteGuard>
          <ContentModeration />
        </AdminRouteGuard>
      </Route>
      <Route path="/admin/campaigns">
        <AdminRouteGuard>
          <EmailCampaigns />
        </AdminRouteGuard>
      </Route>
      <Route path="/admin/analytics">
        <AdminRouteGuard>
          <AnalyticsDashboard />
        </AdminRouteGuard>
      </Route>
      <Route path="/admin/content">
        <AdminRouteGuard>
          <ContentManagement />
        </AdminRouteGuard>
      </Route>
      <Route path="/analytics" component={AnalyticsDashboard} />
      <Route path="/open-data" component={OpenDataDashboard} />
      <Route path="/open-data/energy" component={EnergyDataPage} />
      <Route path="/open-data/catalog" component={OpenDataCatalog} />
      <Route path="/components" component={ComponentShowcase} />
      <Route path="/member-dashboard" component={MemberDashboard} />
      <Route path="/admin/articles">
        <AdminRouteGuard>
          <ArticleManagement />
        </AdminRouteGuard>
      </Route>
      <Route path="/admin/content-studio">
        <AdminRouteGuard>
          <AdminContentStudio />
        </AdminRouteGuard>
      </Route>
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
            <Breadcrumb />
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
