import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IOrder } from "@/types/orderTypes";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ShieldCheck,
  FileText,
  Activity
} from "lucide-react";

const OrderDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order: IOrder = location.state.order;

  if (!order) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-6">
         <button 
           onClick={() => navigate(-1)}
           className="group flex items-center gap-3 text-emerald-500/40 hover:text-emerald-500 transition-colors uppercase text-[10px] tracking-[0.4em] font-bold"
         >
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           Back to Orders
         </button>

         <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-emerald-500/10 pb-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Order Details</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tabular-nums">Order <span className="text-emerald-500 font-mono">#{order._id.slice(-12).toUpperCase()}</span></h1>
               <div className="flex items-center gap-6">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Placed on: {new Date(order.orderDate).toLocaleString()}</p>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-sm border text-[9px] font-bold uppercase tracking-widest ${
                     order.status === "Cancelled" || order.status === "Returned" 
                       ? "bg-red-500/5 border-red-500/20 text-red-500"
                       : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                  }`}>
                     {order.status === "Delivered" ? <CheckCircle2 className="w-3 h-3" /> : order.status === "Cancelled" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                     {order.status}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         {/* Left Column: Coordinates & Authorization */}
         <div className="space-y-12">
            
            {/* Shipping Address */}
            <section className="space-y-6 p-10 bg-emerald-950/[0.03] border border-emerald-500/10 rounded-sm">
               <div className="flex items-center gap-4 border-b border-emerald-500/5 pb-4">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-lg font-serif uppercase tracking-widest">Shipping Address</h3>
               </div>
               <div className="space-y-4">
                  <p className="text-xl font-serif text-white">{order.shippingAddress.Name}</p>
                  <div className="space-y-2 text-sm text-slate-400 font-light leading-relaxed">
                     <p>{order.shippingAddress.FlatNumberOrBuildingName}, {order.shippingAddress.Landmark}</p>
                     <p>{order.shippingAddress.Locality}, {order.shippingAddress.District}</p>
                     <p className="font-bold text-white tracking-widest uppercase">{order.shippingAddress.State} — {order.shippingAddress.Pincode}</p>
                  </div>
               </div>
            </section>

            {/* Payment Information */}
            <section className="space-y-6 p-10 bg-emerald-950/[0.03] border border-emerald-500/10 rounded-sm">
               <div className="flex items-center gap-4 border-b border-emerald-500/5 pb-4">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-lg font-serif uppercase tracking-widest">Payment Information</h3>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Payment Method</span>
                  <span className="text-sm font-mono text-emerald-400 font-bold uppercase">{order.paymentMethod}</span>
               </div>
               <div className="flex items-center gap-3 pt-4 text-emerald-500/40">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[9px] uppercase tracking-[0.2em]">Securely processed and authorized</span>
               </div>
            </section>
         </div>

         {/* Right Column: Order Items & Summary */}
         <div className="space-y-12">
            
            {/* Order Items */}
            <section className="space-y-8">
               <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-4">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-2xl font-serif uppercase">Order <span className="text-emerald-500 italic">Items</span></h2>
               </div>

               <div className="space-y-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="group relative flex gap-6 p-6 bg-emerald-950/[0.02] border border-emerald-500/5 hover:border-emerald-500/10 transition-all rounded-sm">
                       <div className="w-20 h-24 flex-shrink-0 bg-emerald-900/20 overflow-hidden rounded-sm border border-white/5">
                          <img src={item.productImage} alt="" className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-opacity duration-500" />
                       </div>
                       <div className="flex-grow flex flex-col justify-between py-1">
                          <div className="space-y-1">
                             <h4 className="text-lg font-serif text-white hover:text-emerald-500 transition-colors uppercase cursor-pointer">{item.productName}</h4>
                          </div>
                          <div className="flex justify-between items-end">
                             <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                                Quantity: <span className="text-white font-mono">{item.quantity}</span>
                             </div>
                             <span className="text-lg font-mono font-bold text-emerald-500 tracking-tighter">₹{item.price.toFixed(0)}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Payment Summary */}
            <section className="space-y-6 p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
               <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-4">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-lg font-serif uppercase tracking-widest">Payment Summary</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-500 font-light">
                     <span>Subtotal</span>
                     <span className="font-mono text-white">₹{(order.totalAmount - 40).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-light">
                     <span>Shipping Fee</span>
                     <span className="font-mono text-white">₹40</span>
                  </div>
                  <div className="h-px bg-emerald-500/10 my-6" />
                  <div className="flex justify-between items-end">
                     <span className="text-xs uppercase tracking-[0.4em] font-bold text-slate-500">Total Paid</span>
                     <span className="text-4xl font-mono font-bold text-white tracking-widest">₹{order.totalAmount.toFixed(0)}</span>
                  </div>
               </div>
            </section>
         </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default OrderDetailsPage;
