/**
 * Storage Manager - Minimal Token-Only Storage Utility
 *
 * NOTE: This file now contains only token hydration utilities.
 *
 * All other data (cart, user info, orders) are fetched from the backend API.
 * - Cart: Stored in-memory during session, persisted via checkout POST
 * - User info: Fetched from /auth/me endpoint on app load
 * - Orders: Fetched from /checkout/user/history endpoint
 * - Users (admin): Fetched from /admin/users endpoint
 *
 * localStorage is used ONLY for:
 * - access_token: For hydration after page refresh (managed by AuthContext)
 *
 * IMPORTANT: The token is treated as a security token, not user data.
 * It should never contain sensitive information and is validated
 * with the backend on every page load.
 */

// ==================== TOKEN STORAGE (Hydration Only) ====================
export const TokenStorage = {
  /**
   * Save JWT token for hydration on page refresh
   * @param token JWT access token from backend
   */
  saveToken: (token: string) => {
    try {
      localStorage.setItem("access_token", token);
      console.log("[Storage] Access token saved for session hydration");
    } catch (error) {
      console.error("[Storage] Failed to save token:", error);
    }
  },

  /**
   * Load JWT token for hydration
   * @returns JWT token or null if not found
   */
  loadToken: (): string | null => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        console.log("[Storage] Access token loaded from storage");
        return token;
      }
      return null;
    } catch (error) {
      console.error("[Storage] Failed to load token:", error);
      return null;
    }
  },

  /**
   * Clear JWT token on logout
   */
  clearToken: () => {
    try {
      localStorage.removeItem("access_token");
      console.log("[Storage] Access token cleared");
    } catch (error) {
      console.error("[Storage] Failed to clear token:", error);
    }
  },
};

/**
 * DEPRECATED: The following exports are kept for backward compatibility
 * but should NOT be used in new code. Use the backend API directly instead.
 */

export const UserStorage = {
  saveCurrentUser: (user: any) => {
    console.warn(
      "[DEPRECATED] UserStorage.saveCurrentUser - Use backend API instead",
    );
  },
  loadCurrentUser: () => {
    console.warn(
      "[DEPRECATED] UserStorage.loadCurrentUser - Use backend API instead",
    );
    return null;
  },
  removeCurrentUser: () => {
    console.warn(
      "[DEPRECATED] UserStorage.removeCurrentUser - Use backend API instead",
    );
  },
  saveUsersList: (users: any[]) => {
    console.warn(
      "[DEPRECATED] UserStorage.saveUsersList - Use backend API instead",
    );
  },
  loadUsersList: () => {
    console.warn(
      "[DEPRECATED] UserStorage.loadUsersList - Use backend API instead",
    );
    return [];
  },
};

export const CartStorage = {
  saveCart: (userId: string, cart: any[]) => {
    console.warn(
      "[DEPRECATED] CartStorage.saveCart - Cart is now in-memory only",
    );
  },
  loadCart: (userId: string) => {
    console.warn(
      "[DEPRECATED] CartStorage.loadCart - Cart is now in-memory only",
    );
    return [];
  },
  removeCart: (userId: string) => {
    console.warn(
      "[DEPRECATED] CartStorage.removeCart - Cart is now in-memory only",
    );
  },
};

// ==================== ORDERS STORAGE ====================
export const OrdersStorage = {
  // Lưu đơn hàng cho user
  saveOrders: (userId: string, orders: any[]) => {
    try {
      const key = `orders-${userId}`;
      localStorage.setItem(key, JSON.stringify(orders));
      console.log(
        `[Storage] Orders for user ${userId} saved:`,
        orders.length,
        "orders",
      );
    } catch (error) {
      console.error("[Storage] Failed to save orders:", error);
    }
  },

  // Tải đơn hàng
  loadOrders: (userId: string) => {
    try {
      const key = `orders-${userId}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("[Storage] Failed to parse orders:", error);
      return [];
    }
  },

  // Xóa tất cả đơn hàng (nếu cần)
  removeOrders: (userId: string) => {
    const key = `orders-${userId}`;
    localStorage.removeItem(key);
    console.log(`[Storage] Orders for user ${userId} cleared`);
  },
};

// ==================== UTILITY HELPERS ====================
export const StorageHelper = {
  // Xem tất cả dữ liệu trong localStorage (dùng để debug)
  getAllData: () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  },

  // Clear tất cả (dùng cho reset app)
  clearAll: () => {
    localStorage.clear();
    console.log("[Storage] All data cleared");
  },

  // Clear data cho một user (khi xóa tài khoản)
  clearUserData: (userId: string) => {
    CartStorage.removeCart(userId);
    OrdersStorage.removeOrders(userId);
    console.log(`[Storage] All data for user ${userId} cleared`);
  },
};
