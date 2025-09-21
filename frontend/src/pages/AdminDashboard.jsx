import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSweets } from "../context/SweetContext";

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
  } = useSweets();

  // Loader screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Navbar */}
      <Navbar />

      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-pink-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-colors duration-200"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="pt-16 lg:pt-16 flex min-h-screen">
        {/* Sidebar - Mobile Overlay */}
        <div
          className={`
          lg:relative lg:translate-x-0 lg:w-72
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-40 w-80 sm:w-72
          transition-transform duration-300 ease-in-out
        `}
        >
          <div className="h-full bg-white/90 backdrop-blur-md border-r border-pink-200 shadow-xl lg:shadow-none">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              user={user}
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 mt-16 lg:mt-0">
          <div className="h-full overflow-auto">
            <div className="p-3 sm:p-4 lg:p-6 max-w-full">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-6">
                <p className="text-gray-600 mt-1">
                  Welcome back, {user?.name || "Admin"}
                </p>
              </div>

              {/* All Sweets */}
              {activeTab === "all-sweets" && (
                <div className="w-full">
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
                </div>
              )}

              {/* Add Sweet */}
              {activeTab === "add-sweet" && (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-pink-200 p-4 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                      Add New Sweet
                    </h2>
                    <AddSweetForm
                      onSuccess={async (data) => {
                        await handleAddSweet(data);
                        setActiveTab("all-sweets");
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Update Sweet */}
              {activeTab === "update-sweet" && selectedSweet && (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-pink-200 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <button
                        onClick={() => setActiveTab("all-sweets")}
                        className="mr-3 sm:mr-4 text-gray-600 hover:text-gray-800 p-2 hover:bg-pink-100 rounded-lg transition-colors duration-200"
                        aria-label="Go back to all sweets"
                      >
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>
                      <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                          Update Sweet
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                          {selectedSweet.name}
                        </p>
                      </div>
                    </div>
                    <UpdateSweetForm
                      sweet={selectedSweet}
                      onSuccess={async (data) => {
                        await handleUpdateSweet(selectedSweet._id, data);
                        setActiveTab("all-sweets");
                      }}
                      onCancel={() => setActiveTab("all-sweets")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
            setShowDeleteModal(false);
          } catch (error) {
            console.error("Delete failed:", error);
          }
        }}
      />
    </div>
  );
};

export default AdminDashboard;
