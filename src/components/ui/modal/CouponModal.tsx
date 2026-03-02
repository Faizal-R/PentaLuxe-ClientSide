import { ICoupon } from "@/pages/Admin/managements/AdminCouponManagementPage";
import React, { useState } from "react";
import ReactModal from "react-modal";
import { errorToast } from "@/utils/customToast";
import { X, Ticket, Calendar, Zap, ShoppingBag, Percent, ChevronRight } from "lucide-react";
import { PulseLoader } from "react-spinners";

interface ICouponModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCouponData: (couponData: ICoupon) => void;
  initialData?: ICoupon | null;
}

ReactModal.setAppElement("#root");

const CouponModal = ({
  isModalOpen,
  setIsModalOpen,
  handleCouponData,
  initialData,
}: ICouponModalProps) => {
  const [couponName, setCouponName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxDiscountPrice, setMaxDiscountPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number | string>("");
  const [minimumPurchasePrice, setMinimumPurchasePrice] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setCouponName(initialData.couponName);
      const date = new Date(initialData.expiryDate);
      const formattedDate = date.toISOString().split("T")[0];
      setExpiryDate(formattedDate);
      setMaxDiscountPrice(initialData.maxDiscountPrice.toString());
      setDiscountPercentage(initialData.discountPercentage.toString());
      setMinimumPurchasePrice(initialData.minimumPurchasePrice.toString());
    } else {
      setCouponName("");
      setExpiryDate("");
      setMaxDiscountPrice("");
      setDiscountPercentage("");
      setMinimumPurchasePrice("");
    }
  }, [initialData, isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSendCouponAndCloseModal = async () => {
    if (!couponName) {
      errorToast("Coupon name is required.");
      return;
    }
    if (!expiryDate) {
      errorToast("Expiry date is required.");
      return;
    }

    const currentDate = new Date();
    const selectedExpiryDate = new Date(expiryDate);
    if (!initialData && selectedExpiryDate <= currentDate) {
      errorToast("Expiry date should be greater than the current date.");
      return;
    }
    if (
      !discountPercentage ||
      Number(discountPercentage) <= 0 ||
      Number(discountPercentage) >= 100
    ) {
      errorToast("Discount percentage should be between 0 and 100.");
      return;
    }

    if (!maxDiscountPrice || Number(maxDiscountPrice) <= 0) {
      errorToast("Max discount price must be a positive value.");
      return;
    }
    if (!minimumPurchasePrice || Number(minimumPurchasePrice) <= 0) {
      errorToast("Minimum purchase price must be a positive value.");
      return;
    }

    setLoading(true);
    const DataToSend = {
      ...initialData,
      couponName: couponName.toUpperCase(),
      expiryDate,
      maxDiscountPrice,
      discountPercentage,
      minimumPurchasePrice,
    };

    handleCouponData(DataToSend);
    setLoading(false);

    if (!initialData) {
      setCouponName("");
      setExpiryDate("");
      setMaxDiscountPrice("");
      setDiscountPercentage("");
      setMinimumPurchasePrice("");
    }
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel={initialData ? "Refine Voucher" : "Initialize Voucher"}
      className="bg-[#0c1110] backdrop-blur-3xl p-0 rounded-[48px] shadow-2xl max-w-lg w-full relative outline-none border border-white/10 overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100]"
    >
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
         <div className="flex items-center gap-3">
            <Ticket className="text-emerald-500 w-5 h-5" />
            <h2 className="text-2xl font-serif text-white tracking-tight">
              {initialData ? "Refine Voucher" : "Initialize Voucher"}
            </h2>
         </div>
         <button onClick={closeModal} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
         </button>
      </div>

      <div className="p-10 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide">
         <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Archive Nomenclature</label>
            <div className="relative">
              <input
                type="text"
                placeholder="EX: BLACKFRIDAY2024"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 font-bold tracking-widest uppercase"
              />
              <Zap className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/20" />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Yield Variance (%)</label>
               <div className="relative">
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-emerald-500 focus:outline-none focus:border-emerald-500/50 transition-all font-mono font-bold"
                  />
                  <Percent className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/20" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Threshold Required</label>
               <div className="relative">
                  <input
                    type="number"
                    value={minimumPurchasePrice}
                    onChange={(e) => setMinimumPurchasePrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                  />
                  <ShoppingBag className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500/20" />
               </div>
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Cap Value (Max Discount)</label>
            <input
              type="number"
              value={maxDiscountPrice}
              onChange={(e) => setMaxDiscountPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
            />
         </div>

         <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Lifecycle Termination</label>
            <div className="relative">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
              />
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500/20 pointer-events-none" />
            </div>
         </div>

         <div className="pt-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSendCouponAndCloseModal();
              }}
              disabled={loading}
              className="w-full py-5 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
            >
              {loading ? <PulseLoader color="black" size={8} /> : (
                <>
                  <ChevronRight size={16} />
                  {initialData ? "Refine Protocol" : "Authorize Voucher"}
                </>
              )}
            </button>
         </div>
      </div>
    </ReactModal>
  );
};

export default CouponModal;
