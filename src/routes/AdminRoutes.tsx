import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
// import ProtectedRoute from "../components/ProtectedRoute";
import ADMIN_ROUTES from "../constants/routes";
import AdminProtectedRoute from "@/utils/AdminProtectedRoute";

const AdminLoginPage = lazy(() => import("@/pages/Admin/auth/AdminLoginPage"));
const AdminDashboard = lazy(() => import("@/pages/Admin/dashboard-sales/AdminDashboardPage"));
const AdminProductsPage = lazy(
  () => import('@/pages/Admin/product-category/AdminProductsPage')
);
const AdminAddProduct = lazy(() => import("@/pages/Admin/product-category/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("@/pages/Admin/product-category/AdminEditProduct"));
const AdminCategoryPage = lazy(
  () => import("../pages/Admin/product-category/AdminCategoryPage")
);
const AdminUserManagement = lazy(
  () => import("@/pages/Admin/managements/AdminUserManagement")
);
const AdminOrderMangement = lazy(
  () => import("@/pages/Admin/managements/AdminOrderManagement")
);
const CouponManagement = lazy(
  () => import("@/pages/Admin/managements/AdminCouponManagementPage")
);
const OfferManagement = lazy(() => import("@/pages/Admin/managements/AdminOfferPage"));
const AdminSalesReport = lazy(() => import("@/pages/Admin/dashboard-sales/AdminSalesReport"));

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route index element={<AdminLoginPage />} />
    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ADMIN_ROUTES.PRODUCTS}>
          <Route index element={<AdminProductsPage />} />
          <Route path="add" element={<AdminAddProduct />} />
          <Route path=":id" element={<AdminEditProduct />} />
        </Route>
        <Route path={ADMIN_ROUTES.CATEGORIES} element={<AdminCategoryPage />} />
        <Route
          path={ADMIN_ROUTES.CUSTOMERS}
          element={<AdminUserManagement />}
        />
        <Route path={ADMIN_ROUTES.ORDERS} element={<AdminOrderMangement />} />
        <Route path={ADMIN_ROUTES.COUPON} element={<CouponManagement />} />
        <Route path={ADMIN_ROUTES.OFFER} element={<OfferManagement />} />
        <Route
          path={ADMIN_ROUTES.SALES_REPORT}
          element={<AdminSalesReport />}
        />
      </Route>
    </Route>
  </Routes>
);

export default AdminRoutes;
