import React, { useState, createContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import AddProductModal from "./AddProductModal";

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
  availableProducts,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar, isMobile }}>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header
          onToggleSidebar={toggleSidebar}
          onLogoClick={() => setCurrentProductId("")}
          isMobile={isMobile}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            menuItems={menuItems}
            currentProductId={currentProductId}
            onProductSelect={setCurrentProductId}
            onAddProduct={() => setIsModalOpen(true)}
            sidebarOpen={sidebarOpen}
          />

          <ChatArea
            currentProductId={currentProductId}
            messages={messages}
            onSendMessage={sendMessage}
          />
        </div>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          availableProducts={availableProducts}
          existingProducts={menuItems}
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
          onSave={handleSaveProduct}
        />
      </div>
    </LayoutContext.Provider>
  );
}
