import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, Eye, Heart, MoveRight } from "lucide-react";

import EmptyWishlist from "@/components/EmptyWishlist";
import ProductModal from "@/components/ProductDetailsModal";
import { addToCart } from "@/store/slices/cartSlice";
import { IProduct } from "@/types/productTypes";
import { pentaluxeTheme } from "@/theme";
import { WishlistService } from "@/services/user/WishlistService";
import { CartService } from "@/services/user/CartService";

interface IWishlistItems {
  _id: string;
  product: IProduct;
  variant: {
    volume: string;
    price: number;
  };
}

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState<IWishlistItems[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getUserWishlist = useCallback(async () => {
    setIsLoading(true);
    const res = await WishlistService.getWishlist();
    if (res.success) {
      setWishlistItems(res.data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getUserWishlist();
  }, [getUserWishlist]);

  const showProductModalWithVolume = (product: IProduct, volume: string) => {
    setSelectedProduct(product);
    setSelectedVolume(volume);
    setModalOpen(true);
  };

  const handleAddToCart = async (productId: string, volume: string,stock:number) => {
    const res = await CartService.addToCart({
      productId,
     volume, // Using volume as size if compatible
     stock,
    });

    if (res.success) {
      setModalOpen(false);
      dispatch(addToCart(res.data));
      navigate("/cart");
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const res = await WishlistService.removeFromWishlist(productId);
    if (res.success) {
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#05070a]" />;

  return (
    <div 
      className="min-h-screen pt-8 pb-16 px-8 lg:px-12 font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      {!wishlistItems.length ? (
        <EmptyWishlist />
      ) : (
        <div className="w-full space-y-10">
          
          {/* Header */}
          <div className="text-center space-y-3">
             <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-emerald-500/20" />
                <Heart className="w-5 h-5 text-emerald-500" />
                <div className="h-px w-12 bg-emerald-500/20" />
             </div>
             <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter">My <span className="text-emerald-500 italic">Wishlist.</span></h1>
             <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase font-bold">Items you've saved for later</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-4">
            {wishlistItems.map((item) => (
              <div 
                key={item._id}
                className="group relative bg-[#0c1110]/80 backdrop-blur-3xl border border-emerald-500/10 hover:border-emerald-500/40 transition-all duration-700 overflow-hidden flex flex-col hover:-translate-y-2"
                style={{ 
                  borderRadius: "10px", 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
                }}
              >
                {/* Tactical Corner Markers */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-emerald-500/20 group-hover:border-emerald-500 transition-colors z-20" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-emerald-500/20 group-hover:border-emerald-500 transition-colors z-20" />
                
                {/* Scanning Animation Body */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <div className="w-full h-[1px] bg-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.8)] absolute -top-1 group-hover:top-full transition-all duration-[3000ms] ease-linear" />
                </div>

                {/* Main Visual Component */}
                <div className="relative aspect-square overflow-hidden bg-emerald-950/10">
                   {/* Product Metadata Overlay */}
                   <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="px-1.5 py-0.5 bg-emerald-500 text-black text-[6px] font-bold uppercase tracking-widest leading-none">
                        {item.product.Gender?.toUpperCase() || "UNISEX"}
                      </div>
                      <div className="px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-emerald-500/20 text-emerald-400 text-[5px] font-mono uppercase tracking-[0.1em] leading-none">
                        {item.product.ScentType || "Aromatic"}
                      </div>
                   </div>

                   <img 
                    src={item.product?.Images[0]} 
                    alt={item.product?.Name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                  />
                  
                  {/* Glass Scrim with Data Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1110] via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Actions: Integrated Tactical Grid */}
                  <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={() => removeFromWishlist(item.product._id)}
                      className="p-3 bg-black/40 backdrop-blur-md border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link 
                      to={`/products/${item.product._id}`}
                      className="p-3 bg-black/40 backdrop-blur-md border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shadow-xl"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Industrial Info Core */}
                <div className="p-4 bg-black/40 flex-grow flex flex-col justify-between relative">
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                       <span className="text-[6px] text-emerald-500/40 font-mono tracking-[0.4em] uppercase font-bold italic flex items-center gap-2 leading-none">
                          <span className="w-3 h-[1px] bg-emerald-500/20" />
                          Log: {item.product.CategoryId.categoryName}
                       </span>
                       <h2 className="text-lg font-serif text-white group-hover:text-emerald-400 transition-colors uppercase truncate tracking-tighter">
                         {item.product.Name}
                       </h2>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[7px] text-slate-500 uppercase tracking-widest font-mono leading-none">Vol.</span>
                          <span className="text-[10px] text-emerald-500/60 font-mono font-bold leading-none">{item.variant.volume}</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[7px] text-slate-500 uppercase tracking-widest font-mono leading-none">Value</span>
                          <p className="text-xl font-mono font-bold text-white tracking-tighter leading-none">₹{item.variant.price}</p>
                       </div>
                    </div>
                  </div>

                  {/* Dynamic Action Zone */}
                  <div className="mt-4 pt-4 border-t border-emerald-500/10">
                    <button 
                      onClick={() => showProductModalWithVolume(item.product, item.variant.volume)}
                      className="w-full h-10 relative overflow-hidden cursor-pointer rounded-lg group/btn hover:text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                       <div className="absolute inset-0 bg-emerald-500/10 transition-colors" />
                       <div className="absolute inset-0 border border-emerald-500/20 hover:text-white shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]" />
                       <ShoppingBag className="w-4 h-4 text-emerald-500 " />
                       <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500 hover:text-white transition-colors">
                          Move To Inventory
                       </span>
                    </button>
                  </div>
                </div>

                {/* Bottom ID Citation */}
                <div className="px-6 py-2 bg-emerald-500/5 flex justify-between items-center">
                   <span className="text-[6px] text-emerald-500/30 uppercase font-mono tracking-widest leading-none">Pentaluxe Protocol v4.0.2</span>
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-emerald-500/20" />
                      <div className="w-1 h-1 bg-emerald-500/20" />
                      <div className="w-4 h-1 bg-emerald-500/40" />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <div className="pt-20 text-center">
             <Link 
               to="/products"
               className="inline-flex items-center gap-4 text-emerald-500/40 hover:text-emerald-500 transition-all uppercase text-[10px] tracking-[0.4em] font-bold border-b border-emerald-500/10 pb-2 hover:border-emerald-500"
             >
                Back to Shop <MoveRight className="w-5 h-5" />
             </Link>
          </div>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          selectedVolume={selectedVolume}
          onClose={() => setModalOpen(false)}
          hanldeCart={handleAddToCart}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export default WishlistPage;

