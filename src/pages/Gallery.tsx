import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Gallery = () => {
  const categories = [
    { id: "all", label: "All" },
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
  ];

  const designs = [
    { id: 1, name: "Urban Street T-Shirt", category: "men", price: "$49.99", color: "#FF6B9D" },
    { id: 2, name: "Classic White Hoodie", category: "women", price: "$79.99", color: "#FFFFFF" },
    { id: 3, name: "Sunset Gradient Dress", category: "women", price: "$89.99", color: "#A855F7" },
    { id: 4, name: "Kiddo Fun Tee", category: "kids", price: "$29.99", color: "#3B82F6" },
    { id: 5, name: "Bold Black Shirt", category: "men", price: "$59.99", color: "#000000" },
    { id: 6, name: "Pastel Dream Hoodie", category: "kids", price: "$49.99", color: "#10B981" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Design Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of custom designs or get inspired for your next creation
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-12">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {designs
                    .filter((design) => cat.id === "all" || design.category === cat.id)
                    .map((design) => (
                      <Card
                        key={design.id}
                        className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <div
                          className="h-64 w-full"
                          style={{ backgroundColor: design.color }}
                        />
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{design.name}</h3>
                            <Badge variant="secondary" className="capitalize">
                              {design.category}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-secondary">
                            {design.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
