import { Link, useLocation } from 'react-router-dom';
import { pentaluxeTheme } from '@/theme';
import { CheckCircle2, ShoppingBag, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const deliveryDate = location.state?.DeliveryDate;

  return (
    <div 
      className="flex flex-col items-center justify-center py-12 px-6 font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      <div className="max-w-xl w-full space-y-8 text-center animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Success Icon Stage */}
        <div className="relative inline-block">
           <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full animate-pulse" />
           <div className="relative p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" strokeWidth={1} />
              <Sparkles className="absolute top-2 right-2 w-6 h-6 text-emerald-300 animate-bounce" />
           </div>
        </div>

        {/* Narrative */}
        <div className="space-y-4">
           <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
              <span className="text-emerald-500 tracking-[0.5em] uppercase text-[10px] font-bold">Order Confirmed</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-serif text-white uppercase italic">Thank <span className="text-emerald-500">You.</span></h1>
           <p className="text-slate-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
             Your order has been successfully placed. We're now preparing it for shipment.
           </p>
        </div>

        {/* Info Block */}
        <div className="p-6 bg-emerald-950/[0.03] border border-emerald-500/10 rounded-sm space-y-6 backdrop-blur-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-emerald-500/10">
              <div className="space-y-1 pb-6 md:pb-0">
                 <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Order ID</p>
                 <p className="text-lg font-mono text-white tracking-widest uppercase">#{orderId?.slice(-12).toUpperCase() || 'PENTALUXE-666'}</p>
              </div>
              <div className="space-y-1 pt-6 md:pt-0 md:pl-6">
                 <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Expected Delivery</p>
                 <p className="text-lg font-mono text-emerald-500 font-bold uppercase">
                    {deliveryDate ? new Date(deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "3-5 Days"}
                 </p>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
           <Link 
             to='/profile/orders' 
             className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 "
           >
             Track Order <ShoppingBag className="w-4 h-4" />
           </Link>
           <Link 
             to='/products' 
             className="w-full sm:w-auto px-8 py-4 border border-emerald-500/20 text-emerald-500 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-500/5 hover:border-emerald-500 transition-all flex items-center justify-center gap-3"
           >
             Continue Shopping <ArrowRight className="w-4 h-4" />
           </Link>
        </div>

        {/* Fine Print */}
        <p className="text-[9px] text-slate-600 uppercase tracking-[0.2em]">
           A confirmation email has been sent to your registered address.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;