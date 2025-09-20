import React, { useState } from "react";

const SweetCard = ({ sweet, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const isOutOfStock = sweet.quantity === 0;
  const maxQuantity = Math.min(sweet.quantity, 10);

  const handlePurchase = async () => {
    if (quantity > sweet.quantity) return;

    setLoading(true);
    try {
      await onPurchase(sweet._id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-pink-50 overflow-hidden">
      {/* Header with name and stock status */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-sm truncate flex-1 mr-2">
            {sweet.name}
          </h3>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              isOutOfStock
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {isOutOfStock ? "Out" : "In Stock"}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-pink-600">
            ₹{sweet.price}
          </span>
          <span className="text-xs text-gray-500 bg-pink-50 px-2 py-1 rounded-full">
            {sweet.category}
          </span>
        </div>

        {/* Stock indicator */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>Stock: {sweet.quantity}</span>
          <div className="flex-1 mx-2 bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${
                sweet.quantity === 0
                  ? "bg-red-400"
                  : sweet.quantity <= 5
                  ? "bg-yellow-400"
                  : "bg-green-400"
              }`}
              style={{
                width: `${Math.min((sweet.quantity / 20) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Purchase section */}
      {!isOutOfStock && (
        <div className="px-4 pb-4">
          {/* Quantity and total */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition-colors text-sm"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center border border-pink-100 rounded-md py-1 text-xs focus:outline-none focus:ring-1 focus:ring-pink-200"
              />
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="w-6 h-6 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition-colors text-sm"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              ₹{(sweet.price * quantity).toFixed(2)}
            </span>
          </div>

          {/* Purchase button */}
          <button
            onClick={handlePurchase}
            disabled={loading || quantity > sweet.quantity}
            className={`w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              "Purchase"
            )}
          </button>

          {/* Low stock warning */}
          {sweet.quantity <= 5 && (
            <p className="text-xs text-yellow-600 text-center mt-2 bg-yellow-50 py-1 rounded">
              Only {sweet.quantity} left!
            </p>
          )}
        </div>
      )}

      {/* Out of stock message */}
      {isOutOfStock && (
        <div className="px-4 pb-4">
          <button
            disabled
            className="w-full py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        </div>
      )}
    </div>
  );
};

export default SweetCard;
