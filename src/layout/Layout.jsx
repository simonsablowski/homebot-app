import React, { useState, useEffect, createContext } from "react";
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

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640; // Tailwind's sm breakpoint
      setIsMobile(mobile);

      // On mobile: hide sidebar if products exist and one is selected
      if (mobile && menuItems.length > 0 && currentProductId) {
        setSidebarOpen(false);
      }
      // On mobile: show sidebar if no products or none selected
      else if (mobile && (menuItems.length === 0 || !currentProductId)) {
        setSidebarOpen(true);
      }
      // On desktop: always show sidebar
      else if (!mobile) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [menuItems.length, currentProductId]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Determine if we should show the hamburger menu button
  const showMenuButton = isMobile && menuItems.length > 0;

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar, isMobile }}>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header
          onToggleSidebar={toggleSidebar}
          onLogoClick={() => setCurrentProductId("")}
          isMobile={isMobile}
          showMenuButton={showMenuButton}
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
