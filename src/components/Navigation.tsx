import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-6 w-6 text-secondary" />
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            YourLook
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-secondary ${
              isActive("/") ? "text-secondary" : "text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/design"
            className={`text-sm font-medium transition-colors hover:text-secondary ${
              isActive("/design") ? "text-secondary" : "text-foreground"
            }`}
          >
            Design Studio
          </Link>
          <Link
            to="/gallery"
            className={`text-sm font-medium transition-colors hover:text-secondary ${
              isActive("/gallery") ? "text-secondary" : "text-foreground"
            }`}
          >
            Gallery
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
          <Link to="/design">
            <Button variant="default" size="sm" className="bg-gradient-accent border-0">
              Start Designing
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
