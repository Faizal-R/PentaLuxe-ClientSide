import { Plus, ShieldCheck, MapPin, CreditCard, Wallet, Truck, AlertCircle, ArrowLeft, Edit3 } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Cart } from "@/types/cartProductTypes";
import { IAddress } from "@/types/AddressTypes";
import { addressValidation } from "@/utils/AddressValidation";
import AddressModal from "@/components/ui/modal/AddressModal";
import { pentaluxeTheme } from "@/theme";
import { setCartProducts } from "@/store/slices/cartSlice";
import { ProfileService } from "@/services/user/ProfileService";
import { CartService } from "@/services/user/CartService";
import { OrderService } from "@/services/user/OrderService";
import { CheckoutService } from "@/services/user/CheckoutService";
import { errorToast } from "@/utils/customToast";

const inputsArray = [
  { label: "Name", type: "text" },
  { label: "Phone", type: "number" },
  { label: "Pincode", type: "number" },
  { label: "Locality", type: "text" },
  { label: "FlatNumberOrBuildingName", type: "text" },
  { label: "Landmark", type: "text" },
  { label: "State", type: "text" },
  { label: "District", type: "text" },
];

const CheckOutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState<Cart[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressBtnToggle, setAddressBtnToggle] = useState(false);
  const [addressId, setAddressId] = useState("");
  const [addressType, setAddressType] = useState("");
  
  const [formState, setFormState] = useState({
    Name: "",
    Phone: "",
    Pincode: "",
    Locality: "",
    FlatNumberOrBuildingName: "",
    Landmark: "",
    District: "",
    State: "",
  });

  const totalPrice = location.state?.totalPrice || 0;
  const couponDiscount = location.state?.discountAmount || 0;
  const couponCode = location.state?.selectedCoupon || "";

  const getUserData = useCallback(async () => {
    const [addrRes, cartRes] = await Promise.all([
      ProfileService.getAddressBook(),
      CartService.getCart()
    ]);
    if (addrRes.success) setAddresses(addrRes.data);
    if (cartRes.success) setProducts(cartRes.data);
  }, []);

  useEffect(() => {
    getUserData();
    window.scrollTo(0, 0);
  }, [getUserData]);

  const onInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const onAddressHandler = async (e: FormEvent, action: string = "Add") => {
    e.preventDefault();
    const validationError = addressValidation(formState);
    if (validationError) return errorToast(validationError);

    setAddressBtnToggle(true);
    let res;
    if (action === "Add") {
      res = await ProfileService.addAddress({ formState, addressType });
    } else {
      res = await ProfileService.updateAddress({ formState, addressType, addressId });
    }

    if (res.success) {
      setIsModalOpen(false);
      getUserData();
      setFormState({ Name: "", Phone: "", Pincode: "", Locality: "", FlatNumberOrBuildingName: "", Landmark: "", District: "", State: "" });
    }
    setAddressBtnToggle(false);
  };

  const handleEditAddress = (addr: IAddress) => {
    setIsEditMode(true);
    setAddressId(addr._id);
    setFormState({
      Name: addr.Name,
      Phone: addr.Phone,
      Pincode: addr.Pincode,
      Locality: addr.Locality,
      FlatNumberOrBuildingName: addr.FlatNumberOrBuildingName,
      Landmark: addr.Landmark || "",
      District: addr.District,
      State: addr.State,
    });
    setAddressType(addr.addressType);
    setIsModalOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return errorToast("Please select a shipping address");
    if (!selectedPaymentMethod) return errorToast("Please select a payment method");

    const orderDetails = {
      addressId: selectedAddress,
      items: products.map(p => ({
        productId: p.product._id,
        productName: p.product.Name,
        quantity: p.quantity,
        price: p.variant.price - (p.variant.price * p.product.DiscountPercentage / 100),
        subtotal: (p.variant.price - (p.variant.price * p.product.DiscountPercentage / 100)) * p.quantity,
        productImage: p.product.Images[0],
        discountPercentage: p.product.DiscountPercentage,
        categoryName: p.product.CategoryId.categoryName,
      })),
      paymentMethod: selectedPaymentMethod,
      totalAmount: totalPrice,
      couponDiscount,
      couponCode,
    };

    if (selectedPaymentMethod === "Razorpay") {
      await handleRazorpay(orderDetails);
    } else if (selectedPaymentMethod === "Wallet") {
      const res = await CheckoutService.walletPayment({ orderDetails, totalPrice });
      if (res.success) handleSuccess(res.data);
    } else {
      const res = await OrderService.placeOrder(orderDetails);
      if (res.success) handleSuccess(res.data);
    }
  };

  const handleRazorpay = async (orderDetails: any) => {
    const {key} = await CheckoutService.getRazorpayKey();
    const orderRes = await CheckoutService.createRazorpayOrder(totalPrice);
    // console.log(keyRes,orderRes)
    // if (!keyRes.success || !orderRes.success) return;

    const options = {
      key: key,
      amount: orderRes.data.amount,
      currency: "INR",
      name: "PentaLuxe Premium",
      description: "Secure Checkout Payment",
      order_id: orderRes.data.id,
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        const res = await CheckoutService.verifyAndCreateOrder({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderDetails,
        });
        if (res.success) handleSuccess(res.data);
      },
      prefill: { name: "PentaLuxe Collector" },
      theme: { color: pentaluxeTheme.primary },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", async (response: any) => {
      await CheckoutService.handlePaymentFailure({ response, orderDetails });
      errorToast("Payment failed. Please try again.");
    });
    rzp.open();
  };

  const handleSuccess = (data: any) => {
    dispatch(setCartProducts([]));
    navigate("/order/success", { state: { orderId: data.orderId, DeliveryDate: data.estimatedDeliveryDate } });
  };

  return (
    <div 
      className="min-h-screen pt-8 pb-16 px-8 lg:px-12 font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      <div className="w-full space-y-10">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="h-px w-20 bg-emerald-500/20" />
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="h-px w-20 bg-emerald-500/20" />
           </div>
           <h1 className="text-4xl md:text-5xl font-serif text-center">Place <span className="text-emerald-500 italic">Order.</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Shipping Section */}
            <section className="space-y-8">
               <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-4">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-2xl font-serif">Shipping Destination</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr._id)}
                      className={`relative p-6 border transition-all duration-500 cursor-pointer group rounded-sm ${
                        selectedAddress === addr._id 
                          ? "bg-emerald-500/5 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                          : "bg-emerald-950/[0.03] border-emerald-500/10 hover:border-emerald-500/40"
                      }`}
                    >
                       <div className="flex justify-between items-start mb-4">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                             selectedAddress === addr._id ? "border-emerald-500" : "border-white/10"
                          }`}>
                             {selectedAddress === addr._id && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                            className="text-slate-500 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                             <Edit3 className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="space-y-2">
                          <p className="font-bold text-white tracking-wide">{addr.Name}</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-light">
                             {addr.FlatNumberOrBuildingName}, {addr.Locality},<br />
                             {addr.District}, {addr.State} — {addr.Pincode}
                          </p>
                          <div className="pt-2">
                             <span className="text-[10px] uppercase tracking-widest text-emerald-500/40 font-mono italic">{addr.addressType} Location</span>
                          </div>
                       </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => { setIsEditMode(false); setIsModalOpen(true); }}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group rounded-sm"
                  >
                    <Plus className="w-8 h-8 text-emerald-500/20 group-hover:text-emerald-500 mb-2" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-emerald-500">Add New Address</span>
                  </button>
               </div>
            </section>

            {/* Payment Section */}
            <section className="space-y-8">
               <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-4">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-2xl font-serif">Payment Method</h2>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {[
                        { id: "Razorpay", label: "Online Payment", icon: <CreditCard />, desc: "Fast & Secure" },
                        { id: "Wallet", label: "My Wallet", icon: <Wallet />, desc: "Instant Checkout" },
                        { id: "Cash on Delivery", label: "Cash on Delivery", icon: <Truck />, desc: "Only for orders < ₹1000", disabled: totalPrice > 1000 }
                     ].map((method) => (
                        <button
                          key={method.id}
                          disabled={method.disabled}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`flex flex-col items-center gap-4 p-8 border transition-all duration-500 rounded-sm ${
                             selectedPaymentMethod === method.id 
                               ? "bg-emerald-500/5 border-emerald-500 shadow-[0_0_20px_#10b98120]" 
                               : "bg-emerald-950/[0.03] border-emerald-500/10 hover:border-emerald-500/40"
                          } ${method.disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                           <div className={`p-4 rounded-full ${selectedPaymentMethod === method.id ? "bg-emerald-500 text-black shadow-[0_0_15px_#10b981]" : "bg-emerald-500/5 text-emerald-500/40"}`}>
                              {method.icon}
                           </div>
                           <div className="text-center space-y-1">
                              <p className="text-[11px] font-bold uppercase tracking-widest">{method.label}</p>
                              <p className="text-[9px] text-slate-500 font-mono tracking-tighter italic">{method.desc}</p>
                           </div>
                        </button>
                     ))}
                  </div>

                  {totalPrice > 1000 && (
                     <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-sm text-red-500 transition-all animate-in fade-in zoom-in-95">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Alert: Cash on Delivery is unavailable for orders above ₹1000.</span>
                     </div>
                  )}
               </div>
            </section>

            <div className="pt-12">
               <button 
                 onClick={handlePlaceOrder}
                 className="w-full py-6 bg-emerald-600 text-black font-bold uppercase text-[12px] tracking-[0.5em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1"
               >
                  Complete Purchase
               </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="space-y-8">
             <div className="bg-emerald-950/[0.04] border border-emerald-500/10 p-10 rounded-sm space-y-10 sticky top-32">
                <h2 className="text-2xl font-serif text-white border-b border-emerald-500/10 pb-6">Order <span className="text-emerald-500 italic">Summary</span></h2>
                
                {/* Product List */}
                <div className="max-h-[400px] overflow-y-auto space-y-6 pr-4">
                   {products.map((p) => (
                     <div key={p.product._id} className="flex gap-4 group">
                        <div className="w-16 h-16 bg-emerald-950/20 border border-emerald-500/10 overflow-hidden flex-shrink-0">
                           <img src={p.product.Images[0]} alt="" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                        </div>
                        <div className="flex-grow space-y-1">
                           <p className="text-xs font-serif text-white group-hover:text-emerald-500 transition-colors uppercase tracking-widest">{p.product.Name}</p>
                           <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                              <span>Qty: {p.quantity}</span>
                              <span className="text-emerald-500/60 font-bold">₹{(p.variant.price * (1 - p.product.DiscountPercentage / 100)).toFixed(0)}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                {/* Totals */}
                <div className="space-y-6 border-t border-emerald-500/10 pt-10">
                   <div className="flex justify-between text-sm text-slate-500 font-light">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{(totalPrice - 40).toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-sm text-slate-500 font-light">
                      <span>Shipping Fee</span>
                      <span className="font-mono">₹40</span>
                   </div>
                   {couponDiscount > 0 && (
                     <div className="flex justify-between text-sm text-emerald-500 font-bold italic tracking-widest uppercase">
                        <span>Coupon Discount</span>
                        <span className="font-mono">- ₹{couponDiscount.toFixed(0)}</span>
                     </div>
                   )}
                   <div className="h-px bg-emerald-500/10 shadow-[0_0_10px_#10b98120]" />
                   <div className="flex justify-between items-end">
                      <span className="text-xs uppercase tracking-[0.3em] font-bold text-slate-500">Total Amount</span>
                      <div className="text-right">
                         <span className="text-4xl font-mono font-bold text-white leading-none">₹{totalPrice.toFixed(0)}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-6">
                   <button 
                     onClick={() => navigate('/cart')}
                     className="flex items-center gap-3 text-emerald-500/40 hover:text-emerald-500 transition-all uppercase text-[10px] tracking-widest font-bold"
                   >
                      <ArrowLeft className="w-4 h-4" /> Edit Cart
                   </button>
                </div>
             </div>
          </aside>
        </div>
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inputsArray={inputsArray}
        formState={formState}
        onInputHandler={onInputHandler}
        addressType={addressType}
        setAddressType={setAddressType}
        onAddressHandler={onAddressHandler}
        isEditMode={isEditMode}
        addressBtnToggle={addressBtnToggle}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #10b98120; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
};

export default CheckOutPage;
