import { useCallback, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/types/productTypes";
import Pagination from "@/components/Pagination";
import { 
  Search, 
  ChevronDown, 
  RefreshCcw,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { pentaluxeTheme } from "@/theme";
import { ProductService } from "@/services/user/ProductService";

const AllProductsPage = () => {
  const [searchedProducts, setSearchedProducts] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const [sortOption, setSortOption] = useState("az");
  const [gender, setGender] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await ProductService.getProducts();
    if (res.success) {
      const fetchResult = res.data;
      setProducts(fetchResult);
      
      if (searchedProducts.length === 0) {
        setSortedProducts(fetchResult);
        setDisplayedProducts(fetchResult);
      }
    }
  }, [searchedProducts.length]);

  useEffect(() => {
    if (searchedProducts.length > 0) {
      setSortedProducts(searchedProducts);
      setDisplayedProducts(searchedProducts);
    } else {
      fetchProducts();
    }
  }, [searchedProducts, fetchProducts]);

  const filterProductsByGender = useCallback((gender: string, list: IProduct[]) => {
    if (!gender) return list;
    return list.filter((product) => product.Gender === gender);
  }, []);

  const sortProducts = useCallback((option: string, filteredProducts: IProduct[]) => {
    const sorted = [...filteredProducts];
    switch (option) {
      case "priceLowHigh":
        sorted.sort((a, b) => (a.Variants[0]?.price || 0) - (b.Variants[0]?.price || 0));
        break;
      case "priceHighLow":
        sorted.sort((a, b) => (b.Variants[0]?.price || 0) - (a.Variants[0]?.price || 0));
        break;
      case "az":
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "za":
        sorted.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
    }
    return sorted;
  }, []);

  useEffect(() => {
    const filtered = filterProductsByGender(gender, products);
    const sorted = sortProducts(sortOption, filtered);
    setSortedProducts(sorted);
  }, [products, sortOption, gender, filterProductsByGender, sortProducts]);

  const onSearchHandler = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setIsSearching(true);
    const res = await ProductService.searchByCategory({ text: input });
    if (res.success) {
      setSearchedProducts(res.data);
      setFilterActive(true);
    }
    setIsSearching(false);
  };

  const clearAllFilters = () => {
    setInput("");
    setSearchedProducts([]);
    setGender("");
    setSortOption("az");
    setFilterActive(false);
  };

  return (
    <div 
      className="min-h-screen pt-8 pb-16 px-8 font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      <div className="w-full space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-emerald-500/10 pb-8 px-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <div className="w-8 h-px bg-emerald-500 shadow-[0_0_10px_#10b981]" />
               <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">The Complete Archives</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif">Curated <span className="text-emerald-500 italic">Essences.</span></h1>
            <p className="max-w-2xl text-slate-500 font-light leading-relaxed text-xs md:text-sm">
               Explore our full decant architecture. From nocturnal wood notes to ephemeral florals, find the sillage that defines your silent presence.
            </p>
          </div>
          
          <div className="text-right hidden lg:block">
             <span className="text-[10px] tracking-[0.6em] uppercase text-emerald-500/40 font-bold block mb-2">Inventory Sync</span>
             <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-500/80">{products.length} Master Decants Online</span>
             </div>
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-emerald-950/5 border border-emerald-500/10 p-6 rounded-sm backdrop-blur-sm sticky top-[80px] z-40">
           <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
              {/* Gender Filter */}
              <div className="relative group w-full sm:w-48">
                 <span className="absolute -top-2 left-3 px-2 bg-[#05070a] text-[8px] uppercase tracking-widest text-emerald-500/60 z-10">Archive Filter</span>
                 <select 
                   value={gender}
                   onChange={(e) => {setGender(e.target.value); setFilterActive(true);}}
                   className="w-full bg-black/40 border border-emerald-500/10 px-4 py-3 text-[10px] tracking-widest uppercase focus:outline-none focus:border-emerald-500 transition-all appearance-none text-white cursor-pointer"
                 >
                   <option value="">All Genders</option>
                   <option value="Men">Masculine</option>
                   <option value="Women">Feminine</option>
                   <option value="Unisex">Universal</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-500/40 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative group w-full sm:w-48">
                 <span className="absolute -top-2 left-3 px-2 bg-[#05070a] text-[8px] uppercase tracking-widest text-emerald-500/60 z-10">Sort Protocol</span>
                 <select 
                   value={sortOption}
                   onChange={(e) => {setSortOption(e.target.value); setFilterActive(true);}}
                   className="w-full bg-black/40 border border-emerald-500/10 px-4 py-3 text-[10px] tracking-widest uppercase focus:outline-none focus:border-emerald-500 transition-all appearance-none text-white cursor-pointer"
                 >
                   <option value="az">A — Z (Archive Order)</option>
                   <option value="za">Z — A (Reverse)</option>
                   <option value="priceLowHigh">Price: Ascending</option>
                   <option value="priceHighLow">Price: Descending</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-500/40 pointer-events-none" />
              </div>

              {(filterActive || searchedProducts.length > 0) && (
                <button 
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-widest font-bold transition-colors pl-2"
                >
                  <RefreshCcw className="w-3 h-3" /> Reset Archives
                </button>
              )}
           </div>

           {/* Search Bar */}
           <form onSubmit={onSearchHandler} className="relative w-full lg:w-96 group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search The Scent Gallery..."
                className="w-full bg-black/40 border-b border-emerald-500/10 px-12 py-3 text-[11px] tracking-widest uppercase focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-emerald-950 font-mono"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" />
              <button 
                type="submit"
                disabled={isSearching}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/40 hover:text-emerald-500 transition-colors"
              >
                 {isSearching ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
           </form>
        </div>

        {/* Products Grid */}
        <div className="relative min-h-[400px]">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
              {displayedProducts.map((product) => (
                <div key={product._id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-emerald-500/5 rounded-sm border border-emerald-500/10 space-y-6">
              <div className="p-6 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif text-white">No Manifestations Found</h2>
                <p className="text-slate-500 text-sm tracking-widest uppercase">The current search parameters yielded no results in our archives.</p>
              </div>
              <button 
                onClick={clearAllFilters}
                className="px-10 py-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-emerald-500 hover:text-black transition-all"
              >
                Return to Full Collections
              </button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {sortedProducts.length > 0 && (
          <div className="pt-20 border-t border-emerald-500/10">
            <Pagination
              items={sortedProducts}
              itemsPerPage={10}
              onPageChange={(paginated) => setDisplayedProducts(paginated)}
            />
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        select option {
          background-color: #0c1110;
          color: white;
          padding: 10px;
        }

        /* Custom scrollbar for dropdowns if needed */
        select::-webkit-scrollbar {
          width: 5px;
        }
        select::-webkit-scrollbar-track {
          background: #05070a;
        }
        select::-webkit-scrollbar-thumb {
          background: #064e3b;
        }
      `}</style>
    </div>
  );
};

export default AllProductsPage;
