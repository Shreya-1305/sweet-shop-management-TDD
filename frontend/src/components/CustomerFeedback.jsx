import React, { useState, useEffect } from "react";

const CustomerFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const feedbacks = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment:
        "The Gulab Jamuns are absolutely divine! Reminds me of my grandmother's recipe.",
      sweet: "Gulab Jamun",
      avatar: "PS",
      gradient: "from-pink-400 to-red-400",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment:
        "Best Kaju Katli I've ever tasted! The quality is exceptional and delivery was super fast.",
      sweet: "Kaju Katli",
      avatar: "RK",
      gradient: "from-orange-400 to-pink-400",
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Ahmedabad",
      rating: 4,
      comment:
        "Loved the variety and freshness. The Rasgulla was so soft and spongy.",
      sweet: "Rasgulla",
      avatar: "AP",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Jaipur",
      rating: 5,
      comment:
        "Outstanding quality and taste! The traditional recipes are preserved perfectly.",
      sweet: "Motichoor Ladoo",
      avatar: "VS",
      gradient: "from-green-400 to-blue-400",
    },
  ];

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [feedbacks.length]);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-3 h-3 ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const currentFeedback = feedbacks[currentIndex];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Customer{" "}
          <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            Reviews
          </span>
        </h3>
        <p className="text-xs text-gray-500">What our customers say</p>
      </div>

      {/* Current Feedback Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-50 transition-all duration-500">
        {/* Header with Avatar and Info */}
        <div className="flex items-start space-x-3 mb-3">
          <div
            className={`w-8 h-8 bg-gradient-to-r ${currentFeedback.gradient} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white font-semibold text-xs">
              {currentFeedback.avatar}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 text-sm truncate">
              {currentFeedback.name}
            </h4>
            <p className="text-xs text-gray-500 mb-1">
              📍 {currentFeedback.location}
            </p>
            <div className="flex items-center space-x-1">
              <StarRating rating={currentFeedback.rating} />
              <span className="text-xs text-gray-600">
                {currentFeedback.rating}/5
              </span>
            </div>
          </div>
        </div>

        {/* Sweet Name */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 text-xs rounded-full font-medium">
            🍯 {currentFeedback.sweet}
          </span>
        </div>

        {/* Comment */}
        <p className="text-gray-700 text-xs leading-relaxed italic mb-3">
          "{currentFeedback.comment}"
        </p>

        {/* Verified Badge */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-xs text-green-600">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
            <span className="text-xs text-gray-400">
              {currentIndex === 0
                ? "2 days ago"
                : currentIndex === 1
                ? "1 week ago"
                : currentIndex === 2
                ? "2 weeks ago"
                : "1 month ago"}
            </span>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-1">
        {feedbacks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-pink-500 w-4"
                : "bg-pink-200 hover:bg-pink-300"
            }`}
          />
        ))}
      </div>

      {/* Overall Rating Summary */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-4 border border-pink-100">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl font-bold text-pink-600">4.8</span>
            <div className="text-yellow-400">
              <StarRating rating={5} />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2">Based on 250+ reviews</p>

          <div className="space-y-1 text-xs">
            {[
              { name: "Quality", rating: 4.8, width: "96%" },
              { name: "Taste", rating: 4.9, width: "98%" },
              { name: "Delivery", rating: 4.6, width: "92%" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-red-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: item.width }}
                    />
                  </div>
                  <span className="text-gray-500 w-6">{item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <button className="px-4 py-2 bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 rounded-lg hover:from-pink-200 hover:to-red-200 transition-all duration-300 text-xs font-medium border border-pink-200">
          📝 Write Review
        </button>
      </div>
    </div>
  );
};

export default CustomerFeedback;
