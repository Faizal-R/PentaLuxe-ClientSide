import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import UserProtectedRoutes from "@/utils/UserProtectedRoutes";
import ForgotPasswordEmail from "@/pages/User/auth/ForgotPasswordEmail";
import ForgotOtpPage from "@/pages/User/auth/ForgotOtpPage";
import ResetPassword from "@/pages/User/auth/ResetPassword";

// import OrderSuccessPage from "@/pages/User/OrderSuccessPage";

// import Address from "../pages/User/Address";

const HomePage = lazy(() => import("@/pages/User/base/HomePage"));
const MainLayout = lazy(() => import("@/layout/MainLayout"));

const AboutPage = lazy(() => import("../../pages/User/base/AboutPage"));
const AllProductsPage = lazy(
  () => import("@/pages/User/product-category/AllProductsPage"),
);
const ProductDetailPage = lazy(
  () => import("@/pages/User/product-category/ProductDetailPage"),
);
const CategoryPage = lazy(
  () => import("@/pages/User/product-category/CategoryPage"),
);
const LoginPage = lazy(() => import("@/pages/User/auth/LoginPage"));
const SignupPage = lazy(() => import("@/pages/User/auth/SignupPage"));
const OtpVerifyPage = lazy(() => import("@/pages/User/auth/OtpVerifyPage"));
const UserProfileLayout = lazy(() => import("@/layout/UserProfileLayout"));
const Profile = lazy(() => import("@/pages/User/profile/Profile"));
const Address = lazy(() => import("@/pages/User/profile/Address"));
const AddAndEditAddress = lazy(
  () => import("@/pages/User/profile/AddAndEditAddress"),
);
const CheckOutPage = lazy(
  () => import("../../pages/User/cart-checkout/CheckOutPage"),
);
const OrderPage = lazy(() => import("@/pages/User/order/OrdersPage"));
const OrderSuccessPage = lazy(
  () => import("@/pages/User/order/OrderSuccessPage"),
);
const CartPage = lazy(() => import("@/pages/User/cart-checkout/CartPage"));
const OrderDetailsPage = lazy(
  () => import("@/pages/User/order/OrderDetailsPage"),
);
const WalletPage = lazy(() => import("@/pages/User/Wallet"));
const WishListPage = lazy(() => import("@/pages/User/WishListPage"));
const ChangePassword = lazy(() => import("@/pages/User/auth/ChangePassword"));

const UserRoutes: React.FC = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.PRODUCTS}>
        <Route index element={<AllProductsPage />} />
        <Route path=":id" element={<ProductDetailPage />} />
      </Route>
      <Route path={`${ROUTES.CATEGORIES}/:id`} element={<CategoryPage />} />

      <Route path={ROUTES.CART} element={<CartPage />} />
      <Route path={ROUTES.WISHLIST} element={<WishListPage />} />
      <Route path={ROUTES.CHECK_OUT} element={<CheckOutPage />} />
      <Route path="order/success" element={<OrderSuccessPage />} />
    </Route>
    <Route element={<UserProtectedRoutes />}>
      <Route path={ROUTES.PROFILE} element={<UserProfileLayout />}>
        <Route index element={<Profile />} />
        <Route path={ROUTES.WALLET} element={<WalletPage />} />
        <Route path={ROUTES.ORDERS}>
          <Route index element={<OrderPage />} />
          <Route path="view-details" element={<OrderDetailsPage />} />
        </Route>
        <Route path="address-book">
          <Route index element={<Address />} />
          <Route path=":id" element={<AddAndEditAddress />} />
          <Route path="add" element={<AddAndEditAddress />} />
        </Route>
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
    </Route>

    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    <Route path={ROUTES.REGISTER} element={<SignupPage />} />
    <Route path={`${ROUTES.OTP_VERIFY}/:id`} element={<OtpVerifyPage />} />
    <Route path={ROUTES.FORGOT_PASSSWORD}>
      <Route path="email" element={<ForgotPasswordEmail />} />
      <Route path="otp" element={<ForgotOtpPage />} />
    </Route>
    <Route path="/reset-password" element={<ResetPassword />} />
  </Routes>
);

export default UserRoutes;
