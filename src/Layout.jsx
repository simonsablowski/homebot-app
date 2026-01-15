import React, { useState, useRef, useEffect, createContext } from "react";
import { ChevronDown, ChevronRight, Plus, User, Cpu, Package } from "lucide-react";

// Layout context
export const LayoutContext = createContext({
  sidebarOpen: true,
  toggleSidebar: () => {},
  isMobile: false,
});

export default function Layout({
  menuItems,
  currentProductId,
  setCurrentProductId,
  messages,
  sendMessage,
  isModalOpen,
  setIsModalOpen,
  selectedProductId,
  setSelectedProductId,
  handleSaveProduct,
  availableProducts, // <-- now passed from App.jsx
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
            setCurrentProductId(item.id);
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
          {sidebarOpen && hasChildren && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
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
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar, isMobile }}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-cyan-600 border-b border-cyan-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="text-white sm:hidden" onClick={toggleSidebar}>
              <ChevronDown size={20} />
            </button>
            <h1
              className="text-xl font-semibold text-white cursor-pointer"
              title="Go home"
              onClick={() => setCurrentProductId("")}
            >
              homebot
            </h1>
          </div>
          <button
            className="text-sm text-gray-300 opacity-50 cursor-not-allowed transition-colors"
            title="Settings coming soon"
          >
            Settings
          </button>
        </header>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
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
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={16} />
                  <span>Add product</span>
                </button>
              </div>
            </nav>
            <div className="p-4"></div>
          </aside>

          {/* Chat area */}
          <main className="flex-1 overflow-y-auto bg-gray-900 p-6 flex flex-col h-full">
            <div className="flex-1 mb-6 space-y-4 overflow-y-auto overflow-x-hidden">
              {currentProductId ? (
                messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 p-4 shadow-sm border rounded ${
                        isUser ? "bg-gray-300 border-gray-400" : "bg-white border-gray-400"
                      }`}
                    >
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-600 rounded-full">
                        {isUser ? <User size={12} className="text-white" /> : <Cpu size={12} className="text-white" />}
                      </div>
                      <span className="text-gray-700 whitespace-pre-wrap break-words">{msg.content}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-start pt-4 text-center">
                  <Package size={32} className="text-gray-500 opacity-50 mb-4" />
                  <p className="text-lg text-gray-400 mb-2">Select or add a product</p>
                  <p className="text-sm text-gray-500">Choose a product from the sidebar or add a new one</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            {currentProductId && (
              <div className="pt-4">
                <input
                  type="text"
                  placeholder="Type your question… (press Enter to send)"
                  className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage(e.target.value, currentProductId);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </main>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white rounded p-6 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Add product</h2>

              <label className="block mb-3 text-sm font-medium">Choose product</label>
              <div className="relative mb-4">
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">Select a product</option>
                  {availableProducts
                    .filter((p) => !menuItems.find((existing) => existing.id === p.id))
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

              <button
                disabled
                className="w-full px-4 py-2 bg-gray-400 text-white rounded mb-4 cursor-not-allowed"
              >
                Upload manual
              </button>

              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-32 px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedProductId}
                  onClick={handleSaveProduct}
                  className="w-32 px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutContext.Provider>
  );
}
