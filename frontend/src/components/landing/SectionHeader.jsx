// src/components/landing/SectionHeader.jsx
import React from "react";

const SectionHeader = ({ isAuthenticated, user }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        {isAuthenticated() ? (
          <>
            Welcome to your sweet journey,{" "}
            <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              {user?.name}!
            </span>
          </>
        ) : (
          <>
            Why Choose{" "}
            <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              MithaiMart?
            </span>
          </>
        )}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {isAuthenticated()
          ? `${
              user?.role === "admin"
                ? "Manage your sweet empire with our comprehensive admin tools"
                : "Browse our premium collection and enjoy exclusive member benefits"
            }`
          : "Experience the authentic taste of India's finest sweets with our premium quality assurance and doorstep delivery"}
      </p>
    </div>
  );
};

export default SectionHeader;
