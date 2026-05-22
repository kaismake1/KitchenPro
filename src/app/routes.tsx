import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { ShipperDashboard } from "./pages/ShipperDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { ManageProducts } from "./pages/admin/ManageProducts";
import { ManageOrders } from "./pages/admin/ManageOrders";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "order-success", Component: OrderSuccessPage },
      { path: "orders", Component: OrderHistoryPage },
    ],
  },
  {
    path: "/shipper",
    Component: RootLayout,
    children: [{ index: true, Component: ShipperDashboard }],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: ManageUsers },
      { path: "products", Component: ManageProducts },
      { path: "orders", Component: ManageOrders },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
