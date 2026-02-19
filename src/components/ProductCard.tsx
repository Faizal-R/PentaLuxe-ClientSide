import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "@/types/productTypes";
import api from "@/services/apiService";
import { toast } from "sonner";
import { addToCart } from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { USER_API_ROUTES } from "@/routes/api/UserApiRoutes";
import { pentaluxeTheme } from "@/theme";
import { ShoppingBag, Star, Heart, Sparkles } from "lucide-react";

interface IProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<IProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const AddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post(USER_API_ROUTES.CART.ADD_TO_CART, {
        productId: product?._id,
        volume: product.Variants[0].volume,
        stock: product.Variants?.[0].stock,
      });
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message, {
          style: {
            background: pentaluxeTheme.background,
            color: pentaluxeTheme.primary,
            border: `1px solid ${pentaluxeTheme.primary}40`,
          },
        });
        dispatch(addToCart(res.data.data));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === AppHttpStatusCodes.UNAUTHORIZED) {
          navigate("/login");
        }
        toast.error(error.response?.data.message);
      }
    }
  };

  const currentVariant = product.Variants[0];
  const isOutOfStock = currentVariant?.stock === 0;

  return (
    <div
      className="group relative w-full max-w-[280px] bg-[#0c1110]/60 backdrop-blur-xl border border-emerald-200/10 hover:border-emerald-500/30 transition-all duration-700 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
      style={{ borderRadius: "24px" }}
    >
      {/* Upper Part: Image & Overlays */}
      <Link
        to={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden bg-emerald-950/20 m-3 rounded-[20px]"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          src={product.Images[0]}
          alt={product.Name}
        />

        {/* Glass Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status Badge - Floating Style */}
        {isOutOfStock ? (
          <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-red-500/20">
            Sold Out
          </div>
        ) : (
          currentVariant?.stock < 10 && (
            <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-emerald-500 text-black text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-2 h-2" />
              Limited
            </div>
          )
        )}

        {/* Top Right: Wishlist - Glass Style */}
        <button className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-500">
          <Heart className="w-3.5 h-3.5" />
        </button>

        {/* Hover Action: Quick Add - Integrated Design */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
          <button
            onClick={AddToCart}
            disabled={isOutOfStock}
            className="w-full py-3.5 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl shadow-xl shadow-emerald-500/20 hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isOutOfStock ? (
              "Unavailable"
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Lower Part: Info */}
      <div className="px-5 pb-6 pt-2 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-emerald-500/60 font-mono">
              Premium Decant
            </span>
            <h3 className="text-base font-serif text-white truncate max-w-[150px] group-hover:text-emerald-400 transition-colors">
              {product.Name}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-white font-mono leading-none">
              ₹{currentVariant.price}
            </span>
            <span className="text-[10px] text-white/20 line-through font-mono mt-1">
              ₹{currentVariant.price + 500}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-emerald-500/5">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500"
                />
              ))}
              <Star className="w-2.5 h-2.5 fill-emerald-500/20 text-emerald-500/20" />
            </div>
            <span className="text-[10px] text-white/40 font-mono ml-1">
              4.8
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] text-emerald-500 uppercase tracking-widest font-bold">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
