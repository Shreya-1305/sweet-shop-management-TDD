// context/SweetContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";

const SweetContext = createContext();

export const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(false); // Start as false, only set to true when actually fetching
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();

  const [selectedSweet, setSelectedSweet] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /** ---------------------------
   * Fetch all sweets
   * --------------------------- */
  const fetchSweets = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated() || !token) {
      setSweets([]);
      setFilteredSweets([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/sweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          console.warn("Unauthorized access - user may need to log in again");
          return;
        }
        throw new Error("Failed to fetch sweets");
      }

      const data = await response.json();
      setSweets(data.sweets || []);
      setFilteredSweets(data.sweets || []);
    } catch (error) {
      console.error("Error fetching sweets:", error);
      // Only show notification if user is authenticated (to avoid spam on login page)
      if (isAuthenticated()) {
        showNotification("Failed to load sweets. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Only fetch sweets when user is authenticated and auth loading is complete
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Only fetch if user is authenticated
    if (isAuthenticated() && token) {
      fetchSweets();
    } else {
      // Clear data if user is not authenticated
      setSweets([]);
      setFilteredSweets([]);
      setLoading(false);
    }
  }, [token, authLoading]); // Re-run when token changes or auth loading completes

  /** ---------------------------
   * Filtering logic
   * --------------------------- */
  useEffect(() => {
    const timeout = setTimeout(() => {
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
        const min = parseFloat(priceRange.min) || 0;
        const max = parseFloat(priceRange.max) || Infinity;
        filtered = filtered.filter(
          (sweet) => sweet.price >= min && sweet.price <= max
        );
      }

      setFilteredSweets(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [sweets, searchTerm, selectedCategory, priceRange]);

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

      setSweets((prev) =>
        prev.map((sweet) => (sweet._id === sweetId ? data.sweet : sweet))
      );
      setFilteredSweets((prev) =>
        prev.map((sweet) => (sweet._id === sweetId ? data.sweet : sweet))
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
        prev.map((sweet) => (sweet._id === sweetId ? data.sweet : sweet))
      );
      setFilteredSweets((prev) =>
        prev.map((sweet) => (sweet._id === sweetId ? data.sweet : sweet))
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete sweet");

      setSweets((prev) => prev.filter((sweet) => sweet._id !== sweetId));
      setFilteredSweets((prev) =>
        prev.filter((sweet) => sweet._id !== sweetId)
      );

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
