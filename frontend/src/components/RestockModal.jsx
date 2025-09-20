import React, { useState, useEffect } from "react";

const RestockModal = ({ isOpen, onClose, selectedSweet, onRestock }) => {
  const [restockQuantity, setRestockQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset quantity when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRestockQuantity("");
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleRestock = async () => {
    if (!restockQuantity || parseInt(restockQuantity) <= 0) return;

    setLoading(true);
    try {
      await onRestock(restockQuantity); // call SweetContext handler
      setRestockQuantity(""); // reset input
      onClose(); // close modal
    } catch (error) {
      console.error("Restock failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRestockQuantity("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 w-full">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Restock Sweet</h3>
            <p className="text-gray-600">{selectedSweet?.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Current Stock Info */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-pink-800 font-semibold">Current Stock</p>
                <p className="text-pink-600 text-2xl font-bold">
                  {selectedSweet?.quantity} units
                </p>
              </div>
            </div>
          </div>

          {/* Restock Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Quantity
            </label>
            <input
              type="number"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter quantity to add"
              min="1"
              autoFocus
            />
          </div>

          {/* New Total Preview */}
          {restockQuantity && parseInt(restockQuantity) > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold">New Total</p>
                  <p className="text-green-600 text-2xl font-bold">
                    {selectedSweet?.quantity + parseInt(restockQuantity)} units
                  </p>
                </div>
              </div>
              <div className="mt-3 text-sm text-green-700">
                Adding {restockQuantity} units to existing{" "}
                {selectedSweet?.quantity} units
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleRestock}
              disabled={
                loading || !restockQuantity || parseInt(restockQuantity) <= 0
              }
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Restocking...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Restock</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockModal;
