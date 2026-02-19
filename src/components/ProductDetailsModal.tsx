import React, { useState, useEffect } from "react";
import { IProduct } from "@/types/productTypes";
import { X, Sparkles, ShoppingBag } from "lucide-react";

interface ProductModalProps {
  product: IProduct | null;
  onClose: () => void;
  selectedVolume: string;
  hanldeCart: (productId: string, volume: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, selectedVolume, hanldeCart }) => {
  const [selectedSize, setSelectedSize] = useState(selectedVolume);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(0);
  const [selectProductStock, setSelectedProductStock] = useState(0);

  useEffect(() => {
    const variant = product?.Variants.find(variant => variant.volume === selectedSize);
    if (variant) {
      const currentPrice = variant.price;
      setOriginalPrice(currentPrice);
      const afterDiscount = variant.price - (variant.price * (product?.DiscountPercentage || 0)) / 100;
      setDiscountedPrice(afterDiscount);
      setSelectedProductStock(variant.stock);
    }
  }, [product, selectedSize]);

  const handleSendCartData = () => {
    if (product) hanldeCart(product._id, selectedSize);
  };

  if (!product) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in duration-500" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[110] px-4 pointer-events-none">
        <div className="bg-[#0a0c10] border border-emerald-500/10 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm p-8 w-full max-w-lg transform transition-all duration-700 animate-in zoom-in-95 slide-in-from-bottom-8 pointer-events-auto">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-10">
            
            {/* Header / Info */}
            <div className="flex gap-8 items-start">
              <div className="w-32 h-40 bg-emerald-950/20 border border-emerald-500/10 flex-shrink-0 overflow-hidden">
                <img
                  src={product.Images[0]}
                  alt={product.Name}
                  className="w-full h-full object-cover grayscale-[0.5]"
                />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                   <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                   <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Variant Selection</span>
                </div>
                <h2 className="text-3xl font-serif text-white uppercase">{product.Name}</h2>
                <div className="space-y-1">
                  {product.DiscountPercentage > 0 && (
                    <p className="text-xs text-slate-500 line-through font-mono">
                      ₹{originalPrice?.toFixed(0)}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-mono font-bold text-emerald-500 tracking-tighter">
                      ₹{discountedPrice?.toFixed(0)}
                    </p>
                    {product.DiscountPercentage > 0 && (
                      <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-bold uppercase tracking-widest rounded-sm">
                        -{product.DiscountPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-500/5 pb-2">
                 <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Volumetric Protocol (ML)</h3>
                 <span className="text-[9px] text-slate-700 uppercase tracking-widest italic">Inventory Citations: {selectProductStock}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.Variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedSize(variant.volume)}
                    disabled={variant.stock === 0}
                    className={`min-w-[70px] py-4 px-2 rounded-sm border transition-all duration-300 flex flex-col items-center gap-1 ${
                      selectedSize === variant.volume
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_#10b98120]"
                        : variant.stock === 0
                        ? "border-emerald-500/5 text-slate-800 cursor-not-allowed"
                        : "border-emerald-500/10 text-slate-500 hover:border-emerald-500/40 hover:text-white"
                    }`}
                  >
                    <span className="text-[10px] font-bold font-mono tracking-widest">{variant.volume}</span>
                    <span className="text-[8px] uppercase tracking-tighter opacity-40">ML</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={handleSendCartData} 
              className="w-full py-5 bg-emerald-600 text-black text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-4"
            >
              <ShoppingBag className="w-4 h-4" />
              Manifest In Bag
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </>
  );
};

export default ProductModal;
