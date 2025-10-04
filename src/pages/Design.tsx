import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Image, Save } from "lucide-react";
import { toast } from "sonner";

const Design = () => {
  const [selectedType, setSelectedType] = useState("t-shirt");
  const [selectedColor, setSelectedColor] = useState("#FF6B9D");
  const [designText, setDesignText] = useState("");

  const clothingTypes = [
    { value: "t-shirt", label: "T-Shirt" },
    { value: "hoodie", label: "Hoodie" },
    { value: "dress", label: "Dress" },
    { value: "shirt", label: "Shirt" },
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
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clothingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
                      <Image className="h-4 w-4" />
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
                    <Label className="text-sm font-medium">Upload Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 space-y-3">
                  <Button className="w-full bg-gradient-accent border-0" onClick={handleSaveDesign}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Design
                  </Button>
                  <Button variant="outline" className="w-full">
                    Preview with AI Try-On
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Canvas */}
            <Card className="lg:col-span-2">
              <CardContent className="p-8">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div
                    className="w-64 h-80 rounded-lg shadow-elegant transition-all duration-300"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {designText && (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-2xl font-bold" style={{ 
                          color: selectedColor === "#FFFFFF" || selectedColor === "#10B981" ? "#000000" : "#FFFFFF" 
                        }}>
                          {designText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{selectedType}</span>
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
