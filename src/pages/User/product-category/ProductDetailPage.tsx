import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IProduct } from "@/types/productTypes";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ProductCard from "@/components/ProductCard";
import { pentaluxeTheme } from "@/theme";
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { ProductService } from "@/services/user/ProductService";
import { CartService } from "@/services/user/CartService";
import { WishlistService } from "@/services/user/WishlistService";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [wishlistToggle, setWishlistToggle] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [discountPrice, setDiscountPrice] = useState(0);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    const res = await ProductService.getProductById(id);
    if (res.success) {
      const prod = res.data;
      setProduct(prod);
      if (prod.Variants?.length > 0) {
        setSelectedVolume(prod.Variants[0].volume);
      }
      fetchRelatedProducts(prod.CategoryId.categoryName);
    }
  }, [id]);

  const fetchRelatedProducts = async (categoryName: string) => {
    const res = await ProductService.getRelatedProducts(categoryName);
    if (res.success) setRelatedProducts(res.data);
  };

  const checkWishlistStatus = useCallback(async () => {
    if (!id) return;
    const res = await WishlistService.checkInWishlist(id);
    if (res.success) setWishlistToggle(true);
  }, [id]);

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
    window.scrollTo(0, 0);
  }, [fetchProduct, checkWishlistStatus]);

  useEffect(() => {
    if (!product || !selectedVolume) return;
    const variant = product.Variants.find((v) => v.volume === selectedVolume);
    if (variant && product.DiscountPercentage) {
      const finalPrice =
        variant.price - (variant.price * product.DiscountPercentage) / 100;
      setDiscountPrice(Math.round(finalPrice));
    } else if (variant) {
      setDiscountPrice(variant.price);
    }
  }, [selectedVolume, product]);

  const handleAddToCart = async () => {
    const selectedVariant = product?.Variants.find(
      (v) => v.volume === selectedVolume,
    );
    const res = await CartService.addToCart({
      productId: product?._id,
      volume: selectedVolume,
      stock: selectedVariant?.stock,
    });
    if (res.success) {
      dispatch(addToCart(res.data));
    } else if (res.status === 401) {
      navigate("/login");
    }
  };

  const toggleWishlist = async () => {
    if (wishlistToggle) {
      const res = await WishlistService.removeFromWishlist(
        product?._id as string,
      );
      if (res.success) setWishlistToggle(false);
    } else {
      const res = await WishlistService.addToWishlist({
        productId: product?._id,
        variant: selectedVolume,
      });
      if (res.success) setWishlistToggle(true);
    }
  };

  const selectedVariant = product?.Variants.find(
    (v) => v.volume === selectedVolume,
  );
  const isOutOfStock = selectedVariant?.stock === 0;

  if (!product) return null;

  return (
    <div
      className="min-h-screen font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden"
      style={{
        backgroundColor: pentaluxeTheme.background,
        color: pentaluxeTheme.foreground,
      }}
    >
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12 py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 text-emerald-500/40 hover:text-emerald-500 transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-emerald-500/10 flex items-center justify-center group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="uppercase text-[9px] tracking-[0.5em] font-bold">
              Return to Collection
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-20 items-start max-w-7xl mx-auto">
          {/* Left: The Compact Studio Capsule */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-square bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[40px] overflow-hidden group shadow-2xl flex items-center justify-center">
              {/* Visual Depth Elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

              {/* Main Product Display - Small & Focused */}
              <div className="relative w-[75%] h-[75%] flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full" />
                <TransformWrapper>
                  <TransformComponent
                    wrapperClass="!w-full !h-full"
                    contentClass="!w-full !h-full flex items-center justify-center"
                  >
                    <img
                      src={product.Images[selectedImageIndex]}
                      alt={product.Name}
                      className="relative z-10 w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                    />
                  </TransformComponent>
                </TransformWrapper>
                {/* Realistic Contact Shadow */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-black/80 blur-2xl rounded-[100%]" />
              </div>

              {/* Wishlist Toggle Overlay - Integrated Corner */}
              <button
                onClick={toggleWishlist}
                className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full border backdrop-blur-md transition-all duration-300 ${
                  wishlistToggle
                    ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "bg-black/40 border-white/10 text-white/40 hover:text-emerald-400"
                }`}
              >
                <Heart
                  className={`w-4 h-4 mx-auto ${wishlistToggle ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Minimalist Thumbnails */}
            <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.Images.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border transition-all duration-500 flex-shrink-0 ${
                    selectedImageIndex === index
                      ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] scale-105"
                      : "border-white/5 grayscale hover:grayscale-0 hover:border-emerald-500/20"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: The Info Sanctuary - Ultra Compact */}
          <div className="space-y-4">
            {/* Essential Heading Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-emerald-500" />
                  <span className="text-emerald-500 tracking-[0.3em] uppercase text-[7px] font-bold">
                    Profile: {product.CategoryId.categoryName}
                  </span>
                </div>
                {/* In Stock Indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[7px] text-emerald-500 font-bold uppercase tracking-wider">
                    In Stock
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tighter leading-tight">
                  {product.Name}
                </h1>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500"
                      />
                    ))}
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold border-l border-white/5 pl-2 ml-1">
                    Archive #842
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-slate-500 font-bold  max-w-lg transition-all duration-500">
                {product.Description}
              </p>
            </div>

            {/* Fluid Conversion Flow - High Density */}
            <div className="space-y-5 pt-2">
              {/* Pricing Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tighter">
                    ₹{discountPrice}
                  </span>
                  {product.DiscountPercentage > 0 && (
                    <span className="text-base text-slate-700 line-through font-mono">
                      ₹{selectedVariant?.price}
                    </span>
                  )}
                </div>

                {product.DiscountPercentage > 0 && (
                  <div className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-bold uppercase tracking-widest rounded-full">
                    -{product.DiscountPercentage}% Off
                  </div>
                )}
              </div>

              {/* Volume Selection - Small Specimen Boxes */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-emerald-500/60 font-bold">
                    Extraction Protocol
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-white/10 font-mono italic">
                    {selectedVolume}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.Variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVolume(v.volume)}
                      className={`w-[48px] h-[48px] flex flex-col items-center justify-center border transition-all duration-300 rounded-xl ${
                        selectedVolume === v.volume
                          ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10"
                          : "bg-white/[0.02] text-white/20 border-white/5 hover:border-emerald-500/20 hover:text-white"
                      }`}
                    >
                      <span className="text-[11px] font-bold font-mono leading-none">
                        {v.volume.replace(/\D/g, "")}
                      </span>
                      <span className="text-[10px] font-bold opacity-40 mt-0.5 text-center">
                        ML
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Conversion Action */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`group/buy w-full py-3.5 flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.5em] uppercase transition-all duration-500 rounded-xl active:scale-95 ${
                    isOutOfStock
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-emerald-600 text-black hover:bg-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover/buy:scale-110" />
                  {isOutOfStock ? "Depleted" : "Add to Cart"}
                </button>

                <div className="flex items-center justify-center gap-6 opacity-20">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-[7px] uppercase tracking-widest font-bold">
                      Priority Shipping
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="text-[7px] uppercase tracking-widest font-bold">
                      Essence Grade A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Context Sections */}
        <section className="mt-32 pt-24 border-t border-emerald-500/10 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              title: "Scent Evolution",
              desc: "A complex molecular structure that shifts from metallic top notes to a deep obsidian resonance over 14 hours.",
            },
            {
              title: "Studio Process",
              desc: "Cold-pressed in controlled environments to preserve the delicate chains of olfactory data within every decant.",
            },
            {
              title: "Preservation",
              desc: "Housed in heavy obsidian glass to eliminate UV interference and maintain the integrity of the essence.",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-4 group">
              <h4 className="text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-bold group-hover:translate-x-2 transition-transform duration-500">
                {item.title}
              </h4>
              <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Related Realms */}
        <section className="mt-32 mb-16 space-y-16">
          <div className="flex items-baseline gap-12">
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter">
              Parallel{" "}
              <span className="text-emerald-500 italic underline decoration-1 underline-offset-8">
                Visions.
              </span>
            </h2>
            <div className="hidden md:block h-[1px] flex-grow bg-emerald-500/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts?.slice(0, 4).map((product) => (
              <div
                key={product._id}
                className="hover:-translate-y-4 transition-transform duration-700"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
