import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "@/components/ui/modal/DeleteModal";
import { pentaluxeTheme } from "@/theme";
import { MapPin, Plus, Edit3, Trash2, Globe, Phone } from "lucide-react";
import { ProfileService } from "@/services/user/ProfileService";

interface IAddress {
  _id: string;
  Name: string;
  Phone: string;
  Pincode: string;
  Locality: string;
  FlatNumberOrBuildingName: string;
  Landmark: string;
  District: string;
  State: string;
  addressType: string;
}

const Address = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [ItemId, setItemId] = useState("");

  const isModalOpen = (id: string) => {
    setIsModal(true);
    setItemId(id);
  };

  const isModalClose = () => {
    setIsModal(false);
    setItemId("");
  };

  const getAllAddresses = async () => {
    const res = await ProfileService.getAddressBook();
    if (res.success) {
      setAddresses(res.data);
    }
  };

  const onAddressDelete = async () => {
    const res = await ProfileService.deleteAddress(ItemId);
    if (res.success) {
      setAddresses((prev) => prev.filter(a => a._id !== ItemId));
      isModalClose();
    }
  };

  useEffect(() => {
    getAllAddresses();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="space-y-4">
         <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Address Book Registry</span>
         </div>
         <h1 className="text-3xl md:text-5xl font-serif text-white uppercase italic">Manage <span className="text-emerald-500 underline decoration-1 underline-offset-8">Addresses.</span></h1>
         <p className="text-slate-500 text-xs font-light max-w-xl leading-relaxed">
           Vault your extraction destinations for accelerated protocol execution. All locations are secured with high-grade encryption for your privacy.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
        
        {/* Add New Address Card - Premium Style */}
        <Link 
          to="/profile/address-book/add"
          className="group relative flex flex-col items-center justify-center p-8 min-h-[320px] bg-emerald-500/[0.01] border border-dashed border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] transition-all duration-700 overflow-hidden"
          style={{ borderRadius: pentaluxeTheme.button.radius }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-700 mb-6">
             <Plus className="w-8 h-8" />
          </div>
          <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 group-hover:text-emerald-400 transition-colors">Record New Destination</span>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-emerald-500/20 group-hover:w-1/2 transition-all duration-700" />
        </Link>

        {addresses.map((addr) => (
          <div 
            key={addr._id} 
            className="group relative bg-emerald-950/[0.03] border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-700 p-8 flex flex-col justify-between space-y-10 overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40"
            style={{ borderRadius: pentaluxeTheme.button.radius }}
          >
            {/* Top Indicator & Label */}
            <div className="flex justify-between items-start">
               <div 
                className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]"
                style={{ borderRadius: pentaluxeTheme.radius.full }}
               >
                  {addr.addressType} Registry
                </div>
               <div className="flex gap-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <Link to={`/profile/address-book/${addr._id}`} className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/20 transition-all">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => isModalOpen(addr._id)} className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-red-400 hover:border-red-400/20 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Address Content - Premium Typography */}
            <div className="space-y-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-[1px] bg-emerald-500/40" />
                    <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-emerald-500/40 font-mono italic">Verified Coordinate</span>
                  </div>
                  <h3 className="text-2xl font-serif text-white tracking-wide group-hover:text-emerald-400 transition-colors">{addr.Name}</h3>
               </div>

               <div className="space-y-4 text-[13px] text-slate-400 font-light leading-relaxed">
                  <p className="opacity-80">{addr.FlatNumberOrBuildingName}, {addr.Locality}</p>
                  <p className="opacity-80 italic">{addr.Landmark}</p>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex flex-col">
                       <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">District</span>
                       <span className="font-bold text-white uppercase tracking-tighter text-sm">{addr.District}</span>
                    </div>
                    <div className="w-[1px] h-6 bg-emerald-500/10" />
                    <div className="flex flex-col">
                       <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">State</span>
                       <span className="font-bold text-white uppercase tracking-tighter text-sm">{addr.State}</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Contact Footer - Technical Info */}
            <div className="pt-6 border-t border-emerald-500/5 flex items-center justify-between">
               <div className="flex items-center gap-3 group/phone">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/5 flex items-center justify-center text-emerald-500/40 group-hover/phone:text-emerald-500 group-hover/phone:bg-emerald-500/10 transition-all">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 tracking-tighter">{addr.Phone}</span>
               </div>
               
               <div className="flex items-center gap-2 text-emerald-500/40">
                  <Globe className="w-3 h-3" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">IND — {addr.Pincode}</span>
               </div>
            </div>

            {/* Subsurface Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:-translate-y-2 group-hover:-translate-x-2">
               <MapPin className="w-32 h-32" />
            </div>
            
            {/* Corner Accent */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500/40 transition-all duration-700 group-hover:w-full" />
          </div>
        ))}
      </div>

      <DeleteModal
        isOpen={isModal}
        onRequestClose={isModalClose}
        item={ItemId}
        onDelete={onAddressDelete}
        text="Are you sure you want to purge this record from the archive?"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default Address;
