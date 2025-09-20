import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import AllSweetsTable from "../components/AllSweetsTable";
import AddSweetForm from "../components/AddSweetForm";
import UpdateSweetForm from "../components/UpdateSweetForm";
import RestockModal from "../components/RestockModal";
import DeleteModal from "../components/DeleteModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-sweets");
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useAuth();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    const filtered = sweets.filter((sweet) =>
      sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSweets(filtered);
  }, [sweets, searchTerm]);

  const fetchSweets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/sweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch sweets");
      const data = await response.json();
      setSweets(data.sweets || []);
      setFilteredSweets(data.sweets || []);
    } catch (error) {
      console.error("Error fetching sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (quantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/sweets/${selectedSweet._id}/restock`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: parseInt(quantity) }),
        }
      );

      if (!response.ok) throw new Error("Restock failed");
      const data = await response.json();

      setSweets((prevSweets) =>
        prevSweets.map((sweet) =>
          sweet._id === selectedSweet._id ? data.sweet : sweet
        )
      );

      setShowRestockModal(false);
      setSelectedSweet(null);
    } catch (error) {
      console.error("Restock failed:", error);
    }
  };

  const handleDeleteSweet = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/sweets/${selectedSweet._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete sweet");

      setSweets(sweets.filter((sweet) => sweet._id !== selectedSweet._id));
      setShowDeleteModal(false);
      setSelectedSweet(null);
    } catch (error) {
      console.error("Failed to delete sweet:", error);
    }
  };

  const handleAddSweet = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/sweets`, {
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

      fetchSweets();
      setActiveTab("all-sweets");
    } catch (error) {
      console.error("Failed to add sweet:", error);
      throw error;
    }
  };

  const handleUpdateSweet = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/sweets/${selectedSweet._id}`,
        {
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
        }
      );

      if (!response.ok) throw new Error("Failed to update sweet");

      fetchSweets();
      setActiveTab("all-sweets");
      setSelectedSweet(null);
    } catch (error) {
      console.error("Failed to update sweet:", error);
      throw error;
    }
  };

  const openRestockModal = (sweet) => {
    setSelectedSweet(sweet);
    setShowRestockModal(true);
  };

  const openDeleteModal = (sweet) => {
    setSelectedSweet(sweet);
    setShowDeleteModal(true);
  };

  const openUpdateModal = (sweet) => {
    setSelectedSweet(sweet);
    setActiveTab("update-sweet");
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 w-full">
      <Navbar />

      <div
        className="pt-16 flex h-screen w-500
      "
      >
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          user={user}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto w-full">
          <div className="p-6 w-full max-w-none ">
            {activeTab === "all-sweets" && (
              <AllSweetsTable
                sweets={filteredSweets}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onRefresh={fetchSweets}
                onRestock={openRestockModal}
                onUpdate={openUpdateModal}
                onDelete={openDeleteModal}
              />
            )}

            {activeTab === "add-sweet" && (
              <div className="w-full">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 p-8 w-full">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Add New Sweet
                  </h2>
                  <AddSweetForm onSuccess={handleAddSweet} />
                </div>
              </div>
            )}

            {activeTab === "update-sweet" && (
              <div className="w-full">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 p-8 w-full">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setActiveTab("all-sweets")}
                      className="mr-4 text-gray-600 hover:text-gray-800 p-2 hover:bg-pink-100 rounded-lg transition-colors duration-200"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Update {selectedSweet?.name || "Sweet"}
                    </h2>
                  </div>
                  {selectedSweet && (
                    <UpdateSweetForm
                      sweet={selectedSweet}
                      onSuccess={handleUpdateSweet}
                      onCancel={() => setActiveTab("all-sweets")}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RestockModal
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        selectedSweet={selectedSweet}
        onRestock={handleRestock}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedSweet={selectedSweet}
        onDelete={handleDeleteSweet}
      />
    </div>
  );
};

export default AdminDashboard;
