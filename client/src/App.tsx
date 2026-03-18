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
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/disability-benefits"} component={DisabilityBenefits} />
      <Route path={"/tax-benefits"} component={TaxBenefits} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/innovation"} component={Innovation} />
      <Route path={"/partnership"} component={Partnership} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/learning"} component={Learning} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
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
