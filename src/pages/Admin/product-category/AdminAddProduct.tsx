import React, { useEffect, useState } from "react";
import ImageCropper from "@/components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "@/utils/fileUpload";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  Tag as TagIcon, 
  Info,
  Maximize2,
  Users
} from "lucide-react";
import { AdminProductService } from "@/services/admin/AdminProductService";
import { AdminCategoryService } from "@/services/admin/AdminCategoryService";
import { errorToast } from "@/utils/customToast";

type SizeInfo = {
  price: string;
  stock: string;
};

type Quantities = Record<string, SizeInfo>;

interface Category {
  _id: string;
  categoryName: string;
}

const AdminAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<Quantities>({});
  const [newSize, setNewSize] = useState<string>("");

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScentType, setSelectedScentType] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showCropper, setShowCropper] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).map((file) => URL.createObjectURL(file));
      setSelectedImages(imageFiles);
      setCurrentImageIndex(0);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCroppedImages((prev) => {
      const updated = [...prev];
      if (currentImageIndex < updated.length) updated[currentImageIndex] = croppedImage;
      else updated.push(croppedImage);
      return updated;
    });

    const next = currentImageIndex + 1;
    if (next < selectedImages.length) setCurrentImageIndex(next);
    else setShowCropper(false);
  };

  const handlePriceQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuantities(prev => ({ ...prev, [name]: { ...prev[name], price: value } }));
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuantities(prev => ({ ...prev, [name]: { ...prev[name], stock: value } }));
  };

  const handleAddSize = () => {
    if (newSize && !quantities[newSize]) {
      setQuantities(prev => ({ ...prev, [newSize]: { price: "", stock: "" } }));
      setNewSize("");
    }
  };

  const sendProductsToServer = async () => {
    if (!productName.trim() || !description.trim() || !selectedGender || !selectedCategory || !selectedScentType) {
      errorToast("Protocol error: All mandatory fields must be populated.");
      return;
    }

    const files = await convertBlobUrlsToFiles(croppedImages);
    if (files.length === 0) {
      errorToast("Visual evidence required: Upload at least one specimen image.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("Name", productName);
    formData.append("Description", description);
    formData.append("Gender", selectedGender);
    formData.append("categoryName", selectedCategory);
    formData.append("ScentType", selectedScentType);
    formData.append("DiscountPercentage", String(discountPercentage));
    Object.entries(quantities).forEach(([key, value]) => {
      formData.append(`productVolumes[${key}][price]`, value.price);
      formData.append(`productVolumes[${key}][stock]`, value.stock);
    });

    setLoading(true);
    const res = await AdminProductService.addProduct(formData);
    if (res.success) {
      navigate("/admin/products");
    }
    setLoading(false);
  };

  const getCategories = React.useCallback(async () => {
    const res = await AdminCategoryService.getAllCategories();
    if (res.success) setCategories(res.data);
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="space-y-12 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-emerald-500/50 hover:text-emerald-500 transition-colors uppercase text-[9px] font-bold tracking-[0.3em] mb-4"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Vault
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">New Specimen Entry</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Draft Blueprints</h1>
        </div>
        
        <button
          onClick={sendProductsToServer}
          disabled={loading}
          className="px-10 py-4 bg-emerald-500 text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-50"
        >
          {loading ? <PulseLoader size={6} color="#000" /> : "Authorize Specimen"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Info size={18} />
               </div>
               <h2 className="text-xl font-serif text-white">Core Identity</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Specimen Nomenclature</label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="EX: VERTICAL NOIR"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 ml-1">Olfactory Narrative</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the essence profile..."
                  className="w-full h-40 bg-black/40 border border-white/10 rounded-3xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 resize-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <Layers size={18} />
                </div>
                <h2 className="text-xl font-serif text-white">Volume Protocol</h2>
             </div>

             <div className="space-y-4">
                {Object.keys(quantities).map((size) => (
                   <div key={size} className="flex items-center gap-4 p-4 bg-black/40 rounded-3xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                      <div className="w-20 px-4 py-2 bg-emerald-500/10 rounded-xl text-center">
                         <span className="text-[10px] font-mono font-bold text-emerald-500">{size}</span>
                      </div>
                      <input
                        type="number"
                        name={size}
                        value={quantities[size].price}
                        onChange={handlePriceQuantityChange}
                        placeholder="Valuation"
                        className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/30"
                      />
                      <input
                        type="number"
                        name={size}
                        value={quantities[size].stock}
                        onChange={handleStockChange}
                        placeholder="Reserve"
                        className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/30"
                      />
                      <button 
                        onClick={() => {
                           const newQ = { ...quantities };
                           delete newQ[size];
                           setQuantities(newQ);
                        }}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                ))}

                <div className="flex gap-3 pt-4">
                   <div className="relative flex-grow">
                      <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input
                        type="text"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        placeholder="SPECIFY MAGNITUDE (E.G. 100ML)"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-[10px] uppercase font-bold tracking-widest text-white focus:outline-none focus:border-emerald-500/30"
                      />
                   </div>
                   <button
                     onClick={handleAddSize}
                     className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all"
                   >
                      Integrate Dimension
                   </button>
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Controls & Visuals */}
        <div className="space-y-8">
           <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 space-y-6 shadow-2xl">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-2">
                       <Layers size={12} className="text-emerald-500" /> Archive classification
                    </label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-emerald-500/50 appearance-none transition-all cursor-pointer"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="" disabled className="bg-black">SELECT ARCHIVE</option>
                      {categories.map((c) => <option key={c._id} value={c.categoryName} className="bg-black">{c.categoryName}</option>)}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-2">
                       <Users size={12} className="text-blue-500" /> Demographic target
                    </label>
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 appearance-none transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-black">SELECT VECTOR</option>
                      <option value="Men" className="bg-black">Masculine</option>
                      <option value="Women" className="bg-black">Feminine</option>
                      <option value="Unisex" className="bg-black">Universal</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-2">
                       <Sparkles size={12} className="text-purple-500" /> Olfactory Class
                    </label>
                    <select
                      value={selectedScentType}
                      onChange={(e) => setSelectedScentType(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-purple-500/50 appearance-none transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-black">SELECT CLASS</option>
                      {["Woody", "Fruity", "Floral", "Citrus", "Spicy"].map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                    </select>
                 </div>

                 <div className="space-y-2 pt-4">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-2">
                       <TagIcon size={12} className="text-amber-500" /> Elemental essence
                    </label>
                    <input
                      type="number"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-mono font-bold text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-700"
                    />
                 </div>
              </div>
           </section>

           <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-serif text-white">Visual Capture</h2>
                 <ImageIcon size={20} className="text-emerald-500" />
              </div>
              
              <div className="relative group border-2 border-dashed border-white/5 rounded-[32px] p-8 text-center hover:border-emerald-500/30 transition-all cursor-pointer bg-black/20">
                 <input
                   type="file"
                   multiple
                   accept="image/*"
                   onChange={handleFileChange}
                   className="absolute inset-0 opacity-0 cursor-pointer"
                 />
                 <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                       <Plus size={24} className="text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initialize Capture</p>
                 </div>
              </div>

              {croppedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                    {croppedImages.map((img, idx) => (
                       <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-2 group">
                          <img className="w-full h-full object-contain brightness-95" src={img} alt="" />
                          <button
                            onClick={() => { setCurrentImageIndex(idx); setShowCropper(true); }}
                            className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                          >
                             <Sparkles size={20} className="text-white" />
                          </button>
                       </div>
                    ))}
                </div>
              )}
           </section>
        </div>
      </div>

      {/* Cropper Modal Overlay */}
      {showCropper && selectedImages[currentImageIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-12">
           <div className="w-full max-w-4xl bg-[#0c1110] rounded-[48px] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-2xl font-serif text-white tracking-tight">Lens Refraction Protocol</h3>
                 <span className="text-[10px] font-mono text-emerald-500/60 uppercase font-bold tracking-[0.2em]">Capture {currentImageIndex + 1} of {selectedImages.length}</span>
              </div>
              <div className="p-12">
                 <ImageCropper
                   imageSrc={selectedImages[currentImageIndex]}
                   onClose={() => setShowCropper(false)}
                   onCropComplete={handleCropComplete}
                 />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddProduct;
