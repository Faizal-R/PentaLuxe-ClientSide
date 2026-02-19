
import Pagination from "@/components/Pagination";
import React, { useEffect, useState } from "react";
import { IOrder } from "@/types/orderTypes";
import { 
  Package,
  MapPin, 
  User as UserIcon, 
  Calendar, 
  ChevronRight, 
  X,
  ShoppingBag,
  Clock
} from "lucide-react";
import { AdminOrderService } from "@/services/admin/AdminOrderService";
import { successToast } from "@/utils/customToast";
import { toast } from "sonner";

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [paginatedOrders, setPaginatedOrders] = useState<IOrder[] | []>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = async (status: string, orderId: string) => {
    const res = await AdminOrderService.updateOrderStatus(orderId, status);
    if (res.success) {
      setOrders(prev => prev.map((order) => order._id === orderId ? { ...order, status: res.data.status } : order));
      successToast("Status update confirmed.");
    }
  };

  const handleOnChangeOrderStatus = (status: string, orderId: string) => {
    toast.custom(
      (id) => (
        <div className="bg-[#0c1110] border border-white/10 p-8 rounded-[38px] shadow-2xl backdrop-blur-3xl min-w-[320px] space-y-6">
          <div className="flex items-center gap-4 text-emerald-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xl font-serif text-white tracking-tight">Modify Status?</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Logistics State Transition</p>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Are you certain you wish to transition this order to the <span className="text-emerald-500 font-bold">"{status}"</span> state?
          </p>

          <div className="flex gap-3">
            <button
              className="flex-grow px-6 py-3.5 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
              onClick={() => {
                handleStatusChange(status, orderId); 
                toast.dismiss(id);
              }}
            >
              Verify
            </button>
            <button
              className="px-6 py-3.5 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/5"
              onClick={() => toast.dismiss(id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const getAllOrders = async () => {
    const res = await AdminOrderService.getAllOrders();
    if (res.success) {
      setOrders(res.data);
      setPaginatedOrders(res.data.slice(0, 10));
    }
  };

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const handlePagination = (items: IOrder[]) => setPaginatedOrders(items);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'Cancelled': 
      case 'Payment Failed': return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'Shipped': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      default: return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Logistics Terminal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Order Command</h1>
        </div>
      </div>

      {/* Orders Registry */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Signature</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Operative</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Yield</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Timeline</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">State</th>
              <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {paginatedOrders?.map((order) => (
              <tr key={order._id} className="group hover:bg-emerald-500/[0.02] transition-all duration-500">
                <td className="px-8 py-6">
                   <p className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-tighter">ORD-{order._id.slice(-6)}</p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <UserIcon size={12} className="text-emerald-500/40" />
                      <span className="text-[12px] font-bold text-white uppercase tracking-widest">{order.user?.username}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-[14px] font-serif text-emerald-500 tracking-tighter">₹{order.totalAmount.toFixed(0)}</p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={12} className="text-emerald-500/20" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">
                        {new Date(order.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <select
                     disabled={['Delivered', 'Returned', 'Cancelled', 'Payment Failed'].includes(order.status)}
                     value={order.status}
                     onChange={(e) => handleOnChangeOrderStatus(e.target.value, order._id)}
                     className={`px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer transition-all ${getStatusStyle(order.status)}`}
                   >
                     <option value={order.status}>{order.status}</option>
                     {!['Delivered', 'Returned', 'Cancelled', 'Payment Failed'].includes(order.status) && (
                       <>
                         <option value="Confirmed" className="bg-[#0c1110]">Confirmed</option>
                         <option value="Shipped" className="bg-[#0c1110]">Shipped</option>
                         <option value="Delivered" className="bg-[#0c1110]">Delivered</option>
                         <option value="Cancelled" className="bg-[#0c1110]">Cancelled</option>
                       </>
                     )}
                   </select>
                </td>
                <td className="px-8 py-6 text-right">
                   <button
                     onClick={() => handleViewDetails(order)}
                     className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all hover:scale-110"
                   >
                     <ChevronRight size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-8">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/5 px-6 py-4 rounded-[32px]">
           <Pagination
             items={orders}
             itemsPerPage={10}
             onPageChange={handlePagination}
           />
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto scrollbar-hide">
           <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseModal} />
           
           <div className="relative bg-[#0c1110] border border-white/10 rounded-[48px] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row">
              {/* Left Bar - Visual Summary */}
              <div className="md:w-1/3 bg-emerald-500 dark:bg-emerald-500/10 p-12 flex flex-col justify-between border-r border-white/10">
                 <div className="space-y-6">
                    <div className="w-16 h-16 rounded-[24px] bg-black flex items-center justify-center text-emerald-500">
                       <ShoppingBag size={32} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/60 dark:text-emerald-500/60">Order Blueprint</p>
                       <h2 className="text-4xl font-serif text-black dark:text-white tracking-tighter leading-none">#{selectedOrder._id.slice(-6)}</h2>
                    </div>
                 </div>

                 <div className="space-y-4 pt-12">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${selectedOrder.status === 'Delivered' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                       <span className="text-[11px] font-bold uppercase tracking-widest dark:text-white">{selectedOrder.status}</span>
                    </div>
                    <div className="text-[28px] font-serif dark:text-emerald-500 tracking-tighter">₹{selectedOrder.totalAmount.toFixed(0)}</div>
                 </div>
              </div>

              {/* Right Content - Full Data */}
              <div className="flex-grow p-12 space-y-10 max-h-[80vh] overflow-y-auto scrollbar-hide">
                 <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                       <div className="space-y-4">
                          <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 italic">
                             <UserIcon size={12} className="text-emerald-500" />
                             Operative Profile
                          </label>
                          <div className="space-y-1">
                             <p className="text-[15px] font-bold text-white uppercase tracking-widest">{selectedOrder.user.username}</p>
                             <p className="text-[11px] font-mono text-slate-500">{selectedOrder.paymentMethod}</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 italic">
                             <MapPin size={12} className="text-emerald-500" />
                             Dispatch Destination
                          </label>
                          <p className="text-[12px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                             {selectedOrder.shippingAddress.Name}, {selectedOrder.shippingAddress.Locality}<br />
                             {selectedOrder.shippingAddress.District}, {selectedOrder.shippingAddress.State} - {selectedOrder.shippingAddress.Pincode}
                          </p>
                       </div>
                    </div>
                    <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-white transition-colors">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 italic border-b border-white/5 pb-4">
                       <Package size={12} className="text-emerald-500" />
                       Manifest Contents
                    </label>
                    
                    <div className="grid grid-cols-1 gap-4">
                       {selectedOrder.items.map((item) => (
                          <div key={item.productId} className="group flex items-center gap-6 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                             <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                                <img src={item.productImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                             </div>
                             <div className="flex-grow">
                                <p className="text-[11px] font-bold text-white uppercase tracking-widest">{item.productName}</p>
                                <p className="text-[10px] text-slate-500 font-mono tracking-tighter">QTY: {item.quantity} × ₹{item.price}</p>
                             </div>
                             <div className="text-[14px] font-serif text-emerald-500 tracking-tighter">
                                ₹{(item.price * item.quantity * (1 - item.discountPercentage / 100)).toFixed(0)}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <button
                   onClick={handleCloseModal}
                   className="w-full py-5 bg-white/5 text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all"
                 >
                   Archive Session
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
