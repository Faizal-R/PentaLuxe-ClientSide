import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHttpStatusCodes } from "@/types/statusCode";
import api from "@/services/apiService";
import DeleteModal from "@/components/ui/modal/DeleteModal";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { pentaluxeTheme } from "@/theme";
import { MapPin, Plus, Edit3, Trash2, Globe, Phone, Map, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
  };

  const getAllAddresses = async () => {
    try {
      const res = await api.get(USER_API_ROUTES.ADDRESS_BOOK.GET);
      if (res.status === AppHttpStatusCodes.OK) {
        setAddresses(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load address book");
    }
  };

  const onAddressDelete = async () => {
    try {
      const res = await api.delete(USER_API_ROUTES.ADDRESS_BOOK.DELETE_ADDRESS_BOOK(ItemId));
      if (res.status === AppHttpStatusCodes.OK) {
        setAddresses((prev) => prev.filter(a => a._id !== ItemId));
        toast.success("Address deleted successfully");
        isModalClose();
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete address");
    }
  };

  useEffect(() => {
    getAllAddresses();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-3">
         <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Address Book</span>
         </div>
         <h1 className="text-3xl md:text-4xl font-serif text-white uppercase italic">Manage <span className="text-emerald-500">Addresses.</span></h1>
         <p className="text-slate-500 text-xs font-light max-w-xl">
           Save multiple shipping addresses for a faster checkout experience. Your default address will be selected automatically for new orders.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* Add New Address Card */}
        <Link 
          to="/profile/address-book/add"
          className="group relative flex flex-col items-center justify-center p-8 min-h-[300px] border-2 border-dashed border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all"
          style={{ borderRadius: pentaluxeTheme.button.radius }}
        >
          <div className="p-4 rounded-full bg-emerald-500/5 text-emerald-500/40 group-hover:text-emerald-500 group-hover:shadow-[0_0_20px_#10b98120] transition-all mb-4">
             <Plus className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500 group-hover:text-emerald-500">Add New Address</span>
          
          <div className="absolute inset-0 border border-transparent group-hover:border-emerald-500/10 transition-all pointer-events-none" />
        </Link>

        {addresses.map((addr) => (
          <div 
            key={addr._id} 
            className="group relative bg-emerald-950/[0.03] border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 p-8 flex flex-col justify-between space-y-8 overflow-hidden"
            style={{ borderRadius: pentaluxeTheme.button.radius }}
          >
            {/* Type Badge */}
            <div className="flex justify-between items-start">
               <div 
                className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest"
                style={{ borderRadius: pentaluxeTheme.radius.sm }}
               >
                  {addr.addressType}
                </div>
               <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/profile/address-book/${addr._id}`} className="text-slate-500 hover:text-emerald-500">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => isModalOpen(addr._id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Address Content */}
            <div className="space-y-6">
               <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-white">{addr.Name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono italic">
                    <Map className="w-3 h-3 text-emerald-500/40" />
                    Verified Address
                  </div>
               </div>

               <div className="space-y-2 text-sm text-slate-400 font-light leading-relaxed">
                  <p>{addr.FlatNumberOrBuildingName}, {addr.Locality}</p>
                  <p>{addr.Landmark}</p>
                  <p className="flex items-center gap-4">
                    <span className="font-bold text-white uppercase tracking-tighter">{addr.District}</span>
                    <span className="h-1 w-1 rounded-full bg-emerald-500/40" />
                    <span className="font-bold text-white uppercase tracking-tighter">{addr.State}</span>
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-emerald-500/60">
                    <Globe className="w-3 h-3" />
                    <span className="text-[10px] font-mono tracking-widest">IND — {addr.Pincode}</span>
                  </div>
               </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-6 border-t border-emerald-500/5 flex items-center justify-between">
               <div className="flex items-center gap-3 text-slate-500">
                  <Phone className="w-3 h-3 text-emerald-500/40" />
                  <span className="text-xs font-mono">{addr.Phone}</span>
               </div>
               <ShieldCheck className="w-4 h-4 text-emerald-500/20" />
            </div>

            {/* Background Aesthetic */}
            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <MapPin className="w-32 h-32" />
            </div>
          </div>
        ))}
      </div>

      <DeleteModal
        isOpen={isModal}
        onRequestClose={isModalClose}
        item={ItemId}
        onDelete={onAddressDelete}
        text="Are you sure you want to remove this address?"
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
