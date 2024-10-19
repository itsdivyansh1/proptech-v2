import React, { useState } from "react";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const PropertyReviews = ({ currentUser }) => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !newReview.trim()) {
      showNotification("Please add both rating and review text!");
      return;
    }

    const newReviewData = {
      id: reviews.length + 1,
      user: currentUser.username,
      avatar: currentUser.avatar,
      rating,
      date: new Date().toISOString().split("T")[0],
      content: newReview,
      helpful: 0,
    };

    setReviews([newReviewData, ...reviews]);
    setNewReview("");
    setRating(0);
    showNotification("Review submitted successfully!");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reviews and Ratings</CardTitle>
        <div className="flex items-center mt-2">
          <div className="flex items-center mr-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={24}
                className={`${
                  4.5 >= i ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold">4.5</span>
          <span className="text-muted-foreground ml-2">
            ({reviews.length} reviews)
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {showToast && (
          <Alert className="mb-4">
            <AlertDescription>{toastMessage}</AlertDescription>
          </Alert>
        )}

        {currentUser ? (
          <form onSubmit={handleSubmitReview} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={24}
                    className={`cursor-pointer ${
                      (hover || rating) >= i
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <Textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience with this property..."
                className="min-h-32"
              />
            </div>
            <Button type="submit">Submit Review</Button>
          </form>
        ) : (
          <Alert variant="info" className="mb-8">
            <AlertDescription>
              Please{" "}
              <Button variant="link" asChild className="p-0">
                <a href="/login">login</a>
              </Button>{" "}
              to leave a review
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center mb-3">
                <Avatar className="mr-3">
                  <AvatarImage src={review.avatar} alt={review.user} />
                  <AvatarFallback>
                    {review.user.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{review.user}</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          review.rating >= i
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-muted-foreground text-sm ml-2">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">{review.content}</p>
              <div className="flex items-center text-sm">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-4"
                      onClick={() => showNotification("Marked as helpful!")}
                    >
                      <ThumbsUp size={16} className="mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Mark this review as helpful
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showNotification("Report submitted")}
                    >
                      <Flag size={16} className="mr-1" />
                      Report
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>Report this review</HoverCardContent>
                </HoverCard>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;
