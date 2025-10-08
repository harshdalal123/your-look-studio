import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Type, Image as ImageIcon, Save, ShoppingCart, Loader2, Sparkles, Ruler } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Design = () => {
  const location = useLocation();
  const productFromGallery = location.state?.product;

  const [selectedType, setSelectedType] = useState("t-shirt");
  const [selectedColor, setSelectedColor] = useState("#FF6B9D");
  const [selectedFabric, setSelectedFabric] = useState("cotton");
  const [selectedSize, setSelectedSize] = useState("M");
  const [designText, setDesignText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productFromGallery) {
      setSelectedType(productFromGallery.type);
      setSelectedColor(productFromGallery.color);
      setSelectedFabric(productFromGallery.fabric.toLowerCase().replace(" ", "-"));
    }
  }, [productFromGallery]);

  const clothingTypes = [
    { value: "t-shirt", label: "T-Shirt", basePrice: 899, category: ["men", "women", "kids"] },
    { value: "shirt", label: "Shirt", basePrice: 1999, category: ["men", "women"] },
    { value: "suit", label: "Suit", basePrice: 8999, category: ["men", "women"] },
    { value: "dress", label: "Dress", basePrice: 3499, category: ["women", "kids"] },
    { value: "hoodie", label: "Hoodie", basePrice: 1499, category: ["men", "women", "kids"] },
    { value: "blazer", label: "Blazer", basePrice: 5999, category: ["men", "women"] },
    { value: "jacket", label: "Jacket", basePrice: 4499, category: ["men", "women", "kids"] },
    { value: "skirt", label: "Skirt", basePrice: 1999, category: ["women", "kids"] },
    { value: "pants", label: "Pants", basePrice: 2499, category: ["men", "women", "kids"] },
  ];

  const fabricOptions = [
    { value: "cotton", label: "Cotton", priceMultiplier: 1 },
    { value: "linen", label: "Linen", priceMultiplier: 1.3 },
    { value: "silk-blend", label: "Silk Blend", priceMultiplier: 1.8 },
    { value: "wool-blend", label: "Wool Blend", priceMultiplier: 2 },
    { value: "polyester", label: "Polyester", priceMultiplier: 0.8 },
  ];

  const sizes = [
    { value: "XS", label: "XS (Extra Small)" },
    { value: "S", label: "S (Small)" },
    { value: "M", label: "M (Medium)" },
    { value: "L", label: "L (Large)" },
    { value: "XL", label: "XL (Extra Large)" },
    { value: "XXL", label: "XXL (2XL)" },
    { value: "XXXL", label: "XXXL (3XL)" },
  ];

  const colors = [
    { hex: "#FF6B9D", name: "Pink" },
    { hex: "#A855F7", name: "Purple" },
    { hex: "#000000", name: "Black" },
    { hex: "#FFFFFF", name: "White" },
    { hex: "#3B82F6", name: "Blue" },
    { hex: "#10B981", name: "Green" },
    { hex: "#EF4444", name: "Red" },
    { hex: "#F59E0B", name: "Orange" },
    { hex: "#FBBF24", name: "Yellow" },
    { hex: "#8B5CF6", name: "Violet" },
    { hex: "#EC4899", name: "Hot Pink" },
    { hex: "#6366F1", name: "Indigo" },
    { hex: "#14B8A6", name: "Teal" },
    { hex: "#F97316", name: "Deep Orange" },
    { hex: "#84CC16", name: "Lime" },
    { hex: "#06B6D4", name: "Cyan" },
  ];

  const handleSaveDesign = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to save your design");
        return;
      }

      const price = calculatePrice();
      const { error } = await supabase.from("designs").insert({
        user_id: user.id,
        name: `${selectedType} - ${new Date().toLocaleDateString()}`,
        clothing_type: selectedType,
        color: selectedColor,
        fabric: selectedFabric,
        size: selectedSize,
        design_text: designText,
        uploaded_image_url: uploadedImage,
        ai_generated_image_url: aiGeneratedImage,
        price: price,
        design_data: {
          aiPrompt,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      toast.success("Design saved successfully!");
    } catch (error: any) {
      console.error("Error saving design:", error);
      toast.error("Failed to save design. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = () => {
    const price = calculatePrice();
    toast.success(`Added to cart! Total: ₹${price.toLocaleString('en-IN')}`);
  };

  const calculatePrice = () => {
    const typeData = clothingTypes.find(t => t.value === selectedType);
    const fabricData = fabricOptions.find(f => f.value === selectedFabric);
    if (!typeData || !fabricData) return 0;
    
    let sizeMultiplier = 1;
    if (selectedSize === "XL") sizeMultiplier = 1.1;
    else if (selectedSize === "XXL") sizeMultiplier = 1.2;
    else if (selectedSize === "XXXL") sizeMultiplier = 1.3;
    
    return Math.round(typeData.basePrice * fabricData.priceMultiplier * sizeMultiplier);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
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

  const handleAIDesign = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe your design idea");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tryon', {
        body: {
          prompt: aiPrompt,
          clothingType: selectedType,
          color: selectedColor,
          type: "design"
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setAiGeneratedImage(data.imageUrl);
        toast.success("AI design generated successfully!");
      } else {
        throw new Error("No image generated");
      }
    } catch (error: any) {
      console.error("AI design error:", error);
      if (error.message?.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error.message?.includes("Payment required")) {
        toast.error("AI credits required. Please add credits to continue.");
      } else {
        toast.error("Failed to generate AI design. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAITryOn = async () => {
    if (!uploadedImage) {
      toast.error("Please upload your photo first");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tryon', {
        body: {
          imageBase64: uploadedImage,
          designText,
          clothingType: selectedType,
          color: selectedColor,
          type: "tryon"
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
          <div className="mb-6 md:mb-8 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Design Studio</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              👗👕👔 Create clothing that&apos;s truly yours — for Men, Women, or Kids.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
              <Card className="p-3 md:p-4">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">✅ Choose Your Style</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Select from T-shirts, shirts, suits, dresses, and more.</p>
              </Card>
              <Card className="p-3 md:p-4">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">✅ AI Custom Design</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Describe your dream outfit and let AI bring it to life.</p>
              </Card>
              <Card className="p-3 md:p-4">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">✅ Perfect Fit Sizing</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Choose your standard size for a flawless fit.</p>
              </Card>
              <Card className="p-3 md:p-4">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">✅ Image Upload</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Upload any image for your custom design.</p>
              </Card>
              <Card className="p-3 md:p-4">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">✅ Try-On with AI</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Preview how your custom outfit will look on you.</p>
              </Card>
              <Card className="p-3 md:p-4">
                <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">✅ Order & Save</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Save designs and place orders instantly.</p>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Design Tools */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-4 md:pt-6 space-y-4 md:space-y-6">
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

                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Size
                  </Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs defaultValue="ai-design" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-auto">
                    <TabsTrigger value="ai-design" className="flex-col gap-1 py-2">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs hidden sm:inline">AI</span>
                    </TabsTrigger>
                    <TabsTrigger value="color" className="flex-col gap-1 py-2">
                      <Palette className="h-4 w-4" />
                      <span className="text-xs hidden sm:inline">Color</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex-col gap-1 py-2">
                      <Type className="h-4 w-4" />
                      <span className="text-xs hidden sm:inline">Text</span>
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex-col gap-1 py-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-xs hidden sm:inline">Image</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ai-design" className="space-y-4">
                    <Label className="text-sm font-medium">AI Design Generator</Label>
                    <Textarea
                      placeholder="Describe your design... (e.g., 'black oversized hoodie with galaxy print')"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      className="w-full bg-gradient-accent border-0"
                      onClick={handleAIDesign}
                      disabled={isGenerating || !aiPrompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate AI Design
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="color" className="space-y-4">
                    <Label className="text-sm font-medium">Choose Color</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => setSelectedColor(color.hex)}
                          className={`h-12 rounded-lg border-2 transition-all flex items-center gap-1.5 px-2 ${
                            selectedColor === color.hex
                              ? "border-secondary scale-105"
                              : "border-border hover:scale-105"
                          }`}
                        >
                          <div 
                            className="h-8 w-8 rounded flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-medium truncate">{color.name}</span>
                        </button>
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
                  
                  <Button 
                    className="w-full bg-gradient-accent border-0" 
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Design
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleAITryOn}
                    disabled={isGenerating || !uploadedImage}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        AI Try-On with Photo
                      </>
                    )}
                  </Button>
                  <Button className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart - ₹{calculatePrice().toLocaleString('en-IN')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Canvas */}
            <Card className="lg:col-span-2">
              <CardContent className="p-4 md:p-8">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  {aiGeneratedImage ? (
                    <img 
                      src={aiGeneratedImage} 
                      alt="AI Generated Try-On" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <svg 
                        viewBox="0 0 400 600" 
                        className="w-48 h-72 md:w-64 md:h-96"
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
                <div className="mt-4 md:mt-6 text-center space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground capitalize">{selectedType.replace("-", " ")}</span> • 
                    <span className="font-medium text-foreground capitalize ml-1">{selectedFabric.replace("-", " ")}</span> • 
                    <span className="font-medium text-foreground ml-1">Size {selectedSize}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    🧵 Start designing now and wear your imagination
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
