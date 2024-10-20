import React from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  MessageCircle,
  Bookmark,
  X,
  Check,
  Droplets,
  Building,
  Armchair,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import noavatar from "../assets/noavatar.jpg";
import Map from "../components/Map";
import axios from "../api/axios";
// import PropertyReviews from "../components/PropertyReviews";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import PropertyReviews from "@/components/PropertyReviews";
import { toast } from "@/hooks/use-toast";

export default function PropertyDetailPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [citycoordinates, setCityCoordinates] = useState([]);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [saved, setSaved] = useState(false);

  const property = useLoaderData();

  if (!property || !property.basicInfo || !property.postDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">
          Property details are not available at the moment.
        </h1>
      </div>
    );
  }

  const getCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search`,
        {
          params: {
            text: property.basicInfo.city,
            format: "json",
            apiKey: "33dee3c05442474b9daff793af34f7e0",
          },
          withCredentials: false,
        }
      );
      if (response.data?.results?.[0]) {
        const result = response.data.results[0];
        setCityCoordinates([result.lat, result.lon]);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    getCoordinates();
  }, [property._id]);

  const handleSendMessage = async () => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const receiverId = property.userId;
      if (!receiverId) return;

      const response = await axios.post("/chat/addchat", { receiverId });
      if (response.status === 200) {
        const chatId =
          response?.data?.newChat?._id || response?.data?.chat?._id;
        if (chatId) navigate(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(`/post/deletepost/${property._id}`);
      if (res.data) {
        toast({
          varaint: "destructive",
          message: "Post Delete Successfully",
        });
        navigate(`/profile/${property.userId}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSavePost = async () => {
    try {
      const res = await axios.post(`/post/save/${property._id}`);
      setSaved(res.data.saved);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div className="container max-w-[1300px] mx-auto p-2">
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery Card */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div
                    className={
                      property.basicInfo.images.length > 1
                        ? "col-span-3"
                        : "col-span-4"
                    }
                  >
                    <img
                      src={property.basicInfo.images[0]}
                      alt="Main image"
                      className="w-full h-auto rounded-md shadow-md cursor-pointer hover:opacity-90 transition"
                      onClick={() => {
                        setPhotoIndex(0);
                        setIsOpen(true);
                      }}
                    />
                  </div>
                  {property.basicInfo.images.length > 1 && (
                    <div className="space-y-4">
                      {property.basicInfo.images.slice(1).map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-auto rounded-md shadow-md cursor-pointer hover:opacity-90 transition"
                          onClick={() => {
                            setPhotoIndex(index + 1);
                            setIsOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Lightbox
                  open={isOpen}
                  close={() => setIsOpen(false)}
                  slides={property.basicInfo.images.map((src) => ({ src }))}
                  index={photoIndex}
                />
              </CardContent>
            </Card>

            {/* Property Details Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {property.basicInfo.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {property.basicInfo.address}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xl font-bold">
                    Rs {property.basicInfo.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        property.postDetail.avatar || (
                          <Avatar>
                            <AvatarImage></AvatarImage>
                            <AvatarFallback>IM</AvatarFallback>
                          </Avatar>
                        )
                      }
                    />
                    <AvatarFallback>
                      {property.postDetail.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {property.postDetail.username}
                  </span>
                </div>
                <p className="text-gray-700">
                  {property.postDetail.description}
                </p>
              </CardContent>
            </Card>

            <PropertyReviews currentUser={currentUser} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4">
            {/* Property Features Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center bg-secondary/20 p-3 rounded-md">
                  <Building className="mr-2 h-6 w-6" />
                  <CardTitle>
                    {property.basicInfo.category.charAt(0).toUpperCase() +
                      property.basicInfo.category.slice(1)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-0">Amenities</h3>
                  <ScrollArea className="h-[100px]">
                    {property.postDetail.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-md mb-2"
                      >
                        <div className="bg-secondary/20 p-2 rounded-full">
                          <Maximize className="h-4 w-4" />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                {/* Property Features */}
                <div className="space-y-4">
                  <div className="bg-secondary/10 p-3 rounded-md">
                    <h3 className="font-semibold mb-2">Pet Policy</h3>
                    <div className="flex items-center">
                      {property.postDetail.pets === "not-allowed" ||
                      property.postDetail.pets === "Not-allowed" ? (
                        <X className="mr-2 text-red-500" />
                      ) : (
                        <Check className="mr-2 text-green-500" />
                      )}
                      <span>{property.postDetail.pets}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-3 rounded-md">
                    <h3 className="font-semibold mb-2">Water Supply</h3>
                    <div className="flex items-center">
                      <Droplets className="mr-2" />
                      <span>{property.postDetail.waterSupply}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-3 rounded-md">
                    <h3 className="font-semibold mb-2">Furnishing Status</h3>
                    <div className="flex items-center">
                      <Armchair className="mr-2" />
                      <span>{property.postDetail.FurnishingStatus}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/10 p-3 rounded-md">
                    <h3 className="font-semibold mb-2">Balcony</h3>
                    <div className="flex items-center">
                      <Maximize className="mr-2" />
                      <span>{property.postDetail.balcony}</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div className="grid grid-cols-3 gap-4">
                  <Badge
                    variant="outline"
                    className="flex items-center justify-center p-3"
                  >
                    <Maximize className="mr-2" />
                    {property.postDetail.totalArea} sqft
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center justify-center p-3"
                  >
                    <Bed className="mr-2" />
                    {property.basicInfo.bedroom} beds
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center justify-center p-3"
                  >
                    <Bath className="mr-2" />
                    {property.basicInfo.bathroom} bath
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card>
              <CardContent className="p-0">
                <div className="h-64 relative rounded-md overflow-hidden z-0">
                  <Map city={citycoordinates} property={property} />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <CardFooter className="flex flex-col space-y-4 px-0">
              {currentUser && currentUser._id === property.userId ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Post
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your property listing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePost}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                currentUser && (
                  <div className="flex flex-col space-y-2 w-full">
                    <Button onClick={handleSendMessage} className="w-full">
                      <MessageCircle className="mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSavePost}
                      className="w-full"
                    >
                      <Bookmark className="mr-2" />
                      {saved ? "Unsave" : "Save Place"}
                    </Button>
                  </div>
                )
              )}
            </CardFooter>
          </div>
        </div>
      </main>
    </div>
  );
}
