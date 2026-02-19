import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types/productTypes";
import Pagination from "@/components/Pagination";
import { pentaluxeTheme } from "@/theme";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { ProductService } from "@/services/user/ProductService";

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<IProduct[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategoryProducts = useCallback(async () => {
    setIsLoading(true);
    if (!id) return;
    const res = await ProductService.getProductsByCategory(id);
    if (res.success) {
      const fetchResult = res.data;
      setProducts(fetchResult);
      if (fetchResult.length > 0) {
        setCategoryName(fetchResult[0].CategoryId.categoryName);
      }
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [fetchCategoryProducts]);

  const handlePagination = (paginatedProducts: IProduct[]) => {
    setDisplayProducts(paginatedProducts);
  };

  return (
    <div 
      className="min-h-screen pt-24 pb-20 px-6 font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      <div className="max-w-[1500px] mx-auto space-y-16">
        
        {/* Navigation & Header */}
        <div className="space-y-10">
           <button 
             onClick={() => navigate(-1)}
             className="group flex items-center gap-3 text-emerald-500/40 hover:text-emerald-500 transition-colors uppercase text-[10px] tracking-[0.4em] font-bold"
           >
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Back to Collections
           </button>

           <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-emerald-500/10 pb-12">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-emerald-500 tracking-[0.6em] uppercase text-[10px] font-bold">Category Archives</span>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-serif">
                   {categoryName || "Curated"} <span className="text-emerald-500 italic">Realm.</span>
                 </h1>
                 <p className="max-w-xl text-slate-500 font-light leading-relaxed">
                   Explore our curated manifestations within the {categoryName || 'selected'} archive. Each bottle is a portal to a distinct olfactory dimension.
                 </p>
              </div>
              
              <div className="text-right">
                 <span className="text-[10px] tracking-[0.6em] uppercase text-emerald-500/40 font-bold block mb-2">Inventory Citation</span>
                 <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-500/80">{products.length} Manifestations Catalogued</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Products Grid */}
        <div className="relative min-h-[400px]">
          {!isLoading && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
              {(displayProducts.length > 0 ? displayProducts : products).map((product) => (
                <div key={product._id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 border border-emerald-500/10 bg-emerald-500/5 rounded-sm">
               <AlertCircle className="w-12 h-12 text-emerald-500/20 mb-6" />
               <h2 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest">Archive Empty</h2>
               <p className="text-slate-500 text-[10px] tracking-widest uppercase font-bold">No manifestations have been catalogued in this realm yet.</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-40">
               <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {!isLoading && products.length > 0 && (
          <div className="pt-20 border-t border-emerald-500/10">
            <Pagination
              items={products}
              itemsPerPage={10}
              onPageChange={handlePagination}
            />
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default CategoryPage;
