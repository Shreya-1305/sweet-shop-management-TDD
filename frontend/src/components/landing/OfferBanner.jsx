// src/components/landing/OfferBanner.jsx
import React from "react";

const OfferBanner = ({ isAuthenticated, user }) => {
  return (
    <div className="mt-16 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-3xl p-8 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        {isAuthenticated() ? (
          <>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              🎉 Welcome Back Offer!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {user?.role === "admin"
                ? "Check your dashboard for store insights and manage inventory"
                : "Enjoy exclusive member discounts on all premium sweets + Priority delivery"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-colors duration-300 transform hover:scale-105">
                {user?.role === "admin" ? "Go to Dashboard" : "Start Shopping"}
              </button>
              <span className="text-sm opacity-80">
                *Exclusive member benefits
              </span>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
    </div>
  );
};

export default OfferBanner;
