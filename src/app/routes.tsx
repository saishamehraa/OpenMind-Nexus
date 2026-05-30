import { createBrowserRouter } from "react-router";
import HomePage from "./components/HomePage";
import FeedView from "./components/FeedView";
import BiasDetector from "./components/BiasDetector";
import InsightsView from "./components/InsightsView";
import Navigation from "./components/Navigation";
import OrchestrationDashboard from "./components/OrchestrationDashboard";

// Root layout component
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/feed",
    element: <RootLayout><FeedView /></RootLayout>,
  },
  {
    path: "/bias-check",
    element: <RootLayout><BiasDetector /></RootLayout>,
  },
  {
    path: "/insights",
    element: <RootLayout><InsightsView /></RootLayout>,
  },
  {
    path: "/orchestration",
    element: <RootLayout><OrchestrationDashboard /></RootLayout>,
  },
  {
    path: "*",
    element: (
      <RootLayout>
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Page Not Found</h1>
          <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="text-violet-600 hover:text-violet-700 font-medium">
            Return Home
          </a>
        </div>
      </RootLayout>
    ),
  },
]);
