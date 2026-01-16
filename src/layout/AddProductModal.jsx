import React from "react";
import { ChevronDown } from "lucide-react";

export default function AddProductModal({
  isOpen,
  onClose,
  availableProducts,
  existingProducts,
  selectedProductId,
  onProductSelect,
  onSave,
}) {
  if (!isOpen) return null;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white rounded p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Add product</h2>

        {/*<label className="block mb-3 text-sm font-medium">Choose product</label>*/}

        <div className="relative mb-4">
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={selectedProductId}
            onChange={(e) => onProductSelect(e.target.value)}
          >
            <option value="">Select a product</option>
            {(availableProducts || [])
              .filter((p) => !existingProducts.find((existing) => existing.id === p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {capitalize(p.label)}
                </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>

        {/*<button
          disabled
          className="w-full px-4 py-2 bg-gray-400 text-white rounded mb-4 cursor-not-allowed"
        >
          Upload manual
        </button>*/}

        <div className="flex justify-center gap-4 mt-2">
          <button onClick={onClose} className="w-32 px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            disabled={!selectedProductId}
            onClick={onSave}
            className="w-32 px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
