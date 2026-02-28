import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col">
      
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold">📚 BookClub</h1>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold leading-tight">
            Discover. Discuss. Track. Grow.
          </h2>
          <p className="mt-6 text-lg text-indigo-100">
            Join a passionate community of readers. Suggest books, track your
            reading progress, set goals, and engage in meaningful discussions.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-200">
                Join the Club
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 text-indigo-200 text-sm">
        © 2026 BookClub Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;