import React from "react";

// Fixed AdminSidebar Component
const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  user,
}) => {
  const sidebarItems = [
    { id: "all-sweets", label: "All Sweets", icon: "📋" },
    { id: "add-sweet", label: "Add Sweet", icon: "➕" },
  ];

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-colors duration-200"
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

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 fixed lg:relative z-40 w-64 h-full bg-white/80 backdrop-blur-md shadow-xl border-r border-pink-200`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Admin Panel</h3>
              <p className="text-sm text-gray-500">
                Welcome, {user?.name || "Admin"}
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-pink-100 hover:scale-105"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl border border-pink-200">
            <h4 className="text-sm font-semibold text-pink-800 mb-2">
              Quick Stats
            </h4>
            <div className="space-y-2 text-sm text-pink-700">
              <div className="flex justify-between">
                <span>Categories:</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
