// src/pages/LandingPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { useAuth } from "../context/AuthContext";
import SectionHeader from "../components/landing/SectionHeader";
import FeatureCard from "../components/landing/FeatureCard";
import OfferBanner from "../components/landing/OfferBanner";

const features = [
  {
    icon: "🍯",
    title: "50+ Varieties",
    description:
      "From traditional Gulab Jamun to exotic Kesar Pista Barfi, explore our vast collection of authentic Indian sweets",
    gradient: "from-pink-500 to-red-500",
    border: "border-pink-100",
  },
  {
    icon: "🌿",
    title: "100% Fresh",
    description:
      "Made fresh daily using the finest ingredients and traditional recipes. No preservatives, just pure taste",
    gradient: "from-orange-500 to-red-500",
    border: "border-orange-100",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    description:
      "Same-day delivery within city limits. Your sweet cravings delivered fresh to your doorstep in hours",
    gradient: "from-green-500 to-teal-500",
    border: "border-green-100",
  },
  {
    icon: "⭐",
    title: "Premium Quality",
    description:
      "Handcrafted by master sweet makers using time-honored techniques and the finest quality ingredients",
    gradient: "from-purple-500 to-pink-500",
    border: "border-purple-100",
  },
];

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <section className="py-16 bg-gradient-to-b from-orange-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeader isAuthenticated={isAuthenticated} user={user} />

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Special Offer Banner */}
          <OfferBanner isAuthenticated={isAuthenticated} user={user} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
