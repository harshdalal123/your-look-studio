import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const navigate = useNavigate();

  const categories = [
    { id: "all", label: "All" },
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
  ];

  const products = [
    { id: 1, name: "Classic Cotton T-Shirt", type: "t-shirt", category: "men", price: "₹899", color: "#FF6B9D", fabric: "Cotton" },
    { id: 2, name: "Premium Linen Shirt", type: "shirt", category: "men", price: "₹1,999", color: "#3B82F6", fabric: "Linen" },
    { id: 3, name: "Designer Suit", type: "suit", category: "men", price: "₹8,999", color: "#000000", fabric: "Wool Blend" },
    { id: 4, name: "Casual Cotton T-Shirt", type: "t-shirt", category: "men", price: "₹799", color: "#10B981", fabric: "Cotton" },
    
    { id: 5, name: "Silk Blend Dress", type: "dress", category: "women", price: "₹3,499", color: "#A855F7", fabric: "Silk Blend" },
    { id: 6, name: "Cotton T-Shirt", type: "t-shirt", category: "women", price: "₹849", color: "#FF6B9D", fabric: "Cotton" },
    { id: 7, name: "Formal Shirt", type: "shirt", category: "women", price: "₹1,799", color: "#FFFFFF", fabric: "Cotton" },
    { id: 8, name: "Designer Suit", type: "suit", category: "women", price: "₹7,999", color: "#000000", fabric: "Polyester Blend" },
    
    { id: 9, name: "Kids Fun T-Shirt", type: "t-shirt", category: "kids", price: "₹599", color: "#3B82F6", fabric: "Cotton" },
    { id: 10, name: "Kids Casual Shirt", type: "shirt", category: "kids", price: "₹899", color: "#10B981", fabric: "Cotton" },
    { id: 11, name: "Kids Party Dress", type: "dress", category: "kids", price: "₹1,499", color: "#A855F7", fabric: "Polyester" },
    { id: 12, name: "Kids Cotton Tee", type: "t-shirt", category: "kids", price: "₹549", color: "#FF6B9D", fabric: "Cotton" },
  ];

  const handleDesignClick = (product: typeof products[0]) => {
    navigate('/design', { state: { product } });
  };

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
                  {products
                    .filter((product) => cat.id === "all" || product.category === cat.id)
                    .map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
                      >
                        <div
                          className="h-64 w-full relative"
                          style={{ backgroundColor: product.color }}
                        >
                          <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
                            {product.fabric}
                          </Badge>
                        </div>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <Badge variant="secondary" className="capitalize mt-1">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-primary">
                              {product.price}
                            </p>
                            <Button 
                              onClick={() => handleDesignClick(product)}
                              className="bg-gradient-accent"
                            >
                              Customize
                            </Button>
                          </div>
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
