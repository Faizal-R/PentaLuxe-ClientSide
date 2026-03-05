import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "@/components/Input/Input";
import { addressValidation } from "@/utils/AddressValidation";
import { ProfileService } from "@/services/user/ProfileService";
import { errorToast } from "@/utils/customToast";
import { pentaluxeTheme } from "@/theme";
import { MapPin, ArrowLeft, ShieldCheck, Sparkles, Save } from "lucide-react";

interface InputField {
  label: FormKeys;
  type: string;
}

const inputsArray: InputField[] = [
  { label: "Name", type: "text" },
  { label: "Phone", type: "number" },
  { label: "Pincode", type: "number" },
  { label: "Locality", type: "text" },
  { label: "FlatNumberOrBuildingName", type: "text" },
  { label: "Landmark", type: "text" },
  { label: "State", type: "text" },
  { label: "District", type: "text" },
];

type FormKeys =
  | "Name"
  | "Phone"
  | "Pincode"
  | "Locality"
  | "FlatNumberOrBuildingName"
  | "Landmark"
  | "District"
  | "State";

const AddAndEditAddress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [addressType, setAddressType] = useState("home");
  const [isUpdating, setIsUpdating] = useState(false);
  const [formState, setFormState] = useState<Record<FormKeys, string>>({
    Name: "",
    Phone: "",
    Pincode: "",
    Locality: "",
    FlatNumberOrBuildingName: "",
    Landmark: "",
    District: "",
    State: "",
  });

  const onAddressHandler = async (e: FormEvent, action: string) => {
    e.preventDefault();
    const validationError = addressValidation(formState);
    if (validationError) {
      errorToast(validationError); 
      return;
    }

    setIsUpdating(true);
    let res;
    if (action === "Add") {
      res = await ProfileService.addAddress({
        formState,
        addressType,
      });
    } else {
      res = await ProfileService.updateAddress({
        formState,
        addressType,
        addressId: id
      });
    }

    if (res.success) {
      navigate("/profile/address-book");
    }
    setIsUpdating(false);
  };

  const onInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name as FormKeys]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      const fetchAddress = async () => {
        const res = await ProfileService.getAddressById(id);
        if (res.success) {
          setFormState(res.data);
          setAddressType(res.data.addressType);
        }
      };
      fetchAddress();
    }
  }, [id]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Protocol Archive</span>
           </div>
           <h1 className="text-3xl md:text-5xl font-serif text-white uppercase italic">
             {id ? <>Edit <span className="text-emerald-500">Registry.</span></> : <>Add New <span className="text-emerald-500">Location.</span></>}
           </h1>
           <p className="text-slate-500 text-xs font-light max-w-xl">
             Enter precise coordinate data for your preferred manifestation destination. All addresses are encrypted within your private Pentaluxe vault.
           </p>
        </div>

        <Link 
          to="/profile/address-book"
          className="group flex items-center gap-3 text-emerald-500/40 hover:text-emerald-500 transition-colors uppercase text-[10px] tracking-[0.4em] font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort Changes
        </Link>
      </div>

      {/* Form Container */}
      <div className="bg-emerald-950/[0.03] border border-emerald-500/10 p-8 sm:p-12 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700" style={{ borderRadius: pentaluxeTheme.button.radius }}>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <form onSubmit={(e) => onAddressHandler(e, id ? "Edit" : "Add")} className="space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {inputsArray.map((input) => (
              <Input
                key={input.label}
                value={formState[input.label]}
                text={input.label}
                type={input.type}
                inputHandler={onInputHandler}
              />
            ))}
          </div>

          {/* Address Type Selection */}
          <div className="space-y-6 pt-4 border-t border-emerald-500/5">
            <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500/60 italic">
               <ShieldCheck className="w-3.5 h-3.5" />
               Classification Selection
            </h3>
            
            <div className="flex flex-wrap gap-4">
              {["home", "work", "Other"].map((type) => (
                <label 
                  key={type}
                  className={`flex-grow md:flex-grow-0 min-w-[120px] relative cursor-pointer group/label`}
                >
                  <input
                    type="radio"
                    name="addressType"
                    value={type}
                    checked={addressType === type}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className={`
                    w-full px-6 py-4 flex items-center justify-center gap-3 border transition-all duration-500 rounded-xl
                    peer-checked:bg-emerald-600 peer-checked:border-emerald-500 peer-checked:text-black
                    bg-white/[0.02] border-white/5 text-slate-500 hover:border-emerald-500/20 hover:text-white
                    shadow-[inset_0_0_20px_transparent] peer-checked:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                  `}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{type}</span>
                    <div className="w-1 h-1 rounded-full bg-current opacity-20 peer-checked:opacity-100" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-8">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-16 py-4 bg-emerald-600 text-black text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-4 group/btn rounded-sm disabled:opacity-50"
            >
              {isUpdating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />}
              {id ? "Commit Updates" : "Register Address"}
            </button>
            <Link
              to="/profile/address-book"
              className="px-8 py-4 bg-transparent border border-emerald-500/10 text-emerald-500/40 text-[11px] font-bold uppercase tracking-[0.4em] hover:text-emerald-500 hover:border-emerald-500/40 transition-all rounded-sm flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default AddAndEditAddress;

