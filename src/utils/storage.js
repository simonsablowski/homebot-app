// localStorage keys
export const STORAGE_KEYS = {
  PRODUCTS: "homebot.products",
  CONVERSATIONS: "homebot.conversations",
  CURRENT_PRODUCT_ID: "homebot.currentProductId",
};

// Save products to localStorage
export const saveProducts = (products) => {
  if (products.length > 0) {
    // Remove icons before saving (can't serialize JSX)
    const productsToStore = products.map(({ icon, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsToStore));
  } else {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  }
};

// Load products from localStorage
export const loadProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to load products from localStorage:", err);
    return null;
  }
};

// Save conversations to localStorage
export const saveConversations = (conversations) => {
  if (Object.keys(conversations).length > 0) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  }
};

// Load conversations from localStorage
export const loadConversations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to load conversations from localStorage:", err);
    return null;
  }
};

// Save current product ID to localStorage
export const saveCurrentProductId = (productId) => {
  if (productId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRODUCT_ID, productId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PRODUCT_ID);
  }
};

// Load current product ID from localStorage
export const loadCurrentProductId = () => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_PRODUCT_ID);
};

// Restore all data from localStorage
export const restoreFromStorage = (availableProducts) => {
  const storedProducts = loadProducts();
  const storedConversations = loadConversations();
  const storedProductId = loadCurrentProductId();

  let restoredProducts = [];

  if (storedProducts && availableProducts.length > 0) {
    // Reconstruct products with icons from availableProducts
    restoredProducts = storedProducts
      .map((p) => {
        const original = availableProducts.find((ap) => ap.id === p.id);
        if (!original) {
          console.warn(`Could not find product ${p.id} in availableProducts`);
          return null;
        }
        return {
          id: original.id,
          label: original.label,
          icon: original.icon,
        };
      })
      .filter(Boolean);
  }

  return {
    products: restoredProducts,
    conversations: storedConversations || {},
    currentProductId: storedProductId || "",
  };
};
