import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { 
  ShoppingBag, 
  FileText, 
  RefreshCcw, 
  XCircle, 
  ChevronRight, 
  History,
  CheckCircle2,
  Clock
} from "lucide-react";

import { IOrder } from "@/types/orderTypes";
import CancellationModal from "@/components/ui/modal/CancellationAndReturnableModal";
import Pagination from "@/components/Pagination";
import { pentaluxeTheme } from "@/theme";
import { OrderService } from "@/services/user/OrderService";
import { CheckoutService } from "@/services/user/CheckoutService";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [displayOrders, setDisplayOrders] = useState<IOrder[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getUserOrders = useCallback(async () => {
    setIsLoading(true);
    const res = await OrderService.getOrders();
    if (res.success) {
      setOrders(res.data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  const handlePagination = (items: IOrder[]) => {
    setDisplayOrders(items);
  };

  const openModal = (id: string, type: string, payment: string) => {
    setSelectedItemId(id);
    setModalType(type);
    setPaymentMethod(payment);
    setModalOpen(true);
  };

  const handleStatusChange = async (id: string, reason: string, payment: string) => {
    const res = await OrderService.cancelOrReturnOrder({
      id,
      reason,
      type: modalType,
      payment,
    });
    if (res.success) {
      const type = res.data;
      const status = type === "cancel" ? "Cancelled" : "Returned";
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      setModalOpen(false);
    }
  };

  const generateInvoicePDF = (order: IOrder) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("PENTALUXE OBSIDIAN RESERVE", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("Electronic Receipt Manifest", 105, 26, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.text(`Manifest ID: ${order._id}`, 20, 40);
    doc.text(`Timestamp: ${new Date(order.orderDate).toLocaleString()}`, 20, 46);
    doc.text(`Status: ${order.status}`, 20, 52);

    doc.setFont("helvetica", "bold");
    doc.text("Destination Registry:", 20, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.shippingAddress.Name}`, 20, 71);
    doc.text(`${order.shippingAddress.FlatNumberOrBuildingName}, ${order.shippingAddress.Locality}`, 20, 77);
    doc.text(`${order.shippingAddress.District}, ${order.shippingAddress.State} — ${order.shippingAddress.Pincode}`, 20, 83);

    doc.line(20, 90, 190, 90);
    doc.setFont("helvetica", "bold");
    doc.text("Item Manifest", 20, 100);
    doc.text("Qty", 150, 100);
    doc.text("Price", 175, 100);
    
    doc.setFont("helvetica", "normal");
    let y = 110;
    order.items.forEach((item) => {
      doc.text(item.productName, 20, y);
      doc.text(item.quantity.toString(), 152, y);
      doc.text(`Rs ${item.price.toFixed(0)}`, 175, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total Value Authorized:", 20, y);
    doc.text(`Rs ${order.totalAmount.toFixed(0)}`, 175, y);

    doc.save(`Pentaluxe_Manifest_${order._id.slice(-8)}.pdf`);
  };

  const handleRetryPayment = async (orderId: string, totalPrice: number) => {
    const keyRes = await CheckoutService.getRazorpayKey();
    const orderRes = await CheckoutService.createRazorpayOrder(totalPrice);

    if (!keyRes.success || !orderRes.success) return;

    const options = {
      key: keyRes.data.key,
      amount: orderRes.data.amount,
      currency: "INR",
      name: "PentaLuxe Re-Authorization",
      description: "Retry Payment Protocol",
      order_id: orderRes.data.id,
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        const res = await CheckoutService.retryPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
          retryPayment: true,
        });
        if (res.success) {
          getUserOrders();
        }
      },
      prefill: { name: "PentaLuxe Collector" },
      theme: { color: pentaluxeTheme.primary },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-3">
         <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Order History</span>
         </div>
         <h1 className="text-3xl md:text-4xl font-serif text-white uppercase italic">Your <span className="text-emerald-500">Orders.</span></h1>
         <p className="text-slate-500 text-xs font-light max-w-xl">
           Track and manage your Pentaluxe purchases. Access your digital invoices and check the real-time status of your shipments.
         </p>
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
             <ShoppingBag className="w-12 h-12 text-emerald-500/20 mb-6" />
             <h2 className="text-2xl font-serif text-white mb-2 uppercase tracking-widest">No Orders Yet</h2>
             <p className="text-slate-500 text-[10px] tracking-widest uppercase font-bold text-center px-6">You haven't placed any orders in your Pentaluxe collection yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(displayOrders.length > 0 ? displayOrders : orders).map((order) => (
              <div 
                key={order._id}
                className="group relative bg-gradient-to-br from-emerald-950/20 to-black border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-700 overflow-hidden hover:shadow-[0_0_50px_rgba(16,185,129,0.05)]"
                style={{ borderRadius: pentaluxeTheme.button.radius }}
              >
                {/* Order Top Bar - Premium Glassmorphism */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-emerald-500/5 bg-white/[0.01] backdrop-blur-md">
                   <div className="flex items-center gap-8">
                      <div className="space-y-1">
                         <span className="text-[7px] font-mono text-emerald-500/40 uppercase tracking-[0.4em] font-bold">Order ID</span>
                         <p className="text-xs font-mono text-white tracking-[0.2em] font-bold flex items-center gap-2">
                           <span className="w-1 h-3 bg-emerald-500/50 rounded-full" />
                           #{order._id.slice(-8).toUpperCase()}
                         </p>
                      </div>
                      <div className="w-px h-8 bg-emerald-500/10" />
                      <div className="space-y-1">
                         <span className="text-[7px] font-mono text-emerald-500/40 uppercase tracking-[0.4em] font-bold">Order Placed</span>
                         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{new Date(order.orderDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      {order.status === "Payment Failed" && (
                        <button 
                          onClick={() => handleRetryPayment(order._id, order.totalAmount)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all group/btn"
                          style={{ borderRadius: pentaluxeTheme.radius.md }}
                        >
                          <RefreshCcw className="w-3 h-3 group-hover/btn:rotate-180 transition-transform duration-700" /> RETRY PAYMENT
                        </button>
                      )}
                      
                      {(order.status === "Confirmed" || order.status === "Delivered") && (
                        <button 
                          onClick={() => generateInvoicePDF(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all"
                          style={{ borderRadius: pentaluxeTheme.radius.md }}
                        >
                          <FileText className="w-3 h-3" /> GET INVOICE
                        </button>
                      )}

                      {(order.status === "Pending" || order.status === "Confirmed" || order.status === "Delivered") && (
                        <button 
                          onClick={() => openModal(order._id, (order.status === "Pending" || order.status === "Confirmed") ? "cancel" : "return", order.paymentMethod)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/20 text-red-500/60 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all"
                          style={{ borderRadius: pentaluxeTheme.radius.md }}
                        >
                          <XCircle className="w-3 h-3" /> {order.status === "Delivered" ? "RETURN ITEMS" : "CANCEL ORDER"}
                        </button>
                      )}
                   </div>
                </div>

                {/* Journey Progress Indicator - Visual Flair */}
                <div className="px-6 py-2 bg-emerald-500/[0.02] border-b border-emerald-500/5">
                   <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${order.status !== 'Cancelled' && order.status !== 'Payment Failed' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-[8px] uppercase tracking-[0.5em] font-bold text-slate-500 italic">Delivery Status Tracker</span>
                      </div>
                      <div className="flex-grow h-[1px] bg-gradient-to-r from-emerald-500/20 via-emerald-500/5 to-transparent" />
                   </div>
                </div>

                {/* Order Summary - Premium Grid */}
                <div className="p-6 flex flex-col lg:flex-row gap-8 items-center relative z-10">
                   {/* Status & Price Section */}
                   <div className="flex flex-col items-center gap-2 min-w-[160px]">
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-[0.3em] shadow-inner backdrop-blur-xl ${
                         order.status === "Cancelled" || order.status === "Returned" || order.status === "Payment Failed"
                           ? "bg-red-500/10 border-red-500/20 text-red-400"
                           : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]"
                      }`}>
                         {order.status === "Delivered" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                         {order.status}
                      </div>
                      <p className="text-3xl font-serif italic text-white whitespace-nowrap pt-1">
                        <span className="text-emerald-500 text-sm align-top mr-1 font-sans not-italic">₹</span>
                        {order.totalAmount.toLocaleString()}
                      </p>
                   </div>

                   <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent hidden lg:block" />

                   {/* Product Preview - Elegant Manifestation */}
                   <div className="flex-grow flex flex-wrap gap-4 items-center justify-center lg:justify-start">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] p-2 pr-5 border border-white/[0.05] transition-colors group/item" style={{ borderRadius: pentaluxeTheme.radius.md }}>
                           <div className="w-12 h-12 bg-black border border-emerald-500/10 overflow-hidden flex-shrink-0 relative">
                              <img src={item.productImage} alt="" className="w-full h-full object-cover grayscale-[0.5] group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                           </div>
                           <div className="max-w-[140px]">
                              <h4 className="text-[10px] font-serif text-white uppercase tracking-widest truncate group-hover/item:text-emerald-400 transition-colors">{item.productName}</h4>
                              <p className="text-[8px] text-emerald-500/40 font-mono tracking-widest italic uppercase mt-0.5">Qty: {item.quantity}</p>
                           </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-emerald-500/10 bg-emerald-500/[0.03] text-[10px] text-emerald-500 font-bold tracking-tighter">
                          +{order.items.length - 3}
                        </div>
                      )}
                   </div>
                   
                   {/* Action Terminal */}
                   <div className="flex-shrink-0 pl-4 border-l border-emerald-500/5 hidden lg:block">
                      <button 
                        onClick={() => navigate("/profile/orders/view-details", { state: { order } })}
                        className="relative p-4 rounded-full bg-emerald-500/5 hover:bg-emerald-500 text-emerald-500 hover:text-black transition-all duration-500 group/nav shadow-lg"
                      >
                         <ChevronRight className="w-5 h-5 group-hover/nav:translate-x-1 transition-transform" />
                         <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.4em] opacity-0 group-hover/nav:opacity-100 transition-opacity whitespace-nowrap text-emerald-500">View Full Details</span>
                      </button>
                   </div>
                   <div className="lg:hidden w-full pt-4">
                      <button 
                        onClick={() => navigate("/profile/orders/view-details", { state: { order } })}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-emerald-500/5 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/10"
                      >
                        VIEW ORDER DETAILS <ChevronRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>

                {/* Subsurface Aesthetic Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
                
                {/* Lateral Accent Indicator */}
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="pt-8 border-t border-emerald-500/5 flex justify-center">
             <Pagination items={orders} itemsPerPage={3} onPageChange={handlePagination} />
          </div>
        )}
      </div>

      <CancellationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleStatusChange}
        item={selectedItemId}
        type={modalType}
        payment={paymentMethod}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default OrdersPage;
