import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const sweetImages = ["🍯", "🧁", "🍰", "🎂", "🍮"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sweetImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOrderNowClick = () => {
    if (isAuthenticated()) {
      // Redirect based on user role
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/purchase");
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleExploreMenuClick = () => {
    if (isAuthenticated()) {
      navigate("/purchase");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-red-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)]">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full text-sm font-medium text-pink-800 border border-pink-200">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></span>
                Fresh & Authentic Indian Sweets
              </div>

              {/* Welcome Message for Authenticated Users */}
              {isAuthenticated() && (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-medium text-green-800 border border-green-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Welcome back, {user?.name}! 🎉
                </div>
              )}

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="block text-gray-800">Taste the</span>
                  <span className="block bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    Sweetness
                  </span>
                  <span className="block text-gray-800">of Tradition</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {isAuthenticated()
                  ? "Ready to indulge? Browse our premium collection and place your order for the finest authentic Indian mithai!"
                  : "Indulge in the finest collection of authentic Indian mithai, crafted with love and traditional recipes passed down through generations. Every bite tells a story of heritage and sweetness."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleOrderNowClick}
                  className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>
                      {isAuthenticated()
                        ? user?.role === "admin"
                          ? "Go to Dashboard"
                          : "Start Shopping"
                        : "Order Now"}
                    </span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  onClick={handleExploreMenuClick}
                  className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 transform hover:scale-105"
                >
                  {isAuthenticated() ? "Browse Menu" : "Explore Menu"}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 lg:pt-12">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-pink-600">
                    50+
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sweet Varieties
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Fresh Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">
                    24hr
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Delivery</div>
                </div>
              </div>
            </div>

            {/* Right Content - Sweet Display */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* Main Sweet Display */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full animate-spin-slow"></div>

                {/* Sweet Image Container */}
                <div className="absolute inset-8 bg-white/80 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50 overflow-hidden">
                  <img
                    src="/hero-sweets.png"
                    alt="Delicious Indian Sweets"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Floating Elements */}
                {/* <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white text-2xl animate-float shadow-lg"></div>
                <div className="absolute top-1/4 -left-8 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xl animate-pulse shadow-lg"></div>

                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl animate-float-delay shadow-lg"></div> */}

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-400/50 to-red-400/50 rounded-full flex items-center justify-center text-white text-2xl animate-float shadow-lg"></div>
                <div className="absolute top-1/5 -left-8 w-12 h-12 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-full flex items-center justify-center text-white text-xl animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-orange-400/50 to-pink-400/50 rounded-full flex items-center justify-center text-white text-3xl animate-float-delay shadow-lg"></div>
              </div>

              {/* Decorative Cards */}
              <div className="absolute -top-8 right-0 hidden lg:block">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 transform rotate-12 hover:rotate-6 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Fresh Made
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 right-8 hidden lg:block">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Premium Quality
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default HeroSection;
