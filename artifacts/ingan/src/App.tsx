import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AssessmentProvider } from "@/context/assessment-context";

// Pages
import Home from "@/pages/home";
import Start from "@/pages/start";
import Invite from "@/pages/invite";
import SurveyIntro from "@/pages/survey-intro";
import Survey from "@/pages/survey";
import Chat from "@/pages/chat";
import Report from "@/pages/report";
import Pricing from "@/pages/pricing";
import PremiumReport from "@/pages/premium-report";
import Admin from "@/pages/admin/index";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/start" component={Start} />
      <Route path="/invite" component={Invite} />
      <Route path="/survey/intro" component={SurveyIntro} />
      <Route path="/survey" component={Survey} />
      <Route path="/chat" component={Chat} />
      <Route path="/report" component={Report} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/premium-report" component={PremiumReport} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AssessmentProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AssessmentProvider>
    </QueryClientProvider>
  );
}

export default App;
