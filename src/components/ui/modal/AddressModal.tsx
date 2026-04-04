import  { ChangeEvent, FormEvent } from "react";
import Modal from "react-modal";
import { X, MapPin, Check } from "lucide-react";
import { pentaluxeTheme } from "@/theme";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputsArray: { label: string; type: string }[];
  formState: any;
  onInputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  addressType: string;
  setAddressType: (type: string) => void;
  onAddressHandler: (e: any, action: string) => void;
  isEditMode: boolean;
  addressBtnToggle: boolean;
}

Modal.setAppElement("#root");

const AddressModal = ({
  isOpen,
  onClose,
  inputsArray,
  formState,
  onInputHandler,
  addressType,
  setAddressType,
  onAddressHandler,
  isEditMode,
  addressBtnToggle,
}: AddressModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registry of Residence"
      className="relative w-full max-w-2xl bg-black border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] mx-4 focus:outline-none animate-in fade-in zoom-in-95 duration-500 overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[100]"
      style={{
        content: {
          borderRadius: pentaluxeTheme.radius.md || '12px',
        }
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative p-10 z-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 rotate-3 group hover:rotate-0 transition-transform duration-500">
            <MapPin className="w-8 h-8 text-emerald-500" />
          </div>
          <span className="text-[10px] text-emerald-500 tracking-[0.5em] uppercase font-bold mb-2">Location Protocol</span>
          <h2 className="text-4xl font-serif text-white italic text-center">
            {isEditMode ? "Modify" : "New"} <span className="text-emerald-500 italic">Address.</span>
          </h2>
        </div>

        <form onSubmit={(e: FormEvent) => onAddressHandler(e, isEditMode ? "Update" : "Add")} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputsArray.map((input) => (
              <div key={input.label} className="space-y-2">
                <label className="text-[10px] text-emerald-500/50 uppercase tracking-[0.3em] font-bold ml-1 italic">
                  {input.label.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={input.type}
                  name={input.label}
                  value={formState[input.label]}
                  onChange={onInputHandler}
                  className="w-full bg-emerald-500/[0.03] border border-emerald-500/10 text-white text-sm px-5 py-4 rounded-sm focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/5 transition-all placeholder:text-slate-700"
                  placeholder={`Enter ${input.label}...`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
             <label className="text-[10px] text-emerald-500/50 uppercase tracking-[0.3em] font-bold italic">Nomenclature Category</label>
             <div className="flex gap-4">
                {['home', 'work', 'Other'].map((type) => (
                   <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-sm border transition-all duration-500 uppercase text-[10px] font-bold tracking-[0.2em] ${
                         addressType === type 
                         ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                         : "bg-white/5 border-white/5 text-slate-500 hover:border-emerald-500/30"
                      }`}
                   >
                      {addressType === type && <Check size={14} />}
                      {type} 
                   </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 border border-emerald-500/10 text-emerald-500/60 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-500/5 transition-all"
              style={{ borderRadius: pentaluxeTheme.radius.sm || '2px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addressBtnToggle}
              className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                addressBtnToggle 
                ? "bg-emerald-500/10 text-emerald-500/30 cursor-not-allowed border border-emerald-500/5"
                : "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              }`}
              style={{ borderRadius: pentaluxeTheme.radius.sm || '2px' }}
            >
               {addressBtnToggle ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
               ) : (
                  <span>{isEditMode ? "Authorize Update" : "Confirm Registry"}</span>
               )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Modal>
  );
};

export default AddressModal;
