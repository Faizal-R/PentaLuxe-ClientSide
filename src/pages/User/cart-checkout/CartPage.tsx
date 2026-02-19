import { Heart, MoveRight, Trash2, ShoppingBag, Tag, Truck, ShieldCheck, Minus, Plus, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { toast } from "sonner";
import EmptyCart from "@/components/EmptyCart";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartProducts,
  changeQuantity,
  removeProduct,
} from "@/store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Cart } from "@/types/cartProductTypes";
import { ICoupon } from "@/pages/Admin/managements/AdminCouponManagementPage";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { pentaluxeTheme } from "@/theme";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state: { cart: { products: Cart[] } }) => state.cart.products) || [];
  
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [availableCoupons, setAvailableCoupons] = useState<ICoupon[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [selectedRate, setSelectedRate] = useState(0);
  const [toggleButton, setToggleButton] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const selectTagRef = useRef<HTMLSelectElement>(null);

  const getCartProducts = useCallback(async () => {
    try {
      const res = await api.get(USER_API_ROUTES.CART.GET);
      if (res.status === AppHttpStatusCodes.OK) {
        dispatch(setCartProducts(res.data.data || []));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === AppHttpStatusCodes.UNAUTHORIZED) navigate("/login");
        toast.error(error.response?.data.message);
      }
    }
  }, [dispatch, navigate]);

  const getAllCoupons = useCallback(async () => {
    try {
      const res = await api.get(USER_API_ROUTES.COUPONS.GET);
      if (res.status === AppHttpStatusCodes.OK) {
        const { data: fetchResult } = res.data;
        const validCoupons = fetchResult.filter((c: { expiryDate: string | null }) => c.expiryDate !== null);
        setCoupons(validCoupons);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getAllCoupons();
    getCartProducts();
  }, [getAllCoupons, getCartProducts]);

  const handleChangeQuantity = async (itemId: string, action: string, stock: number) => {
    setIsUpdating(itemId);
    try {
      const res = await api.patch(USER_API_ROUTES.CART.PATCH, { itemId, action, stock });
      if (res.status === AppHttpStatusCodes.OK) {
        dispatch(changeQuantity({ id: itemId, action, stock }));
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleProductRemove = async (productId: string) => {
    try {
      const res = await api.delete(USER_API_ROUTES.CART.REMOVE_PRODUCT(productId));
      if (res.status === AppHttpStatusCodes.OK) {
        dispatch(removeProduct(productId));
        toast.success("Removed from Shopping Cart");
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    const calculatedTotal = products.reduce((acc: number, product: Cart) => {
      const price = product.product?.DiscountPercentage > 0
        ? product.variant.price * (1 - product.product?.DiscountPercentage / 100)
        : product.variant.price;
      return acc + price * product.quantity;
    }, 0);

    const deliveryCharge = 40;
    let finalPrice = deliveryCharge + calculatedTotal;

    if (discountRate > 0) {
      const currentCoupon = availableCoupons.find(c => c.discountPercentage === selectedRate);
      if (currentCoupon) {
        const calcDiscount = (calculatedTotal * discountRate) / 100;
        const finalDiscount = Math.min(calcDiscount, Number(currentCoupon.maxDiscountPrice));
        setDiscountAmount(finalDiscount);
        finalPrice -= finalDiscount;
      }
    } else {
      setDiscountAmount(0);
    }

    setOriginalPrice(calculatedTotal);
    setTotalPrice(finalPrice);
  }, [products, discountRate, availableCoupons, selectedRate]);

  useEffect(() => {
    setAvailableCoupons(coupons.filter(c => originalPrice >= Number(c.minimumPurchasePrice)));
  }, [originalPrice, coupons]);

  const toggleCouponDiscount = () => {
    if (!selectedRate && !toggleButton) {
      toast.info("Select a preservation code");
      selectTagRef.current?.focus();
      return;
    }
    setToggleButton(!toggleButton);
    setDiscountRate(toggleButton ? 0 : selectedRate);
    if (toggleButton) {
      setSelectedRate(0);
      setSelectedCoupon("");
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const res = await api.patch(USER_API_ROUTES.CART.CART_TOTAL, { totalPrice });
      if (res.status === AppHttpStatusCodes.OK) {
        navigate("/checkout", { state: { totalPrice, discountAmount, selectedCoupon } });
      }
    } catch (err) {}
  };

  if (!products.length) return <EmptyCart />;

  return (
    <div 
      className="min-h-screen pt-8 pb-16 px-8 lg:px-12 font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      <div className="w-full space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
           <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-emerald-500/20" />
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
              <div className="h-px w-12 bg-emerald-500/20" />
           </div>
           <h1 className="text-4xl md:text-5xl font-serif">Shopping <span className="text-emerald-500 italic">Cart.</span></h1>
           <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase font-bold">Review your selected items</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          
          {/* Products List */}
          <div className="xl:col-span-2 space-y-6">
            {products.map((product: Cart) => (
              <div 
                key={product._id} 
                className="group relative flex flex-col sm:flex-row gap-8 p-6 bg-emerald-950/[0.03] border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 rounded-sm"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-40 aspect-square overflow-hidden bg-emerald-950/20 rounded-sm">
                   <img 
                     src={product.product?.Images?.[0]} 
                     alt={product.product?.Name} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                </div>

                {/* Product Details */}
                <div className="flex-grow flex flex-col justify-between py-2 space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <span className="text-[10px] tracking-widest text-emerald-500/60 uppercase font-mono">Product Code: {product._id.slice(-4)}</span>
                         <h3 className="text-2xl font-serif text-white">{product.product?.Name}</h3>
                         <p className="text-xs text-slate-500 font-mono italic">Size: {product.variant.volume}</p>
                      </div>
                      <button 
                        onClick={() => handleProductRemove(product._id)}
                        className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>

                   <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-emerald-500/5">
                      <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 line-through font-mono">₹{product.variant.price}</span>
                            <span className="text-xl font-bold font-mono text-emerald-500">
                              ₹{(product.variant.price * (1 - (product.product?.DiscountPercentage || 0) / 100)).toFixed(0)}
                            </span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${product.variant.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-[9px] uppercase tracking-widest font-bold ${product.variant.stock > 0 ? 'text-emerald-500/60' : 'text-red-500'}`}>
                               {product.variant.stock > 10 ? "Available" : product.variant.stock === 0 ? "Exhausted" : `Rare: Only ${product.variant.stock} Left`}
                            </span>
                         </div>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-6 bg-black/40 border border-emerald-500/10 px-4 py-2 rounded-sm">
                         <button 
                           disabled={product.quantity === 1 || isUpdating === product._id}
                           onClick={() => handleChangeQuantity(product._id, "DEC", product.variant.stock)}
                           className="text-emerald-500/40 hover:text-emerald-500 disabled:opacity-20 transition-colors"
                         >
                           <Minus className="w-4 h-4" />
                         </button>
                         <span className="text-sm font-mono font-bold w-4 text-center">
                           {isUpdating === product._id ? <RefreshCcw className="w-3 h-3 animate-spin mx-auto" /> : product.quantity}
                         </span>
                         <button 
                           disabled={product.quantity >= product.variant.stock || isUpdating === product._id}
                           onClick={() => handleChangeQuantity(product._id, "INC", product.variant.stock)}
                           className="text-emerald-500/40 hover:text-emerald-500 disabled:opacity-20 transition-colors"
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Aesthetic Sidebar Link */}
                <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent group-hover:scale-y-110 transition-transform duration-700" />
              </div>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="space-y-8">
            <div className="bg-emerald-950/[0.04] border border-emerald-500/10 p-10 space-y-10 sticky top-32">
               <h2 className="text-2xl font-serif text-white border-b border-emerald-500/10 pb-6 flex items-center gap-4">
                  Order <span className="text-emerald-500 italic">Summary</span>
               </h2>

               {/* Coupon Section */}
               <div className="space-y-4">
                  <div className="relative group">
                     <select
                       ref={selectTagRef}
                       value={selectedRate}
                       onChange={(e) => {
                         const idx = e.target.selectedIndex;
                         setSelectedRate(Number(e.target.value));
                         setSelectedCoupon(e.target.options[idx].text);
                       }}
                       disabled={availableCoupons.length === 0 || toggleButton}
                       className="w-full bg-black/60 border border-emerald-500/10 px-10 py-4 text-[11px] tracking-widest uppercase appearance-none text-white focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-40"
                     >
                       <option value="0">{availableCoupons.length === 0 ? "No Coupons Available" : "Select a Coupon"}</option>
                       {availableCoupons.map((c) => (
                         <option key={c._id} value={c.discountPercentage}>{c.couponName}</option>
                       ))}
                     </select>
                     <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40" />
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-500/40 pointer-events-none" />
                  </div>
                  <button 
                    onClick={toggleCouponDiscount}
                    className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                      toggleButton 
                        ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20" 
                        : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black"
                    }`}
                  >
                    {toggleButton ? "Remove Coupon" : "Apply Coupon"}
                  </button>
               </div>

               {/* Financials */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-light">Subtotal</span>
                     <span className="font-mono text-white">₹{originalPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2 text-slate-500">
                        <Truck className="w-4 h-4" />
                        <span className="font-light">Shipping Fee</span>
                     </div>
                     <span className="font-mono text-white">₹40</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-top-2">
                       <span className="text-emerald-500 font-bold tracking-widest text-[10px] uppercase italic">Coupon Discount</span>
                       <span className="font-mono text-emerald-500">- ₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="h-px bg-emerald-500/10" />
                  <div className="flex justify-between items-end">
                     <div className="space-y-1">
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Order Total</span>
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3 text-emerald-500/40" />
                           <span className="text-[9px] text-emerald-500/40 uppercase tracking-tighter">Secure SSL Transaction</span>
                        </div>
                     </div>
                     <span className="text-4xl font-mono font-bold text-white">₹{totalPrice.toFixed(0)}</span>
                  </div>
               </div>

               {/* Checkout Action */}
               <div className="space-y-6 pt-4">
                  <button 
                    onClick={handleProceedToCheckout}
                    className="w-full py-5 bg-emerald-600 text-black font-bold uppercase text-[12px] tracking-[0.4em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-1"
                  >
                    Proceed to Checkout
                  </button>
                  <Link 
                    to="/products"
                    className="flex items-center justify-center gap-3 text-emerald-500/40 hover:text-emerald-500 transition-colors uppercase text-[10px] tracking-[0.3em] font-bold"
                  >
                    Continue Shopping <MoveRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        select option {
          background-color: #0c1110;
          color: white;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default CartPage;
