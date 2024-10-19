import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchProperty() {
  const [searchType, setSearchType] = useState("buy");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      category: searchType,
      city,
      minPrice,
      maxPrice,
    }).toString();

    navigate(`/list?${queryParams}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Hero Text */}
      <div className="text-start mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Find Real Estate & Get Your Dream Place
        </h3>
        <p className="text-md text-muted-foreground">
          Discover your perfect home with PropTech. We offer a wide range of
          properties to suit every need and budget. Start your journey to
          homeownership today!
        </p>
      </div>

      {/* Search Card */}
      <Card className="w-full">
        <CardContent className="pt-6">
          {/* Buy/Rent Tabs */}
          <Tabs defaultValue="buy" className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger
                onClick={() => setSearchType("buy")}
                value="buy"
                className="w-1/2"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSearchType("rent")}
                value="rent"
                className="w-1/2"
              >
                Rent
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder="City"
              className="w-full"
              onChange={(e) => setCity(e.target.value.toLowerCase())}
            />
            <Input
              type="number"
              placeholder="Min Price"
              className="w-full"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              className="w-full"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <Button
            className="w-full mt-4"
            variant="default"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            Search Properties
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SearchProperty;
