import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)",
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background z-10" />

      <div className="container mx-auto px-4 relative z-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              AI-Powered Fashion Design
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-background leading-tight">
            Design Your Dream
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Clothing
            </span>
          </h1>

          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Create custom clothing for men, women, and kids. Upload your photo,
            choose fabrics, add designs, and see how it looks before you order.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/design">
              <Button
                size="lg"
                className="bg-gradient-accent border-0 text-lg px-8 shadow-elegant hover:scale-105 transition-transform"
              >
                Start Designing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-background/10 backdrop-blur-sm border-background/20 text-background hover:bg-background/20"
              >
                Browse Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
