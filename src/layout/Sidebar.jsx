import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

export default function Sidebar({
  menuItems,
  currentProductId,
  onProductSelect,
  onAddProduct,
  sidebarOpen
}) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const MenuItem = ({ item, depth = 0 }) => {
    const isActive = currentProductId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];

    return (
      <div>
        <button
          onClick={() => {
            onProductSelect(item.id);
            if (hasChildren) toggleExpanded(item.id);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 rounded ${
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } ${depth > 0 ? "pl-8" : ""}`}
        >
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          {sidebarOpen && <span className="flex-1 text-left">{capitalize(item.label)}</span>}
          {sidebarOpen && hasChildren && (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>

        {hasChildren && isExpanded && sidebarOpen && (
          <div className="mt-1">
            {item.children.map((child) => (
              <MenuItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`w-64 bg-gray-800 flex flex-col h-full transition-all duration-300 ${
        sidebarOpen ? "block" : "hidden sm:block"
      }`}
    >
      <nav className="flex-1 overflow-y-auto px-6 pt-4">
        {menuItems.map((item) => (
          <div key={item.id} className="py-2 rounded-lg transition-all duration-200">
            <MenuItem item={item} />
          </div>
        ))}

        {/* Add Product Button */}
        <div className="py-2">
          <button
            className="w-full text-sm text-white bg-cyan-600 hover:bg-cyan-700 rounded transition-colors flex items-center gap-2 px-3 py-2"
            onClick={onAddProduct}
          >
            <Plus size={16} />
            <span>Add product</span>
          </button>
        </div>
      </nav>
      <div className="p-4"></div>
    </aside>
  );
}
