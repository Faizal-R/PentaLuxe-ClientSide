import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Activity, ShieldCheck, Sparkles, RefreshCcw } from "lucide-react";
import Pagination from "@/components/Pagination";
import { WalletService } from "@/services/user/WalletService";

interface ITransactions {
  orderID: string;
  type: string;
  date: string;
  method: string;
  amount: number;
}

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<ITransactions[]>([]);
  const [displayTransactions, setDisplayTransactions] = useState<ITransactions[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWalletData = useCallback(async () => {
    setLoading(true);
    const res = await WalletService.getWallet();
    if (res.success) {
      setTransactions(res.data.transactions || []);
      setBalance(res.data.balance || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handlePagination = (items: ITransactions[]) => {
    setDisplayTransactions(items);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">Wallet Status</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white uppercase italic">My <span className="text-emerald-500">Wallet.</span></h1>
            <p className="text-slate-500 text-sm font-light max-w-lg">
              Securely manage your digital balance for quick and easy payments. Track your credits and debits in real-time.
            </p>
         </div>
         <button 
           onClick={fetchWalletData}
           className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-emerald-500/40 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
         >
           <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
         </button>
      </div>

      {/* Main Balance Card */}
      <div className="relative group overflow-hidden bg-emerald-950/20 border border-emerald-500/20 rounded-sm p-12 backdrop-blur-md">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-500/60 font-bold">Available Balance</p>
               <div className="flex items-baseline gap-4">
                  <span className="text-6xl md:text-8xl font-mono font-bold text-white tracking-tighter">₹{balance?.toFixed(0) || 0}</span>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="p-6 bg-black/40 border border-emerald-500/10 text-center space-y-2 rounded-sm min-w-[140px]">
                  <Activity className="w-4 h-4 text-emerald-500/40 mx-auto" />
                  <p className="text-[9px] uppercase tracking-widest text-slate-600">Account status</p>
                  <p className="text-xs font-mono text-emerald-400 font-bold uppercase">Verified</p>
               </div>
            </div>
         </div>

         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2" />
         <Sparkles className="absolute top-4 right-4 w-6 h-6 text-emerald-500/10 opacity-40" />
      </div>

      {/* Transaction History */}
      <div className="space-y-8">
         <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-4">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h2 className="text-2xl font-serif uppercase">Transaction <span className="text-emerald-500 italic">History</span></h2>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-emerald-500/10">
                     <th className="py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Date</th>
                     <th className="py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Type</th>
                     <th className="py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Method</th>
                     <th className="py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Order ID</th>
                     <th className="py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-emerald-500/5">
                  {loading ? (
                     <tr>
                        <td colSpan={5} className="py-20 text-center">
                           <div className="inline-block w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        </td>
                     </tr>
                  ) : transactions.length > 0 ? (
                     (displayTransactions.length > 0 ? displayTransactions : transactions).map((tx, idx) => (
                        <tr key={idx} className="group hover:bg-emerald-500/[0.02] transition-colors">
                           <td className="py-6 text-xs text-slate-400 font-mono">
                              {new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                           </td>
                           <td className="py-6">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest ${
                                 tx.type === "credit" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                              }`}>
                                 {tx.type === "credit" ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                 {tx.type}
                              </div>
                           </td>
                           <td className="py-6 text-xs text-slate-500 uppercase tracking-widest italic">{tx.method}</td>
                           <td className="py-6 text-xs text-slate-600 font-mono tracking-tighter">#{tx.orderID?.slice(-8) || 'SYSTEM'}</td>
                           <td className={`py-6 text-right font-mono font-bold text-lg ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-200'}`}>
                              {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount?.toFixed(0)}
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-600 text-[10px] uppercase tracking-[0.4em]">No transactions found</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {transactions.length > 0 && (
            <div className="pt-8 flex justify-center border-t border-emerald-500/10">
               <Pagination items={transactions} itemsPerPage={5} onPageChange={handlePagination} />
            </div>
         )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #10b98120; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b98140; }
      `}</style>
    </div>
  );
};

export default WalletPage;

