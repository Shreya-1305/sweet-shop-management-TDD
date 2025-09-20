import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSweets } from "../context/SweetContext"; // ✅ updated import

// Components
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import AllSweetsTable from "../components/AllSweetsTable";
import AddSweetForm from "../components/AddSweetForm";
import UpdateSweetForm from "../components/UpdateSweetForm";
import RestockModal from "../components/RestockModal";
import DeleteModal from "../components/DeleteModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("all-sweets");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useAuth();
  const {
    filteredSweets,
    loading,
    searchTerm,
    setSearchTerm,
    selectedSweet,
    setSelectedSweet,
    fetchSweets,
    handleAddSweet,
    handleUpdateSweet,
    handleDeleteSweet,
    handleRestock,
  } = useSweets(); // ✅ now using SweetContext

  // Loader screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 w-full">
      {/* Navbar */}
      <Navbar />

      <div className="pt-16 flex h-screen w-full">
        {/* Sidebar */}
        <div className="w-72 bg-white/80 backdrop-blur-md border-r border-gray-200">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* All Sweets */}
          {activeTab === "all-sweets" && (
            <AllSweetsTable
              sweets={filteredSweets}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onRefresh={fetchSweets}
              onRestock={(sweet) => {
                setSelectedSweet(sweet);
                setShowRestockModal(true);
              }}
              onUpdate={(sweet) => {
                setSelectedSweet(sweet);
                setActiveTab("update-sweet");
                setIsSidebarOpen(false);
              }}
              onDelete={(sweet) => {
                setSelectedSweet(sweet);
                setShowDeleteModal(true);
              }}
            />
          )}

          {/* Add Sweet */}
          {activeTab === "add-sweet" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 p-8 w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Add New Sweet
              </h2>
              <AddSweetForm
                onSuccess={async (data) => {
                  await handleAddSweet(data);
                  setActiveTab("all-sweets");
                }}
              />
            </div>
          )}

          {/* Update Sweet */}
          {activeTab === "update-sweet" && selectedSweet && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 p-8 w-full">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setActiveTab("all-sweets")}
                  className="mr-4 text-gray-600 hover:text-gray-800 p-2 hover:bg-pink-100 rounded-lg transition-colors duration-200"
                >
                  ←
                </button>
                <h2 className="text-3xl font-bold text-gray-800">
                  Update {selectedSweet.name}
                </h2>
              </div>
              <UpdateSweetForm
                sweet={selectedSweet}
                onSuccess={async (data) => {
                  await handleUpdateSweet(selectedSweet._id, data); // ✅ fixed
                  setActiveTab("all-sweets");
                }}
                onCancel={() => setActiveTab("all-sweets")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RestockModal
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        selectedSweet={selectedSweet}
        onRestock={(quantity) => handleRestock(selectedSweet._id, quantity)}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedSweet={selectedSweet}
        onDelete={async (id) => {
          try {
            await handleDeleteSweet(id);
            setShowDeleteModal(false); // close modal after deletion
          } catch (error) {
            console.error("Delete failed:", error);
          }
        }}
      />
    </div>
  );
};

export default AdminDashboard;
