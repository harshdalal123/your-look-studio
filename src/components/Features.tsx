import { Palette, Shirt, Sparkles, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI Try-On",
    description: "Upload your photo and see how designs look on you with AI-powered visualization.",
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "Choose colors, fabrics, add text, patterns, and logos with our intuitive editor.",
  },
  {
    icon: Shirt,
    title: "Redesign Old Clothes",
    description: "Send in your existing garments for a fresh new look with modern colors and designs.",
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Design clothing for men, women, and kids with sizes and styles for all.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-lg text-muted-foreground">
            Professional tools and AI technology to bring your fashion vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
