import React from "react";

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  onClearFilters,
}) => {
  const categories = [
    "Traditional",
    "Dry Fruits",
    "Milk Based",
    "Syrup Based",
    "Festival Special",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-md transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search sweets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-pink-100 rounded-lg text-sm placeholder-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200 focus:border-pink-200 bg-pink-25"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-pink-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-200 focus:border-pink-200 bg-pink-25"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-full px-3 py-2 border border-pink-100 rounded-lg text-sm placeholder-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200 focus:border-pink-200 bg-pink-25"
          />
          <input
            type="number"
            placeholder="Max price"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-full px-3 py-2 border border-pink-100 rounded-lg text-sm placeholder-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200 focus:border-pink-200 bg-pink-25"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Quick Filters
        </label>
        <div className="space-y-2">
          <button
            onClick={() => setPriceRange({ min: "", max: "100" })}
            className="w-full text-left px-3 py-2 text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors"
          >
            Under ₹100
          </button>
          <button
            onClick={() => setPriceRange({ min: "100", max: "300" })}
            className="w-full text-left px-3 py-2 text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors"
          >
            ₹100 - ₹300
          </button>
          <button
            onClick={() => setPriceRange({ min: "300", max: "" })}
            className="w-full text-left px-3 py-2 text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors"
          >
            Above ₹300
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
