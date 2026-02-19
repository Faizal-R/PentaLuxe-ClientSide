import { ChangeEvent, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import ImageCropper from "@/components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "@/utils/fileUpload";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  Tag as TagIcon, 
  Maximize2,
  Users,
  Dna,
  Activity,
  Zap,
  Save,
  X,
  Percent
} from "lucide-react";
import { IProduct } from "@/types/productTypes";
import { AdminProductService } from "@/services/admin/AdminProductService";
import { AdminCategoryService } from "@/services/admin/AdminCategoryService";
import { errorToast } from "@/utils/customToast";

interface Category {
  _id: string;
  categoryName: string;
}

interface IQuantities {
  volume: string;
  price: string | number;
  stock: string | number;
  _id?: string;
}

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantities, setQuantities] = useState<IQuantities[]>([]);
  const [newSize, setNewSize] = useState<string>("");

  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string | undefined>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedScentType, setSelectedScentType] = useState<IProduct["ScentType"] | "">("");
  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [newProductImages, setNewProductImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCategories = useCallback(async (): Promise<void> => {
    const res = await AdminCategoryService.getAllCategories();
    if (res.success) setCategories(res.data);
  }, []);

  const getProductDetails = useCallback(async (): Promise<void> => {
    if (id) {
      const res = await AdminProductService.getProductById(id);
      if (res.success) {
        const product: IProduct = res.data;
        setProductName(product.Name);
        setDescription(product.Description);
        setSelectedGender(product.Gender);
        setSelectedCategory(product.CategoryId.categoryName);
        setSelectedScentType(product.ScentType);
        setDiscountPercentage(product.DiscountPercentage);
        setExistingImages(product.Images);
        setQuantities(product.Variants);
      }
    }
  }, [id]);

  useEffect(() => {
    getCategories();
    getProductDetails();
  }, [getCategories, getProductDetails]);

  const handlePrice = (volume: string, newPrice: number) => {
    setQuantities(prev => prev.map(q => q.volume === volume ? { ...q, price: newPrice } : q));
  };

  const handleStockChange = (volume: string, newStock: number) => {
    setQuantities(prev => prev.map(q => q.volume === volume ? { ...q, stock: newStock } : q));
  };

  const handleAddSize = (): void => {
    if (!newSize) return;
    const exists = quantities.some(q => q.volume === newSize);
    if (!exists) {
      setQuantities(prev => [...prev, { volume: newSize, price: "", stock: "" }]);
      setNewSize("");
    } else {
      errorToast("Configuration already exists.");
    }
  };

  const handleRemoveExistingImage = (index: number): void => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageCropper = (CroppedImage: string) => {
    setNewProductImages([CroppedImage]);
    setShowCropper(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (existingImages.length + newProductImages.length >= 5) {
      errorToast("Maximum 5 visualizations permitted.");
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewProductImages(prev => [...prev, imageUrl]);
      setShowCropper(true);
    }
  };

  const validateForm = (): boolean => {
    if (!productName.trim()) { errorToast("Nomenclature is required."); return false; }
    if (!description.trim()) { errorToast("Olfactory narrative is required."); return false; }
    if (!selectedGender) { errorToast("Demographic target is required."); return false; }
    if (!selectedCategory) { errorToast("Taxonomy classification is required."); return false; }
    if (!selectedScentType) { errorToast("Elemental profile is required."); return false; }
    return true;
  };

  const handleRemoveQuantity = (quantityId?: string) => {
    setQuantities(prev => prev.filter(q => q._id !== quantityId && q.volume !== quantityId));
  };

  const updateProduct = async (): Promise<void> => {
    if (!validateForm()) return;

    if (!id) return;

    const formData = new FormData();

    if (newProductImages.length > 0) {
      const files = await convertBlobUrlsToFiles(newProductImages);
      if (files) formData.append('file', files[0]);
    }
    
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("Name", productName);
    formData.append("Description", description);
    formData.append("Gender", selectedGender!);
    formData.append("categoryName", selectedCategory);
    formData.append("ScentType", selectedScentType);
    formData.append("DiscountPercentage", String(discountPercentage));
    formData.append("Quantities", JSON.stringify(quantities));

    setLoading(true);
    const res = await AdminProductService.updateProduct(id, formData);
    if (res.success) {
      navigate("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 pb-24 max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/10 pb-8">
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
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Specimen Refinement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Edit Archive</h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
              <Activity size={14} className="text-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/80">Live Precision Mode</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Visual Assets */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500/60 font-serif">Visual Manifest</label>
              <ImageIcon size={16} className="text-emerald-500/40" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[...existingImages, ...newProductImages].map((img, idx) => (
                <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  <button 
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {(existingImages.length + newProductImages.length) < 5 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-white/5 hover:border-emerald-500/30 flex flex-col items-center justify-center gap-3 transition-all hover:bg-emerald-500/[0.02]"
                >
                  <Plus size={20} className="text-emerald-500/40" />
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Append Asset</span>
                </button>
              )}
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />

            <div className="pt-4 border-t border-white/5">
              <p className="text-[9px] text-slate-500 italic leading-relaxed">
                Visualizations are optimized for ultra-luxury display. Maximum 5 high-fidelity specimens permitted.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[40px] p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Zap size={20} />
                </div>
                <div>
                   <h4 className="text-white font-serif text-lg tracking-tight">Active Configuration</h4>
                   <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Real-time parameters</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Global Status</span>
                   <span className="text-[10px] font-mono text-emerald-500">SYNCED</span>
                </div>
                <div className="flex justify-between items-center py-2">
                   <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Metadata Hash</span>
                   <span className="text-[10px] font-mono text-slate-400">#PX-{id?.slice(-6).toUpperCase()}</span>
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Narrative & Technical Data */}
        <div className="lg:col-span-2 space-y-12">
          {/* Core Identification */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-4 group">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <Dna size={12} className="text-emerald-500" />
                  Specimen Nomenclature
                </label>
                <input 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-white/[0.02] border-b border-white/10 py-4 text-xl md:text-2xl font-serif text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                  placeholder="Designate Specimen Name..."
                />
              </div>

              <div className="space-y-4 group">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <Sparkles size={12} className="text-emerald-500" />
                  Olfactory Narrative
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/[0.02] border-b border-white/10 py-4 text-sm text-slate-400 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10 min-h-[120px] resize-none leading-relaxed"
                  placeholder="Articulate the essence of this creation..."
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Classification */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
                  <Layers size={12} className="text-emerald-500" />
                  Taxonomy classification
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-emerald-500/30 transition-all"
                >
                  <option value="" disabled>Select Classification</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.categoryName} className="bg-[#0c1110] italic uppercase">{cat.categoryName}</option>
                  ))}
                </select>
              </div>

              {/* Elemental Profile */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
                  <TagIcon size={12} className="text-emerald-500" />
                  Elemental Profile
                </label>
                <select
                  value={selectedScentType}
                  onChange={(e) => setSelectedScentType(e.target.value as IProduct["ScentType"])}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-emerald-500/30 transition-all"
                >
                  <option value="" disabled>Select Profile</option>
                  {["Woody", "Fruity", "Floral", "Citrus", "Spicy"].map(type => (
                    <option key={type} value={type} className="bg-[#0c1110] italic uppercase">{type}</option>
                  ))}
                </select>
              </div>

              {/* Intended Demographic */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
                  <Users size={12} className="text-emerald-500" />
                  Demographic target
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-emerald-500/30 transition-all"
                >
                  <option value="" disabled>Select Gender</option>
                  {["Men", "Women", "Unisex"].map(gender => (
                    <option key={gender} value={gender} className="bg-[#0c1110] italic uppercase">{gender}</option>
                  ))}
                </select>
              </div>

              {/* Strategic Incentive */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
                  <Zap size={12} className="text-emerald-500" />
                  Strategic Incentive (%)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-mono text-emerald-500 focus:outline-none focus:border-emerald-500/30 transition-all"
                    placeholder="0"
                  />
                  <Percent size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Dimensional Configurations Matrix */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-white tracking-tight">Dimensional Matrix</h3>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold italic">Volume, Valuation & Inventory Reserve</p>
              </div>
              <Maximize2 size={18} className="text-emerald-500/40" />
            </div>

            <div className="space-y-4">
              {quantities.map((quantity, idx) => (
                <div key={idx} className="group flex flex-col md:flex-row items-center gap-6 p-6 bg-black/20 border border-white/5 rounded-3xl hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-500">
                      VS{idx + 1}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white">{quantity.volume}</span>
                  </div>
                  
                  <div className="flex-grow grid grid-cols-2 gap-4 w-full">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Valuation</span>
                      <input 
                        type="number"
                        value={quantity.price}
                        onChange={(e) => handlePrice(quantity.volume, parseFloat(e.target.value))}
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-20 pr-4 text-right text-[12px] font-mono text-emerald-500 focus:outline-none focus:border-emerald-500/30 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Reserve</span>
                      <input 
                        type="number"
                        value={quantity.stock}
                        onChange={(e) => handleStockChange(quantity.volume, parseInt(e.target.value))}
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-20 pr-4 text-right text-[12px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemoveQuantity(quantity._id || quantity.volume)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
              <input 
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Append Configuration (e.g., 50ml)"
                className="flex-grow bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-emerald-500/30 transition-all"
              />
              <button 
                onClick={handleAddSize}
                className="px-8 py-4 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
              >
                Integrate Dimension
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-10 flex justify-end">
             <button 
               onClick={updateProduct}
               disabled={loading}
               className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-emerald-500 text-black text-xs font-bold uppercase tracking-[0.5em] rounded-[32px] hover:bg-white hover:scale-105 transition-all shadow-2xl overflow-hidden min-w-[300px]"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="relative z-10 flex items-center gap-3">
                 {loading ? <PulseLoader size={8} color="#000" /> : (
                   <>
                     Commit Changes
                     <Save size={18} />
                   </>
                 )}
               </span>
             </button>
          </div>
        </div>
      </div>

      {showCropper && (
        <ImageCropper
          imageSrc={newProductImages[newProductImages.length - 1]}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleImageCropper}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
