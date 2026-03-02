import React, { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-modal";
import DeleteModal from "@/components/ui/modal/DeleteModal";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Layers, 
  X, 
  ChevronRight
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { PulseLoader } from "react-spinners";
import { AdminCategoryService } from "@/services/admin/AdminCategoryService";
import { errorToast } from "@/utils/customToast";

export interface ICategories {
  _id: string;
  categoryName: string;
  categoryImage: string;
}

const AdminCategoryPage = () => {
  const [paginatedCategories, setPaginatedCategories] = useState<ICategories[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemId, setItemId] = useState("");
  const [selectedCategoryImage, setSelectedCategoryImage] = useState("");

  const isModalOpen = () => {
    setIsEdit(false);
    setIsModal(true);
  };

  const isModelClose = () => {
    setCategoryName("");
    setCategoryImage(null);
    setSelectedCategoryImage("");
    setIsModal(false);
  };

  const onCategoryAdd = async () => {
    if (!categoryImage || categoryName.trim() === "") {
      errorToast("Integrity error: Classification data missing.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryImage", categoryImage);
    formData.append("categoryName", categoryName);
    
    setLoading(true);
    const res = await AdminCategoryService.addCategory(formData);
    if (res.success) {
      setRefresh((prev) => !prev);
      isModelClose();
    }
    setLoading(false);
  };

  const onCategoryEdit = async () => {
    if (categoryName.trim() === "") {
      errorToast("ID required: Classification name missing.");
      return;
    }
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("categoryId", selectedId);
    if (categoryImage) formData.append("categoryImage", categoryImage);
    else formData.append("ExistingImage", selectedCategoryImage);

    setLoading(true);
    const res = await AdminCategoryService.updateCategory(formData);
    if (res.success) {
      setRefresh(prev => !prev);
      isModelClose();
    }
    setLoading(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      setSelectedCategoryImage(URL.createObjectURL(file));
    }
  };

  const onDeleteCategory = async (categoryId: string) => {
    const res = await AdminCategoryService.deleteCategory(categoryId);
    if (res.success) {
      setRefresh((prev) => !prev);
    }
  };

  const getCategories = React.useCallback(async () => {
    const res = await AdminCategoryService.getAllCategories();
    if (res.success) {
      setCategories(res.data);
      setPaginatedCategories(res.data.slice(0, 5));
    }
  }, []);

  const OpenEditCategoryModal = (id: string) => {
    const category = categories.find((c) => id === c._id);
    if (category) {
      setSelectedId(id);
      setIsEdit(true);
      setCategoryName(category.categoryName);
      setSelectedCategoryImage(category.categoryImage);
      setIsModal(true);
    }
  };

  const handlePagination = (items: ICategories[]) => setPaginatedCategories(items);

  useEffect(() => {
    getCategories();
  }, [refresh, getCategories]);

  return (
    <div className="space-y-8 pb-12">
      <DeleteModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        item={itemId}
        onDelete={onDeleteCategory}
        text="Warning: All specimens associated with this classification will be purged. Continue?"
      />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Taxonomy Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Classification Archive</h1>
        </div>

        <button
          onClick={isModalOpen}
          className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>New Classification</span>
        </button>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Visual Type</th>
              <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Nomenclature</th>
              <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Strategic Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {paginatedCategories.map((category) => (
              <tr key={category._id} className="group hover:bg-emerald-500/[0.02] transition-all duration-500">
                <td className="px-8 py-6">
                   <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/5 bg-black/40 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={category.categoryImage}
                        alt=""
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100"
                      />
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <Layers size={14} className="text-emerald-500/40" />
                      <span className="text-[13px] font-bold text-white uppercase tracking-widest">{category.categoryName}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                      <button
                        onClick={() => OpenEditCategoryModal(category._id)}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all hover:scale-110"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => { setItemId(category._id); setModalIsOpen(true); }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all hover:scale-110"
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

      <div className="flex justify-center pt-8">
         <Pagination
           items={categories}
           itemsPerPage={5}
           onPageChange={handlePagination}
         />
      </div>

      {/* Classification Modal */}
      <Modal
        isOpen={isModal}
        onRequestClose={isModelClose}
        className="bg-[#0c1110] backdrop-blur-3xl p-0 rounded-[48px] shadow-2xl max-w-lg w-full relative outline-none border border-white/10 overflow-hidden"
        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100]"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
           <h2 className="text-2xl font-serif text-white tracking-tight">
             {isEdit ? "Refine Classification" : "Initialize Classification"}
           </h2>
           <button onClick={isModelClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="p-10 space-y-8">
           <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Archive Nomenclature</label>
              <input
                type="text"
                placeholder="EX: VERTICAL NOIR"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 font-bold tracking-widest"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Visual Signature</label>
              <div 
                className="relative group border-2 border-dashed border-white/5 rounded-3xl p-8 text-center hover:border-emerald-500/30 transition-all cursor-pointer bg-black/20 overflow-hidden"
              >
                 <input
                   type="file"
                   onChange={handleFileChange}
                   className="absolute inset-0 opacity-0 cursor-pointer z-10"
                 />
                 {selectedCategoryImage ? (
                   <div className="flex items-center gap-6 justify-center">
                      <img src={selectedCategoryImage} className="w-24 h-24 object-cover rounded-xl border border-white/10" alt="" />
                      <div className="text-left space-y-1">
                         <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Capture Active</p>
                         <p className="text-[9px] text-slate-500 font-mono">protocol.img_override</p>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                         <Upload size={20} className="text-emerald-500" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Sync Visual Token</p>
                   </div>
                 )}
              </div>
           </div>

           <button
             onClick={isEdit ? onCategoryEdit : onCategoryAdd}
             disabled={loading}
             className="w-full py-5 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
           >
             {loading ? <PulseLoader color="black" size={8} /> : (
               <>
                 <ChevronRight size={16} />
                 {isEdit ? "Update Classification" : "Commit Protocol"}
               </>
             )}
           </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategoryPage;
