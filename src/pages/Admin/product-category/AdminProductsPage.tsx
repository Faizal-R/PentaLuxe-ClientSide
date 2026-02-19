
import { ChangeEvent, useEffect, useState } from "react";
import api from "@/services/apiService";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeleteModal from "@/components/ui/modal/DeleteModal";
import { IProduct } from "@/types/productTypes";
import { AppHttpStatusCodes } from "@/types/statusCode";
import Pagination from "@/components/Pagination";
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye,
  EyeOff
} from "lucide-react";
import { ADMIN_API_ROUTES } from "@/routes/api/AdminApiRoutes";

const AdminProductsPage = () => {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [itemId, setItemId] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [searchedProducts, setSearchedProducts] = useState<IProduct[]>([]);
  const [input, setInput] = useState("");

  const itemsPerPage = 8; 

  const getProducts = async () => {
    try {
      const res = await api.get(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.GET_ALL);
      if (res.data.success) {
        setProducts(res.data.data);
        setDisplayedProducts(res.data.data.slice(0, itemsPerPage));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) navigate("/admin");
        toast.error(error.response?.data.message);
      }
    }
  };

  const openModal = (id: string) => {
    setModalIsOpen(true);
    setItemId(id);
  };

  const onProductDelete = async (productId: string) => {
    try {
      const res = await api.delete(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.DELETE_PRODUCT(productId));
      if (res.data.success) {
        setProducts(products.filter((product) => product._id.toString() !== productId));
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length === 0) {
      setSearchedProducts(products);
      setDisplayedProducts(products.slice(0, itemsPerPage));
    }
  };

  const onSearchProducts = async () => {
    if (input.length === 0) {
      setSearchedProducts(products);
      return;
    }
    try {
      const res = await api.post(ADMIN_API_ROUTES.PRODUCTS_MANAGEMENT.SEARCH_PRODUCTS, { text: input });
      if (res.status === AppHttpStatusCodes.OK) {
        setSearchedProducts(res.data.data);
        setDisplayedProducts(res.data.data.slice(0, itemsPerPage));
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message);
    }
  };

  const handlePagination = (currentPageData: IProduct[]) => {
    setDisplayedProducts(currentPageData);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <DeleteModal
        isOpen={isModalOpen}
        onRequestClose={() => setModalIsOpen(false)}
        item={itemId}
        onDelete={onProductDelete}
        text="Are you sure you want to purge this product from the archive?"
      />

      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Inventory Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Product Archive</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Search Pulse */}
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" />
              <input
                placeholder="Search Archive..."
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && onSearchProducts()}
                className="w-full md:w-72 pl-12 pr-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
              />
           </div>

           <button 
             onClick={() => navigate("/admin/products/add")}
             className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95"
           >
             <Plus className="w-4 h-4" />
             <span>Create Specimen</span>
           </button>
        </div>
      </div>

      {/* Archive Grid/Table */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        {displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
               <AlertTriangle className="h-10 w-10 text-red-500 opacity-60" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">Null Result Detected</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">No specimens match your current projection parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Specimen</th>
                  <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Archive classification</th>
                  <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Evaluation</th>
                  <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Reserve</th>
                  <th className="px-8 py-5 text-center text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Vector</th>
                  <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Strategic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {displayedProducts.map((product, index) => (
                  <tr key={index} className="group hover:bg-emerald-500/[0.02] transition-all duration-500">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 bg-black/40 p-1">
                            <img
                              src={product.Images[0]}
                              alt=""
                              className="w-full h-full object-contain brightness-90 group-hover:scale-110 transition-transform duration-700"
                            />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[12px] font-bold text-white uppercase tracking-widest">{product.Name}</p>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">REF: {product._id.slice(-6)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {product.CategoryId?.categoryName || "Un-Classified"}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[12px] font-mono font-bold text-white tracking-tighter">₹{product.Variants[0]?.price.toLocaleString()}</p>
                       <p className="text-[9px] font-bold text-red-500/60 uppercase tracking-widest leading-none">{product.DiscountPercentage}% Deduction</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${product.Variants[0]?.stock > 20 ? 'bg-emerald-500' : product.Variants[0]?.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                          <span className="text-[11px] font-mono font-bold text-slate-300">
                             {product.Variants[0]?.stock === 0 ? "DEPLETED" : `${product.Variants[0]?.stock} UNITS`}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${!product.isBlocked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                          {product.isBlocked ? <EyeOff size={12} /> : <Eye size={12} />}
                          <span className="text-[9px] font-bold uppercase tracking-widest">{product.isBlocked ? "BLOCKED" : "ACTIVE"}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                          <button
                            onClick={() => navigate(`/admin/products/${product._id}`)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all hover:scale-110"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => openModal(product._id)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Numerical Navigation */}
      <div className="flex justify-center pt-8">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/5 px-6 py-4 rounded-[32px] shadow-2xl">
           <Pagination
             items={searchedProducts.length > 0 ? searchedProducts : products}
             itemsPerPage={itemsPerPage}
             onPageChange={handlePagination}
           />
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
