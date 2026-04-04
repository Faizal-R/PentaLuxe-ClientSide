
import Modal from 'react-modal';
import { AlertTriangle, X } from 'lucide-react';
import { pentaluxeTheme } from '@/theme';

interface IDeleteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  item?: string;
  onDelete: (id: string) => void;
  text: string;
  title?: string;
}

Modal.setAppElement('#root');

const DeleteModal = ({
  isOpen,
  onRequestClose,
  item,
  onDelete,
  text,
  title
}: IDeleteModalProps) => {
  // Prevent redundant "Deletion" suffix if title already suggests it
  const displayTitle = title || "Confirm";
  const showSuffix = !title || (!title.toLowerCase().includes('delete') && !title.toLowerCase().includes('remove'));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Confirmation"
      className="relative w-full max-w-sm overflow-hidden bg-black border border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.1)] mx-4 focus:outline-none animate-in fade-in zoom-in-95 duration-300"
      overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100]"
      style={{
        content: {
          borderRadius: pentaluxeTheme.radius.md || '12px',
        }
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative p-8 z-10">
        <button 
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <span className="text-[10px] text-red-500 tracking-[0.4em] uppercase font-bold mb-2">Security Protocol</span>
          <h2 className="text-2xl font-serif text-white uppercase italic text-center leading-tight">
            {displayTitle} {showSuffix && <span className="text-red-500 italic">Deletion.</span>}
          </h2>
        </div>

        <p className="text-center text-slate-400 text-sm font-light mb-8 leading-relaxed">
          {text}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="w-full py-3 px-4 border border-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all"
            style={{ borderRadius: pentaluxeTheme.radius.sm || '2px' }}
            onClick={onRequestClose}
          >
            Cancel
          </button>
          <button
            className="w-full py-3 px-4 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            style={{ borderRadius: pentaluxeTheme.radius.sm || '2px' }}
            onClick={() => {
              if (item) onDelete(item);
              onRequestClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </Modal>
  );
};

export default DeleteModal;
