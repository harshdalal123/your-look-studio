import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Image as ImageIcon, Save, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Design = () => {
  const location = useLocation();
  const productFromGallery = location.state?.product;

  const [selectedType, setSelectedType] = useState("t-shirt");
  const [selectedColor, setSelectedColor] = useState("#FF6B9D");
  const [selectedFabric, setSelectedFabric] = useState("cotton");
  const [designText, setDesignText] = useState("");
  const [basePrice, setBasePrice] = useState(899);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productFromGallery) {
      setSelectedType(productFromGallery.type);
      setSelectedColor(productFromGallery.color);
      setSelectedFabric(productFromGallery.fabric.toLowerCase().replace(" ", "-"));
    }
  }, [productFromGallery]);

  const clothingTypes = [
    { value: "t-shirt", label: "T-Shirt", basePrice: 899 },
    { value: "shirt", label: "Shirt", basePrice: 1999 },
    { value: "suit", label: "Suit", basePrice: 8999 },
    { value: "dress", label: "Dress", basePrice: 3499 },
    { value: "hoodie", label: "Hoodie", basePrice: 1499 },
  ];

  const fabricOptions = [
    { value: "cotton", label: "Cotton", priceMultiplier: 1 },
    { value: "linen", label: "Linen", priceMultiplier: 1.3 },
    { value: "silk-blend", label: "Silk Blend", priceMultiplier: 1.8 },
    { value: "wool-blend", label: "Wool Blend", priceMultiplier: 2 },
    { value: "polyester", label: "Polyester", priceMultiplier: 0.8 },
  ];

  const colors = [
    "#FF6B9D",
    "#A855F7",
    "#000000",
    "#FFFFFF",
    "#3B82F6",
    "#10B981",
  ];

  const handleSaveDesign = () => {
    toast.success("Design saved successfully!");
  };

  const handleAddToCart = () => {
    const price = calculatePrice();
    toast.success(`Added to cart! Total: ₹${price.toLocaleString('en-IN')}`);
  };

  const calculatePrice = () => {
    const typeData = clothingTypes.find(t => t.value === selectedType);
    const fabricData = fabricOptions.find(f => f.value === selectedFabric);
    if (!typeData || !fabricData) return 0;
    return Math.round(typeData.basePrice * fabricData.priceMultiplier);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    const typeData = clothingTypes.find(t => t.value === value);
    if (typeData) setBasePrice(typeData.basePrice);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAITryOn = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tryon', {
        body: {
          imageBase64: uploadedImage,
          designText,
          clothingType: selectedType,
          color: selectedColor
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setAiGeneratedImage(data.imageUrl);
        toast.success("AI try-on generated successfully!");
      } else {
        throw new Error("No image generated");
      }
    } catch (error: any) {
      console.error("AI try-on error:", error);
      if (error.message?.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error.message?.includes("Payment required")) {
        toast.error("AI credits required. Please add credits to continue.");
      } else {
        toast.error("Failed to generate AI try-on. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Design Studio</h1>
            <p className="text-muted-foreground">Create your perfect custom clothing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Design Tools */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Clothing Type</Label>
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clothingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - ₹{type.basePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Fabric Material</Label>
                  <Select value={selectedFabric} onValueChange={setSelectedFabric}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fabricOptions.map((fabric) => (
                        <SelectItem key={fabric.value} value={fabric.value}>
                          {fabric.label} (+{Math.round((fabric.priceMultiplier - 1) * 100)}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs defaultValue="color" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="color">
                      <Palette className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="image">
                      <ImageIcon className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="color" className="space-y-4">
                    <Label className="text-sm font-medium">Choose Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-10 w-10 rounded-lg border-2 transition-all ${
                            selectedColor === color
                              ? "border-secondary scale-110"
                              : "border-border hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <Label className="text-sm font-medium">Add Text</Label>
                    <Input
                      placeholder="Enter your text..."
                      value={designText}
                      onChange={(e) => setDesignText(e.target.value)}
                    />
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <Label className="text-sm font-medium">Upload Your Photo</Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer"
                    >
                      {uploadedImage ? (
                        <div className="space-y-2">
                          <img src={uploadedImage} alt="Uploaded" className="max-h-32 mx-auto rounded" />
                          <p className="text-sm text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Max 20MB
                          </p>
                        </>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Price:</span>
                      <span className="text-2xl font-bold text-primary">₹{calculatePrice().toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-accent border-0" onClick={handleSaveDesign}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Design
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleAITryOn}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate AI Try-On"
                    )}
                  </Button>
                  <Button className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Canvas */}
            <Card className="lg:col-span-2">
              <CardContent className="p-8">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  {aiGeneratedImage ? (
                    <img 
                      src={aiGeneratedImage} 
                      alt="AI Generated Try-On" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <svg 
                        viewBox="0 0 400 600" 
                        className="w-64 h-96"
                        style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))' }}
                      >
                        {selectedType === 't-shirt' && (
                          <g>
                            <path 
                              d="M100,100 L80,150 L80,400 L120,420 L280,420 L320,400 L320,150 L300,100 L250,120 L200,100 L150,120 Z" 
                              fill={selectedColor}
                              stroke="#333"
                              strokeWidth="2"
                            />
                            <path d="M80,150 L100,100 L150,120 L150,150 Z" fill={selectedColor} opacity="0.8" />
                            <path d="M320,150 L300,100 L250,120 L250,150 Z" fill={selectedColor} opacity="0.8" />
                          </g>
                        )}
                        {selectedType === 'shirt' && (
                          <g>
                            <path 
                              d="M100,100 L90,140 L90,450 L120,470 L280,470 L310,450 L310,140 L300,100 L260,115 L200,95 L140,115 Z" 
                              fill={selectedColor}
                              stroke="#333"
                              strokeWidth="2"
                            />
                            <line x1="200" y1="100" x2="200" y2="470" stroke="#333" strokeWidth="2" />
                            <circle cx="180" cy="200" r="3" fill="#333" />
                            <circle cx="180" cy="250" r="3" fill="#333" />
                            <circle cx="180" cy="300" r="3" fill="#333" />
                            <path d="M260,115 L310,140 L310,180 L260,160 Z" fill={selectedColor} opacity="0.9" />
                            <path d="M140,115 L90,140 L90,180 L140,160 Z" fill={selectedColor} opacity="0.9" />
                          </g>
                        )}
                        {selectedType === 'suit' && (
                          <g>
                            <path 
                              d="M100,100 L85,160 L85,500 L120,520 L180,520 L180,500 L220,500 L220,520 L280,520 L315,500 L315,160 L300,100 L250,120 L200,100 L150,120 Z" 
                              fill={selectedColor}
                              stroke="#333"
                              strokeWidth="2"
                            />
                            <path d="M200,100 L170,250 L200,520" stroke="#333" strokeWidth="2" fill="none" />
                            <path d="M200,100 L230,250 L200,520" stroke="#333" strokeWidth="2" fill="none" />
                            <path d="M150,120 L120,200 L170,250" fill="#fff" stroke="#333" strokeWidth="1.5" />
                            <path d="M250,120 L280,200 L230,250" fill="#fff" stroke="#333" strokeWidth="1.5" />
                            <rect x="175" y="160" width="50" height="8" fill="#333" />
                          </g>
                        )}
                        {selectedType === 'dress' && (
                          <g>
                            <path 
                              d="M120,100 L100,150 L100,300 Q100,450 150,550 L250,550 Q300,450 300,300 L300,150 L280,100 L240,120 L200,100 L160,120 Z" 
                              fill={selectedColor}
                              stroke="#333"
                              strokeWidth="2"
                            />
                            <path d="M100,150 L120,100 L160,120 L160,170 Z" fill={selectedColor} opacity="0.8" />
                            <path d="M300,150 L280,100 L240,120 L240,170 Z" fill={selectedColor} opacity="0.8" />
                            <ellipse cx="200" cy="300" rx="80" ry="20" fill="none" stroke="#333" strokeWidth="1" opacity="0.3" />
                          </g>
                        )}
                        {selectedType === 'hoodie' && (
                          <g>
                            <path 
                              d="M110,80 Q200,60 290,80 L310,140 L310,420 L280,440 L120,440 L90,420 L90,140 Z" 
                              fill={selectedColor}
                              stroke="#333"
                              strokeWidth="2"
                            />
                            <path d="M140,80 Q200,100 260,80 Q260,120 200,130 Q140,120 140,80" fill={selectedColor} stroke="#333" strokeWidth="2" opacity="0.9" />
                            <circle cx="200" cy="200" r="40" fill="none" stroke="#fff" strokeWidth="3" opacity="0.3" />
                            <path d="M180,300 L180,380 L220,380 L220,300" fill="none" stroke="#333" strokeWidth="2" />
                            <path d="M310,140 L310,200 L280,210 L280,150 Z" fill={selectedColor} opacity="0.8" />
                            <path d="M90,140 L90,200 L120,210 L120,150 Z" fill={selectedColor} opacity="0.8" />
                          </g>
                        )}
                        {designText && (
                          <text 
                            x="200" 
                            y="280" 
                            textAnchor="middle" 
                            fontSize="32" 
                            fontWeight="bold"
                            fill={selectedColor === "#FFFFFF" || selectedColor === "#10B981" ? "#000000" : "#FFFFFF"}
                          >
                            {designText}
                          </text>
                        )}
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground capitalize">{selectedType.replace("-", " ")}</span> • 
                    <span className="font-medium text-foreground capitalize ml-1">{selectedFabric.replace("-", " ")}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click on the canvas to customize your design
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
