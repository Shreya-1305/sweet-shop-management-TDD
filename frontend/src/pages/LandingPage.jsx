import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      {/* Additional Section with Static Cards */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                MithaiMart?
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the authentic taste of India's finest sweets with our
              premium quality assurance and doorstep delivery
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-100">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-white">🍯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                50+ Varieties
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                From traditional Gulab Jamun to exotic Kesar Pista Barfi,
                explore our vast collection of authentic Indian sweets
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-white">🌿</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                100% Fresh
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Made fresh daily using the finest ingredients and traditional
                recipes. No preservatives, just pure taste
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-white">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Same-day delivery within city limits. Your sweet cravings
                delivered fresh to your doorstep in hours
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Handcrafted by master sweet makers using time-honored techniques
                and the finest quality ingredients
              </p>
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="mt-16 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-3xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                🎉 Grand Opening Special!
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Get 25% off on your first order + Free delivery on orders above
                ₹500
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-colors duration-300 transform hover:scale-105">
                  Claim Offer Now
                </button>
                <span className="text-sm opacity-80">
                  *Valid till stocks last
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
