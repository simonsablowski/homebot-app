import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Layout from "./Layout";

export default function App() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState("");
  const [manuals, setManuals] = useState({});
  const [conversations, setConversations] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const messages = currentProductId ? conversations[currentProductId] || [] : [];

  // Load available products from JSON
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/products.json");
        const data = await res.json();

        const mappedProducts = data.map((p) => ({
          ...p,
          // Dynamically create React element for icon
          icon: LucideIcons[p.icon]
            ? React.createElement(LucideIcons[p.icon], { size: 18 })
            : null,
        }));

        setAvailableProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    loadProducts();
  }, []);

  // Load manual whenever the current product changes
  useEffect(() => {
    if (!currentProductId) return; // skip if no product selected

    const loadManual = async () => {
      if (manuals[currentProductId] !== undefined) return; // Already attempted

      try {
        const res = await fetch(`/manuals/${currentProductId}.json`);
        if (!res.ok) throw new Error("Manual not found");
        const data = await res.json();
        setManuals((prev) => ({ ...prev, [currentProductId]: data }));
      } catch (err) {
        console.error("Failed to load manual:", err);
        setManuals((prev) => ({ ...prev, [currentProductId]: null }));
      }
    };

    loadManual();
  }, [currentProductId]); // depend only on currentProductId

  const handleProductAdd = (product) => {
    if (!product || products.find((p) => p.id === product.id)) return;

    setProducts((prev) => [...prev, product]);
    setConversations((prev) => ({
      ...prev,
      [product.id]: [
        { role: "assistant", content: `Hello! Ask me anything about your ${product.label}.` },
      ],
    }));

    setCurrentProductId(product.id);
  };

  const handleSaveProduct = () => {
    const product = availableProducts.find((p) => p.id === selectedProductId);
    handleProductAdd(product);
    setSelectedProductId("");
    setIsModalOpen(false);
  };

  const sendMessage = (text, productId) => {
    const id = productId || currentProductId;
    if (!text.trim() || !id) return;

    const currentProductLabel = products.find((p) => p.id === id)?.label || "product";
    const manualData = manuals[id];

    let assistantReply = `Sorry, I don't have any information about your ${currentProductLabel} yet.`;

    if (manualData?.entries?.length > 0) {
      const lowerText = text.toLowerCase();
      const matchedEntry = manualData.entries.find((entry) =>
        entry.keyword.toLowerCase().split("-").some((part) => lowerText.includes(part))
      );

      assistantReply = matchedEntry
        ? `${matchedEntry.content}`
        : "I don't have any information about this.";
    }

    setConversations((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        { role: "user", content: text },
        { role: "assistant", content: assistantReply },
      ],
    }));
  };

  const menuItems = products.map((p) => ({ id: p.id, label: p.label, icon: p.icon }));

  return (
    <Layout
      menuItems={menuItems}
      currentProductId={currentProductId}
      setCurrentProductId={setCurrentProductId}
      messages={messages}
      sendMessage={sendMessage}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      selectedProductId={selectedProductId}
      setSelectedProductId={setSelectedProductId}
      handleSaveProduct={handleSaveProduct}
      availableProducts={availableProducts} // pass down for modal dropdown
    />
  );
}
