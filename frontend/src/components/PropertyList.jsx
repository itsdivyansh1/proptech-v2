import React from "react";
import { MapPin, Bed, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const PropertyList = ({ posts }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 gap-6">
      {posts.length > 0 ? (
        posts.map((property) => (
          <Card
            key={property._id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow "
            onClick={() => navigate(`/postdetail/${property._id}`)}
          >
            <div className="relative h-48">
              <img
                src={property?.basicInfo?.images[0]}
                alt={property?.basicInfo?.title}
                className="w-full h-full object-cover"
              />
            </div>

            <CardHeader>
              <h2 className="text-xl font-semibold">
                {property?.basicInfo?.title}
              </h2>
              <p className="text-gray-600 flex items-center">
                <MapPin size={16} className="mr-1" />
                {property?.basicInfo?.city}
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-xl text-blue-600 font-bold">
                Rs {property?.basicInfo?.price}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Bed size={16} className="mr-1" />
                {property?.basicInfo?.bedroom} bedroom
                {property?.basicInfo?.bedroom !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center text-gray-600">
                <Bath size={16} className="mr-1" />
                {property?.basicInfo?.bathroom} bathroom
                {property?.basicInfo?.bathroom !== 1 ? "s" : ""}
              </span>
            </CardFooter>
          </Card>
        ))
      ) : (
        <h1>No property found</h1>
      )}
    </div>
  );
};

export default PropertyList;
