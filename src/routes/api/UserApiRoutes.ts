export const USER_API_ROUTES = {
  PRODUCTS: {
    GET: "/user/products",
    GET_RELATED_PRODUCTS: (categoryName: string, productId: string) =>
      `/user/related-products?categoryName=${categoryName}&productID=${productId}`,
    GET_BY_ID: (productId: string) => `/user/products/${productId}`,
    SEARCH_BY_CATEGORY: "/user/search-products-by-category",
  },
  CATEGORIES: {
    GET: "/user/categories",
    GET_ALL_PRODUCTS_BY_CATEGORY: (categoryId: string) =>
      `/user/categories/${categoryId}`,
  },
  PROFILE: {
    GET: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    UPDATE: "/user/profile",
  },
  ADDRESS_BOOK: {
    ADD_ADDRESS_BOOK: "/user/address-book",
    UPDATE_ADDRESS_BOOK: "/user/address-book",
    GET: "/user/address-book",
    DELETE_ADDRESS_BOOK: (addressBookId: string) =>
      `/user/address-book/${addressBookId}`,
    GET_BY_ID: (addressBookId: string) => `/user/address-book/${addressBookId}`,
  },
  CART: {
    GET: "/user/cart",
    PATCH: "/user/cart",
    PUT: "",
    REMOVE_PRODUCT: (productId: string) => `/user/cart/${productId}`,
    CART_TOTAL: "/user/cart-total",
    ADD_TO_CART: "/user/cart",
  },
  WISHLIST: {
    GET: "/user/wishlist",
    REMOVE_FROM_WISHLIST: (productId: string) => `/user/wishlist/${productId}`,
    ADD_TO_WISHLIST: "/user/wishlist",
    CHECK_PRODUCT: (productId: string) => `/user/wishlist/${productId}`,
  },
  ORDERS: {
    PLACE_ORDER: "/user/place-order",
    GET: "/user/orders",
    CANCEL_OR_RETURN_ORDER: "/user/orders",
  },
  AUTH: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    VERIFY_OTP: "/user/otp-verify",
    RESEND_OTP: "/user/resend-otp",
    GOOGLE_AUTH: "/user/google-auth",
  },
  COUPONS: {
    GET: "/user/coupons",
  },
  WALLET: {
    GET: "/user/wallet",
  },
  PAYMENT: {
    PAYMENT_FAILURE: "/user/razorpay-payment-failure",
    VERIFY_AND_CREATE_ORDER: "/user/verify-payment-and-create-order",
    WALLET_PAYMENT: "/user/wallet-payment",
    CREATE_RAZORPAY_ORDER: "/user/create-razorpay-order",
    RETRY_PAYMENT: "/user/order-retry-payment",
    GET_RAZORPAY_KEY: "/user/getkey",
  },
};
