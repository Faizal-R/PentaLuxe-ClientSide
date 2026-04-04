import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, AlertCircle } from 'lucide-react';
import { pentaluxeTheme } from '@/theme';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, reason: string, payment: string) => void;
  item: string;
  type: string;
  payment: string;
}

Modal.setAppElement('#root');

const CancellationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  item, 
  type, 
  payment 
}: CancellationModalProps) => {
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (reason) {
      onSubmit(item, reason, payment);
      onClose();
    }
  };

  const modalTitle = type === 'cancel' ? 'Cancel Your Order' : 'Return Your Item';
  const modalMessage = type === 'cancel'
    ? 'We’re sorry to see you go! Please let us know why you are cancelling:'
    : 'We’re here to help! Please let us know why you want to return:';

  const titleParts = modalTitle.split(' ');
  const lastWord = titleParts.pop();
  const titlePrefix = titleParts.join(' ');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative w-full max-w-lg overflow-hidden bg-black border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.15)] mx-4 focus:outline-none animate-in fade-in zoom-in-95 duration-500"
      overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100]"
      style={{
        content: {
          borderRadius: pentaluxeTheme.radius.md || '8px',
        }
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative p-10 z-10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-emerald-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <AlertCircle className="w-6 h-6 text-emerald-500" />
           </div>
           <span className="text-[10px] text-emerald-500 tracking-[0.4em] uppercase font-bold mb-2">Request Protocol</span>
           <h2 className="text-3xl font-serif text-white uppercase italic text-center leading-tight">
             {titlePrefix} <span className="text-emerald-500 italic">{lastWord}.</span>
           </h2>
        </div>

        <p className="text-center text-slate-400 text-sm font-light mb-8 leading-relaxed max-w-xs mx-auto">
          {modalMessage}
        </p>

        <div className="space-y-6">
          <div className="relative">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-14 px-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-sm text-white text-xs tracking-widest uppercase font-bold focus:outline-none focus:border-emerald-500/40 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0c1110]">-- Select Reason --</option>
              {type === 'cancel' && (
                <>
                  <option value="Changed my mind" className="bg-[#0c1110]">Changed my mind</option>
                  <option value="Item not as described" className="bg-[#0c1110]">Item not as described</option>
                  <option value="Found a better price" className="bg-[#0c1110]">Found a better price</option>
                  <option value="Delay in delivery" className="bg-[#0c1110]">Delay in delivery</option>
                  <option value="Other" className="bg-[#0c1110]">Other</option>
                </>
              )}
              {type === 'return' && (
                <>
                  <option value="Defective item" className="bg-[#0c1110]">Defective item</option>
                  <option value="Wrong item received" className="bg-[#0c1110]">Wrong item received</option>
                  <option value="Sizing issues" className="bg-[#0c1110]">Sizing issues</option>
                  <option value="Other" className="bg-[#0c1110]">Other</option>
                </>
              )}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/40">
              <span className="text-[8px]">▼</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="w-full py-4 px-6 border border-emerald-500/10 text-emerald-500/60 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-500/5 transition-all"
              style={{ borderRadius: pentaluxeTheme.radius.sm || '2px' }}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason}
              className={`w-full py-4 px-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                reason 
                ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]" 
                : "bg-emerald-500/10 text-emerald-500/30 cursor-not-allowed border border-emerald-500/5"
              }`}
              style={{ borderRadius: pentaluxeTheme.radius.sm || '2px' }}
            >
              Submit {type === 'cancel' ? 'Cancel' : 'Return'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </Modal>
  );
};

export default CancellationModal;
