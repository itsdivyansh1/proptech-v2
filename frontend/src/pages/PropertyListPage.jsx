import React, { useEffect, useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropertyList from "@/components/PropertyList";
import Map from "@/components/Map";

function PropertyListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityCoordinates, setCityCoordinates] = useState([]);
  const [searchParams, setSearchParams] = useState({
    searchType: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    // Update search params from URL on mount and URL changes
    setSearchParams({
      searchType: queryParams.get("category") || "buy",
      city: queryParams.get("city") || "",
      minPrice: queryParams.get("minPrice") || "",
      maxPrice: queryParams.get("maxPrice") || "",
    });

    getPosts();
  }, [location.search]);

  const getPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:3100/api/post/getposts",
        {
          params: {
            category: queryParams.get("category"),
            city: queryParams.get("city"),
            minPrice: queryParams.get("minPrice"),
            maxPrice: queryParams.get("maxPrice"),
            address: queryParams.get("address") || null,
          },
        }
      );

      if (response.data?.posts) {
        setPosts(response.data.posts);
      } else {
        throw new Error("No posts data received");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.response?.data?.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const getCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search`,
        {
          params: {
            text: queryParams.get("city"),
            format: "json",
            apiKey: "33dee3c05442474b9daff793af34f7e0",
          },
          withCredentials: false,
        }
      );
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const result = response.data.results[0];
        console.log("Setting city coordinates:", [result.lat, result.lon]);
        setCityCoordinates([result.lat, result.lon]);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    getCoordinates();
    getPosts();
    console.log(location.search);
  }, [location.search]);

  const handleSearchParamChange = (key, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      category: searchParams.searchType,
      ...(searchParams.city && { city: searchParams.city.toLowerCase() }),
      ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
      ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
    }).toString();

    navigate(`/list?${params}`);
  };

  return (
    <div className="container max-w-[1300px] mx-auto p-4 grid md:grid-cols-8 gap-4">
      <div className="md:col-span-5 flex flex-col gap-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <Tabs value={searchParams.searchType} className="mb-6">
              <TabsList className="w-full">
                <TabsTrigger
                  onClick={() => handleSearchParamChange("searchType", "buy")}
                  value="buy"
                  className="w-1/2"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => handleSearchParamChange("searchType", "rent")}
                  value="rent"
                  className="w-1/2"
                >
                  Rent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="City"
                value={searchParams.city}
                onChange={(e) =>
                  handleSearchParamChange("city", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Min Price"
                value={searchParams.minPrice}
                onChange={(e) =>
                  handleSearchParamChange("minPrice", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={searchParams.maxPrice}
                onChange={(e) =>
                  handleSearchParamChange("maxPrice", e.target.value)
                }
              />
            </div>

            <Button
              className="w-full mt-4"
              variant="default"
              onClick={handleSearch}
              disabled={loading}
            >
              <Search className="h-5 w-5 mr-2" />
              Search Properties
            </Button>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Properties</h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : (
            <PropertyList posts={posts} />
          )}
        </div>
      </div>

      <div className="md:col-span-3">
        <div
          className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4"
          style={{ height: "500px", width: "100%" }}
        >
          <Map posts={posts} city={cityCoordinates} />
        </div>
      </div>
    </div>
  );
}

export default PropertyListPage;
