import React, { useState, useEffect } from "react";

const UpdateSweet = ({ selectedSweet, onUpdateSweet, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const allowedCategories = [
    "Milk-based",
    "Sugar-based",
    "Fried",
    "Stuffed",
    "Dry Fruits-based",
    "Halwa",
    "Barfi",
    "Ladoo",
  ];

  useEffect(() => {
    if (selectedSweet) {
      setFormData({
        name: selectedSweet.name,
        category: selectedSweet.category,
        price: selectedSweet.price.toString(),
        quantity: selectedSweet.quantity.toString(),
      });
    }
  }, [selectedSweet]);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.quantity
    ) {
      return;
    }

    setLoading(true);
    try {
      await onUpdateSweet(formData);
      onBack();
    } catch (error) {
      // Error handled by parent component
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSweet) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 ">Update Sweet</h2>
        <p className="text-gray-600">
          Select a sweet from the "All Sweets" section to update it.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-800"
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
        <h2 className="text-2xl font-bold text-gray-800">
          Update {selectedSweet.name}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter sweet name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Category</option>
            {allowedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter quantity"
            min="0"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-2 rounded-md transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? "Updating..." : "Update Sweet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSweet;
