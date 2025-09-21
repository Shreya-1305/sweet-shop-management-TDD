// context/SweetContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";

const SweetContext = createContext();

export const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]); // all sweets
  const [filteredSweets, setFilteredSweets] = useState([]); // filtered by backend
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedSweet, setSelectedSweet] = useState(null);

  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /** ---------------------------
   * Fetch all sweets (initial load)
   * --------------------------- */
  const fetchSweets = async () => {
    if (!isAuthenticated() || !token) {
      setSweets([]);
      setFilteredSweets([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/sweets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch sweets");

      setSweets(data.sweets || []);
      setFilteredSweets(data.sweets || []);
    } catch (error) {
      console.error("Error fetching sweets:", error);
      if (isAuthenticated()) showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /** ---------------------------
   * Backend search & filter
   * --------------------------- */
  const fetchFilteredSweets = async () => {
    if (!isAuthenticated() || !token) return;

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (priceRange.min) params.append("minPrice", priceRange.min);
      if (priceRange.max) params.append("maxPrice", priceRange.max);

      setLoading(true);
      const response = await fetch(`${API_URL}/api/sweets/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Search failed");

      setFilteredSweets(data.sweets || []);
    } catch (error) {
      console.error("Error searching sweets:", error);
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Debounce backend search whenever search/filter changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchFilteredSweets();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory, priceRange]);

  // Fetch all sweets once when auth is ready
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated() && token) {
      fetchSweets();
    } else {
      setSweets([]);
      setFilteredSweets([]);
      setLoading(false);
    }
  }, [token, authLoading]);

  /** ---------------------------
   * Customer: Purchase
   * --------------------------- */
  const handlePurchase = async (sweetId, quantity) => {
    if (!isAuthenticated()) {
      showNotification("Please log in to make a purchase", "error");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/sweets/${sweetId}/purchase`,
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
      if (!response.ok) throw new Error(data.message || "Purchase failed");

      // Update locally
      setSweets((prev) =>
        prev.map((s) => (s._id === sweetId ? data.sweet : s))
      );
      setFilteredSweets((prev) =>
        prev.map((s) => (s._id === sweetId ? data.sweet : s))
      );
      showNotification(
        `Successfully purchased ${quantity} item(s)!`,
        "success"
      );
    } catch (error) {
      console.error("Error purchasing sweet:", error);
      showNotification(error.message, "error");
    }
  };

  /** ---------------------------
   * Admin: Add Sweet
   * --------------------------- */
  const handleAddSweet = async (formData) => {
    if (!isAuthenticated()) {
      showNotification("Please log in to add sweets", "error");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/sweets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        }),
      });
      if (!response.ok) throw new Error("Failed to add sweet");

      await fetchSweets();
      showNotification("Sweet added successfully!", "success");
    } catch (error) {
      console.error("Failed to add sweet:", error);
      showNotification(error.message, "error");
    }
  };

  /** ---------------------------
   * Admin: Update Sweet
   * --------------------------- */
  const handleUpdateSweet = async (sweetId, formData) => {
    if (!isAuthenticated()) {
      showNotification("Please log in to update sweets", "error");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/sweets/${sweetId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        }),
      });
      if (!response.ok) throw new Error("Failed to update sweet");

      await fetchSweets();
      showNotification("Sweet updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update sweet:", error);
      showNotification(error.message, "error");
    }
  };

  /** ---------------------------
   * Admin: Restock Sweet
   * --------------------------- */
  const handleRestock = async (sweetId, quantity) => {
    if (!isAuthenticated()) {
      showNotification("Please log in to restock sweets", "error");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/sweets/${sweetId}/restock`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Restock failed");

      setSweets((prev) =>
        prev.map((s) => (s._id === sweetId ? data.sweet : s))
      );
      setFilteredSweets((prev) =>
        prev.map((s) => (s._id === sweetId ? data.sweet : s))
      );
      showNotification("Sweet restocked successfully!", "success");
    } catch (error) {
      console.error("Restock failed:", error);
      showNotification(error.message, "error");
    }
  };

  /** ---------------------------
   * Admin: Delete Sweet
   * --------------------------- */
  const handleDeleteSweet = async (sweetId) => {
    if (!isAuthenticated()) {
      showNotification("Please log in to delete sweets", "error");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/sweets/${sweetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete sweet");

      setSweets((prev) => prev.filter((s) => s._id !== sweetId));
      setFilteredSweets((prev) => prev.filter((s) => s._id !== sweetId));
      showNotification("Sweet deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete sweet:", error);
      showNotification(error.message, "error");
    }
  };

  /** ---------------------------
   * Utility
   * --------------------------- */
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
  };

  return (
    <SweetContext.Provider
      value={{
        sweets,
        filteredSweets,
        loading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        selectedSweet,
        setSelectedSweet,
        fetchSweets,
        clearFilters,
        handlePurchase,
        handleAddSweet,
        handleUpdateSweet,
        handleRestock,
        handleDeleteSweet,
      }}
    >
      {children}
    </SweetContext.Provider>
  );
};

export const useSweets = () => useContext(SweetContext);
