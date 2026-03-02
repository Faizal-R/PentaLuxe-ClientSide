
import CouponModal from "@/components/ui/modal/CouponModal";
import Pagination from "@/components/Pagination";
import React, { useEffect, useState } from "react";
import { AdminCouponService } from "@/services/admin/AdminCouponService";
import { successToast } from "@/utils/customToast";
import { 
  Ticket, 
  Trash2, 
  Plus, 
  Calendar, 
  Zap, 
  ShoppingBag, 
  ShieldCheck,
  Edit2
} from "lucide-react";

export interface ICoupon {
  _id?: string;
  couponName: string;
  expiryDate: string;
  maxDiscountPrice: string;
  discountPercentage: number | string;
  minimumPurchasePrice: number | string;
}

const CouponManagement: React.FC = () => {
  const [modalStatus, setModalStatus] = useState(false);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [displayCoupons, setDispalyCoupons] = useState<ICoupon[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

  const removeCoupon = async (couponId: string) => {
    const res = await AdminCouponService.deleteCoupon(couponId);
    if (res.success) {
      successToast("Voucher purged from registry.");
      setCoupons(coupons.filter((c) => c._id !== couponId));
    }
  };

  const handleCouponData = async (couponData: ICoupon) => {
    if (editingCoupon) {
      const res = await AdminCouponService.updateCoupon(editingCoupon._id!, couponData);
      if (res.success) {
        setCoupons(coupons.map(c => c._id === editingCoupon._id ? res.data : c));
        setModalStatus(false);
        setEditingCoupon(null);
        successToast("Voucher configuration updated.");
      }
    } else {
      const res = await AdminCouponService.createCoupon(couponData);
      if (res.success) {
        const coupon = res.data;
        setModalStatus(false);
        setCoupons((prev) => [...prev, coupon]);
        successToast("Voucher protocol established.");
      }
    }
  };

  const getAllCoupons = async () => {
    const res = await AdminCouponService.getAllCoupons();
    if (res.success) {
      setCoupons(res.data);
    }
  };

  const handlePagination = (items: ICoupon[]) => setDispalyCoupons(items);

  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Incentive Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Voucher Archive</h1>
        </div>

        <button
          onClick={() => {
            setEditingCoupon(null);
            setModalStatus(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Initialize Voucher</span>
        </button>
      </div>

      <CouponModal
        isModalOpen={modalStatus}
        setIsModalOpen={setModalStatus}
        handleCouponData={handleCouponData}
        initialData={editingCoupon}
      />

      {/* Vouchers Grid */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Code Token</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Discount</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Threshold</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Lifecycle</th>
              <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Registry Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {(displayCoupons.length > 0 ? displayCoupons : coupons).map((coupon) => (
              <tr key={coupon._id} className="group hover:bg-emerald-500/[0.02] transition-all duration-500">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <Ticket size={14} className="text-emerald-500/40" />
                      <span className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">{coupon.couponName}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                         <span className="text-xl font-serif text-emerald-500 tracking-tighter">{coupon.discountPercentage}%</span>
                         <Zap size={10} className="text-emerald-500/40" />
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Max ₹{coupon.maxDiscountPrice} Off</p>
                   </div>
                </td>
                <td className="px-8 py-6 text-slate-400 group-hover:text-white transition-colors">
                   <div className="flex items-center gap-2">
                      <ShoppingBag size={12} className="text-emerald-500/40" />
                      <span className="text-[11px] font-mono tracking-widest">MIN: ₹{coupon.minimumPurchasePrice}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2 overflow-hidden">
                      <Calendar size={12} className="text-emerald-500/40" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        }) : "Exhausted"}
                      </span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setModalStatus(true);
                        }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all hover:scale-110"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeCoupon(coupon._id ?? "")}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
               <tr>
                 <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="space-y-3 opacity-20">
                       <ShieldCheck size={48} className="mx-auto" />
                       <p className="text-[11px] uppercase tracking-[0.4em] font-bold">Registry Clear: No Vouchers Active</p>
                    </div>
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-8">
         <Pagination
           items={coupons}
           itemsPerPage={5}
           onPageChange={handlePagination}
         />
      </div>
    </div>
  );
};

export default CouponManagement;
