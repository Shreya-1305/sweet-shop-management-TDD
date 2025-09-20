import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Navbar from "../components/Navbar";
import SweetCard from "../components/SweetCard";
import CustomerFeedback from "../components/CustomerFeedback";
import SearchFilters from "../components/SearchFilters";

const PurchasePage = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const { token } = useAuth();
  const { showNotification } = useNotification();

  // Fetch sweets from API
  useEffect(() => {
    fetchSweets();
  }, []);

  // Filter sweets based on search criteria
  useEffect(() => {
    let filtered = sweets;

    if (searchTerm) {
      filtered = filtered.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (sweet) => sweet.category === selectedCategory
      );
    }

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((sweet) => {
        const price = sweet.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredSweets(filtered);
  }, [sweets, searchTerm, selectedCategory, priceRange]);

  const fetchSweets = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sweets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sweets");
      }

      const data = await response.json();
      setSweets(data.sweets);
      setFilteredSweets(data.sweets);
    } catch (error) {
      console.error("Error fetching sweets:", error);
      showNotification("Failed to load sweets. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId, quantity) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sweets/${sweetId}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: parseInt(quantity) }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      // Update the sweet in local state
      setSweets((prevSweets) =>
        prevSweets.map((sweet) => (sweet._id === sweetId ? data.sweet : sweet))
      );

      showNotification(`Successfully purchased ${quantity} items!`, "success");
    } catch (error) {
      console.error("Error purchasing sweet:", error);
      showNotification(error.message, "error");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious sweets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Navbar />

      {/* Header Section */}
      <div className="pt-20 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Sweet{" "}
              <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Discover our premium range of authentic Indian sweets, made fresh
              daily with traditional recipes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Filters and Customer Feedback */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Filters */}
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onClearFilters={clearFilters}
            />

            {/* Customer Feedback - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block">
              <CustomerFeedback />
            </div>
          </div>

          {/* Right Side - Sweets Grid */}
          <div className="lg:col-span-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                Available Sweets ({filteredSweets.length})
              </h2>
              <button
                onClick={fetchSweets}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-red-400 text-white rounded-lg hover:from-pink-500 hover:to-red-500 transition-all duration-300 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            {filteredSweets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No sweets found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gradient-to-r from-pink-400 to-red-400 text-white rounded-lg hover:from-pink-500 hover:to-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSweets.map((sweet) => (
                  <SweetCard
                    key={sweet._id}
                    sweet={sweet}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}

            {/* Customer Feedback for mobile - shown below products */}
            <div className="lg:hidden mt-8">
              <CustomerFeedback />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
