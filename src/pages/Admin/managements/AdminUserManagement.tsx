import React, { ChangeEvent, useEffect, useState } from "react";
import { toast, dismissToast } from "@/utils/customToast";
import { IAddress } from "@/types/AddressTypes";
import Pagination from "@/components/Pagination";
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Phone, 
  Mail,
  User as UserIcon,
  Lock,
  Unlock
} from "lucide-react";
import { AdminUserService } from "@/services/admin/AdminUserService";

interface IUser {
  _id: string;
  username: string;
  email: string;
  addresses?: IAddress[];
  phone: number;
  status: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]); 
  const [displayedUsers, setDisplayedUsers] = useState<IUser[]>([]);
  const [input, setInput] = useState('');

  const handlePagination = (users: IUser[]) => {
    setDisplayedUsers(users);
  };

  const getAllUsers = React.useCallback(async () => {
    const res = await AdminUserService.getAllUsers();
    if (res.success) {
      setUsers(res.data);
      setDisplayedUsers(res.data.slice(0, 8));
    }
  }, []);

  const toggleBlock = async (id: string) => {
    const currentUser = users.find(u => u._id === id);
    if (!currentUser) return;

    const newStatus = currentUser.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    
    const res = await AdminUserService.updateUserStatus(id, newStatus);
    if (res.success) {
      const updatedUsers = (prevUsers: IUser[]) =>
        prevUsers.map((user) =>
          user._id === id
            ? { ...user, status: newStatus }
            : user
        );
    
      setUsers((prevUsers) => updatedUsers(prevUsers));
      setSearchedUsers((prevUsers) => updatedUsers(prevUsers));
    }
  };

  const openConfirmModal = (userId: string) => {
    toast.custom(
      (id) => (
        <div className="bg-[#0c1110] border border-white/10 p-8 rounded-[38px] shadow-2xl backdrop-blur-3xl min-w-[320px] space-y-6">
          <div className="flex items-center gap-4 text-emerald-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xl font-serif text-white tracking-tight">Override Security?</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Personnel Status Modification</p>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Are you certain you wish to modify the access protocol for this operative?
          </p>

          <div className="flex gap-3">
            <button
              className="flex-grow px-6 py-3.5 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
              onClick={() => {
                toggleBlock(userId); 
                dismissToast(id);
              }}
            >
              Confirm
            </button>
            <button
              className="px-6 py-3.5 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/5"
              onClick={() => dismissToast(id)}
            >
              Abort
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  }

  const onSearchUser = async () => {
    if (input.length === 0) {
      setSearchedUsers(users);
      setDisplayedUsers(users.slice(0, 8));
      return;
    }

    const res = await AdminUserService.searchUser(input);
    if (res.success) {
      setSearchedUsers(res.data);
      setDisplayedUsers(res.data.slice(0, 8));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length === 0) {
      setSearchedUsers(users);
      setDisplayedUsers(users.slice(0, 8));
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Operative Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Personnel Registry</h1>
        </div>

        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" />
           <input
             placeholder="Search operative..."
             type="text"
             value={input}
             onChange={handleInputChange}
             onKeyDown={(e) => e.key === 'Enter' && onSearchUser()}
             className="w-full md:w-80 pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all shadow-xl"
           />
        </div>
      </div>

      {/* Persistence Grid */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Operative</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Personnel Data</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Oversight Status</th>
              <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Override Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {displayedUsers.map((user) => (
              <tr key={user._id} className="group hover:bg-emerald-500/[0.02] transition-all duration-500">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
                         <UserIcon size={20} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[13px] font-bold text-white uppercase tracking-widest">{user.username}</p>
                         <p className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-tighter">ID: {user._id.slice(-8)}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                         <Mail size={12} className="text-emerald-500/40" />
                         <span className="text-[11px] font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                         <Phone size={12} className="text-emerald-500/40" />
                         <span className="text-[10px] font-mono tracking-widest">{user.phone || "UNPUBLISHED"}</span>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${user.status === "ACTIVE" ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                      {user.status === "ACTIVE" ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      <span className="text-[9px] font-bold uppercase tracking-widest">{user.status}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button
                     onClick={() => openConfirmModal(user._id)}
                     className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                       user.status === "ACTIVE" 
                         ? "bg-white/5 border-white/10 text-slate-400 hover:bg-red-500 hover:border-red-500 hover:text-white" 
                         : "bg-emerald-500 border-emerald-500 text-black hover:bg-white hover:border-white"
                     }`}
                   >
                     {user.status === "ACTIVE" ? <Lock size={12} /> : <Unlock size={12} />}
                     <span>{user.status === "ACTIVE" ? "RESCIND ACCESS" : "AUTHORIZE ACCESS"}</span>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-8">
         <Pagination 
           items={input.length > 0 ? searchedUsers : users} 
           itemsPerPage={8} 
           onPageChange={handlePagination}
         />
      </div>
    </div>
  );
};

export default AdminUserManagement;

