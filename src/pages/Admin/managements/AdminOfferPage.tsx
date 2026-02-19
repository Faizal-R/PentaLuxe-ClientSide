
import React, { FormEvent, useEffect, useState } from "react";
import { IProduct } from "@/types/productTypes";
import { ICategories } from "../product-category/AdminCategoryPage";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";
import { 
  Plus, 
  Percent, 
  Layers, 
  ShoppingBag, 
  ChevronRight, 
  ShieldCheck, 
  BarChart3,
  ListFilter
} from "lucide-react";

interface IOffers {
  offerFor: IProduct | ICategories;
  offerType: string;
  DiscountPercentage: number;
  _id: string;
}

const AdminOfferPage: React.FC = () => {
  const [offers, setOffers] = useState<IOffers[]>([]);
  const [offerType, setOfferType] = useState("");
  const [DiscountPercentage, setDiscountPercentage] = useState("");
  const [offerItems, setOfferItems] = useState<IProduct[] | ICategories[]>([]);
  const [selectedOfferItem, setSelectedOfferItem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOfferSubmission = async (e: FormEvent) => {
    e.preventDefault();
    if (!offerType || !DiscountPercentage || !selectedOfferItem) {
      toast.error("Integrity error: Configuration data incomplete.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = offerType === "product"
        ? ADMIN_API_ROUTES.OFFERS_MANAGEMENT.UPDATE_PRODUCT_OFFER
        : ADMIN_API_ROUTES.OFFERS_MANAGEMENT.UPDATE_CATEGORY_OFFER;
      
      const response = await api.patch(endpoint, {
        DiscountPercentage,
        itemId: selectedOfferItem,
      });

      if (response.status === AppHttpStatusCodes.OK) {
        toast.success("Revenue protocol updated.");
        setOfferType("");
        setDiscountPercentage("");
        setSelectedOfferItem("");
        listOffers();
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message || "Protocol override failed.");
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = React.useCallback(async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.GET_ALL);
      if (res.data.success) setOfferItems(res.data.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) navigate("/admin");
    }
  }, [navigate]);

  const getCategories = React.useCallback(async () => {
    try {
      const response = await api.get(ADMIN_API_ROUTES.CATEGORIES_MANAGEMENT.GET);
      if (response.data.success) setOfferItems(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) navigate("/admin");
    }
  }, [navigate]);

  const listOffers = React.useCallback(async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.OFFERS_MANAGEMENT.GET_ALL);
      if (res.status === AppHttpStatusCodes.OK) setOffers(res.data.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    listOffers();
  }, [listOffers]);

  useEffect(() => {
    if (offerType) {
      offerType === "product" ? getAllProducts() : getCategories();
    }
  }, [offerType, getAllProducts, getCategories]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Revenue Strategy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Yield Optimization</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Module */}
        <div className="lg:col-span-4 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 shadow-2xl space-y-8">
           <div className="space-y-2">
             <h2 className="text-2xl font-serif text-white tracking-tight">Configuration</h2>
             <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Offer Injection Protocol</p>
           </div>

           <form onSubmit={handleOfferSubmission} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1 italic flex items-center gap-2">
                   <ListFilter size={10} className="text-emerald-500" />
                   Target Classification
                 </label>
                 <select
                   value={offerType}
                   onChange={(e) => {
                     setOfferType(e.target.value);
                     setSelectedOfferItem("");
                   }}
                   className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold tracking-widest cursor-pointer appearance-none"
                 >
                   <option value="" className="bg-[#0c1110]">UNDOCUMENTED</option>
                   <option value="product" className="bg-[#0c1110]">PRODUCT UNIT</option>
                   <option value="category" className="bg-[#0c1110]">TAXONOMY GROUP</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1 italic flex items-center gap-2">
                   <Plus size={10} className="text-emerald-500" />
                   Subject Selection
                 </label>
                 <select
                   disabled={!offerType}
                   value={selectedOfferItem}
                   onChange={(e) => setSelectedOfferItem(e.target.value)}
                   className={`w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold tracking-widest cursor-pointer appearance-none ${!offerType ? 'opacity-30' : ''}`}
                 >
                   <option value="" className="bg-[#0c1110] italic">SELECT SUBJECT</option>
                   {offerItems.map((item) => (
                     <option key={item._id} value={item._id} className="bg-[#0c1110]">
                       {offerType === "product" ? (item as IProduct).Name : (item as ICategories).categoryName}
                     </option>
                   ))}
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1 italic flex items-center gap-2">
                   <Percent size={10} className="text-emerald-500" />
                   Yield Variance (%)
                 </label>
                 <div className="relative">
                    <input
                      type="number"
                      placeholder="00"
                      value={DiscountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[13px] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold tracking-[0.2em] placeholder:text-slate-800"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500/40 font-bold">PHASE.SIG</span>
                 </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-50"
              >
                <ChevronRight size={16} />
                {loading ? "COMMITTING..." : "COMMIT VARIANCE"}
              </button>
           </form>
        </div>

        {/* List Module */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <BarChart3 size={20} />
                 </div>
                 <span className="text-xl font-serif text-white">Active Incentives</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest">REGISTRY.LIVE_OVERRIDE</span>
           </div>

           <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Classification</th>
                  <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Operational Unit</th>
                  <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Discount Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {offers.map((offer) => (
                  <tr key={offer._id} className="group hover:bg-emerald-500/[0.02] transition-colors duration-500">
                    <td className="px-8 py-6">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          {offer.offerType === 'Category' ? <Layers size={10} /> : <ShoppingBag size={10} />}
                          {offer.offerType}
                       </div>
                    </td>
                    <td className="px-8 py-6 uppercase">
                       <p className="text-[13px] font-bold text-white tracking-widest group-hover:text-emerald-500 transition-colors">
                         {offer.offerType === 'Category' ? (offer.offerFor as ICategories).categoryName : (offer.offerFor as IProduct).Name}
                       </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="text-2xl font-serif text-emerald-500 tracking-tighter group-hover:scale-110 inline-block transition-transform duration-500">{offer.DiscountPercentage}%</span>
                    </td>
                  </tr>
                ))}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center opacity-20 italic">
                       <ShieldCheck size={48} className="mx-auto mb-4" />
                       <p className="text-[11px] uppercase tracking-[0.4em] font-bold">No variance detected in registry</p>
                    </td>
                  </tr>
                )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOfferPage;
