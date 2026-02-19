import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Clock,
  ArrowRight,
  Droplets,
  Star,
  MonitorPlay,
  Zap,
  Waves,
} from "lucide-react";

import { IProduct } from "@/types/productTypes";
import { pentaluxeTheme } from "@/theme";
import { ProductService } from "@/services/user/ProductService";

interface Categories {
  _id: string;
  categoryName: string;
  categoryImage: string;
}

const HomePage = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [activeStat, setActiveStat] = useState(0);

  const getCategories = useCallback(async () => {
    const res = await ProductService.getCategories();
    if (res.success) {
      setCategories(res.data);
    }
  }, []);

  const getProducts = useCallback(async () => {
    const res = await ProductService.getProducts();
    if (res.success) {
      setProducts(res.data);
    }
  }, []);

  useEffect(() => {
    getCategories();
    getProducts();

    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [getCategories, getProducts]);

  return (
    <div
      className="min-h-screen overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-black"
      style={{
        backgroundColor: pentaluxeTheme.background,
        color: pentaluxeTheme.foreground,
      }}
    >
      {/* Cinematic Hero Section */}
      <section className="relative h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Background Layer: Gradient + Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-[slowZoom_40s_infinite_alternate]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1616948641544-22d23f3832ca?auto=format&fit=crop&q=80&w=2000')",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${pentaluxeTheme.background} 30%, transparent 100%), linear-gradient(to top, ${pentaluxeTheme.background}, transparent)`,
            }}
          />
          {/* Emerald Flow */}
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-[-40px]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 tracking-[0.3em] uppercase text-[10px] font-bold">
                New Essence Collection
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif leading-none tracking-tighter">
              A Dark <br />
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 italic"
                style={{ WebkitTextStroke: "1px rgba(16, 185, 129, 0.2)" }}
              >
                Bloom.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 max-w-md leading-relaxed font-light">
              PentaLuxe obsidian series: where the deepest forest notes meet the
              sharpest midnight air. Experience the silence of luxury.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/products">
                <button className="group relative px-10 py-5 bg-emerald-600 text-black font-bold uppercase text-[10px] tracking-[0.3em] overflow-hidden rounded-sm transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <span className="relative z-10 flex items-center gap-3">
                    Enter the Void{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-10" />
                </button>
              </Link>
              <button className="flex items-center gap-4 text-emerald-500/80 hover:text-emerald-400 transition-colors">
                <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/5">
                  <MonitorPlay className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  Watch The Film
                </span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center relative">
            <div className="w-full max-w-[420px] aspect-[4/5] relative z-10 bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-sm shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000"
                alt="Primary Scent"
                className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/80 backdrop-blur-2xl border border-emerald-500/20 p-8 flex flex-col justify-center shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500/80">
                    Sillage
                  </span>
                </div>
                <div className="w-full bg-emerald-500/10 h-1 mt-2">
                  <div className="bg-emerald-500 h-full w-[85%] shadow-[0_0_10px_#10b981]" />
                </div>
                <span className="text-[8px] uppercase tracking-widest text-slate-500 mt-3 font-mono">
                  Persistence: 85%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-gradient-to-b from-[#10b981] to-transparent animate-pulse" />
        </div>
      </section>

      {/* Feature Stats Grid - Interactive */}
      <section className="py-24 border-y border-emerald-500/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              tag: "01",
              label: "Midnight Sourcing",
              value: "Rare Nocturnal Botanicals",
            },
            {
              tag: "02",
              label: "Expert Alchemy",
              value: "140hrs Fermentation Process",
            },
            {
              tag: "03",
              label: "Global Reach",
              value: "Available in 15 Boutiques",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 transition-opacity duration-700 ${activeStat === i ? "opacity-100" : "opacity-40"}`}
            >
              <span className="text-emerald-500 font-mono text-[10px]">
                {stat.tag}
              </span>
              <h4 className="text-xl font-serif text-white">{stat.label}</h4>
              <p className="text-emerald-500/60 text-xs tracking-widest uppercase">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-emerald-500 tracking-[0.4em] uppercase text-[10px] font-bold">
              Archives
            </span>
            <h2 className="text-5xl md:text-6xl font-serif">
              Curated <span className="italic text-emerald-500">Realms</span>
            </h2>
          </div>
          <p className="max-w-xs text-slate-500 text-sm font-light leading-relaxed">
            Every bottle is a portal to a different dimension. Choose your
            journey through our emerald archives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category._id}`}
              className="group relative h-[400px] overflow-hidden rounded-lg border border-emerald-500/10 hover:border-emerald-500/40 transition-all duration-700"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${category.categoryImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-emerald-500/60 text-[8px] tracking-[0.3em] uppercase block mb-2 font-mono">
                  Archive No. {category._id.slice(-3)}
                </span>
                <h3 className="text-2xl font-serif text-white mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  {category.categoryName}
                </h3>
                <div className="flex items-center gap-4 text-emerald-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[10px] tracking-widest uppercase font-bold">
                    Catalogue Access
                  </span>
                  <div className="h-px flex-grow bg-emerald-500/30" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals - Midnight Grid */}
      <section className="py-32 bg-emerald-950/[0.03] relative overflow-hidden">
        {/* Decorative Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="w-24 h-px bg-emerald-500 mx-auto mb-8 shadow-[0_0_10px_#10b981]" />
            <h2 className="text-5xl md:text-7xl font-serif mb-6">
              Latest <span className="text-emerald-500">Manifestations</span>
            </h2>
            <p className="text-slate-500 text-sm tracking-[0.2em] font-light uppercase">
              Decanted for the discerning few
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Ambient Parallax Banner */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-fixed grayscale-[0.7] opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-6xl font-serif leading-tight">
              The Silence <br />
              <span className="text-emerald-500">In Every Bottle.</span>
            </h2>
            <div className="flex gap-12">
              <div className="space-y-2">
                <span className="text-emerald-500 text-3xl font-serif">
                  14h
                </span>
                <p className="text-[10px] tracking-widest text-slate-500 uppercase">
                  Average Sillage Persistence
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-emerald-500 text-3xl font-serif">
                  85%
                </span>
                <p className="text-[10px] tracking-widest text-slate-500 uppercase">
                  Natural Oil Concentration
                </p>
              </div>
            </div>
            <button className="px-10 py-4 border border-emerald-500/40 text-emerald-500 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-emerald-500 hover:text-black transition-all">
              Our Vision
            </button>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-px h-[100%] bg-emerald-500/20 absolute right-[50%] hidden lg:block" />
            <blockquote className="text-3xl md:text-4xl font-serif italic text-white/90 leading-snug text-right border-r-4 border-emerald-500 pr-10">
              "Luxury isn't about being noticed, it's about being remembered
              without a single word spoken."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Trust Grid - High End */}
      <section className="py-40 px-6 border-t border-emerald-500/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8" />,
              label: "Absolute Quality",
              sub: "Signature Cert",
            },
            {
              icon: <Droplets className="w-8 h-8" />,
              label: "Pure Extracts",
              sub: "Grasse Sourced",
            },
            {
              icon: <Clock className="w-8 h-8" />,
              label: "12hr Mastery",
              sub: "Endurance Tested",
            },
            {
              icon: <Leaf className="w-8 h-8" />,
              label: "Noble Vegan",
              sub: "Ethical Decant",
            },
            {
              icon: <Star className="w-8 h-8" />,
              label: "Exclusive",
              sub: "Private Reserve",
            },
          ].map((item, i) => (
            <div key={i} className="group text-center space-y-6">
              <div className="inline-flex p-6 rounded-sm bg-emerald-500/5 border border-emerald-500/10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-500 text-emerald-500">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-1">
                  {item.label}
                </h3>
                <p className="text-emerald-500/50 text-[10px] tracking-widest uppercase font-mono">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Midnight Subscription */}
      <section className="py-40 bg-gradient-to-t from-emerald-950/20 to-transparent border-t border-emerald-500/10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="inline-block p-4 rounded-full bg-emerald-500/5 border border-emerald-500/10 animate-spin-slow">
            <Sparkles className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif">
            Join the <br />{" "}
            <span className="text-emerald-500 italic">
              Ethereal Inner-Circle
            </span>
          </h2>
          <p className="text-slate-500 text-lg font-light max-w-xl mx-auto">
            Exclusive access to archived collections, private scent consults,
            and experimental blends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative group">
            <input
              type="text"
              placeholder="YOUR CONTACT IDENTIFIER"
              className="w-full bg-black/40 border border-emerald-500/10 px-8 py-5 text-[10px] tracking-[0.2em] uppercase focus:outline-none focus:border-emerald-500 transition-all text-emerald-500 placeholder:text-emerald-950"
            />
            <button className="bg-emerald-600 text-black px-10 py-5 font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-emerald-400 transition-all">
              Submit
            </button>
            <div className="absolute inset-0 border border-emerald-500/20 -m-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </section>

      <footer className="py-20 text-center relative border-t border-emerald-500/5">
        <div className="mb-8 flex items-center justify-center gap-6">
          <div className="h-px w-20 bg-emerald-500/20" />
          <span className="text-4xl font-serif tracking-[0.1em] text-white">
            PENTA<span className="text-emerald-500">LUXE</span>
          </span>
          <div className="h-px w-20 bg-emerald-500/20" />
        </div>
        <p className="text-[#10b981]/30 text-[8px] tracking-[0.8em] uppercase">
          Private Reserve — Obsidian Collections 2024
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ovo&family=Oswald:wght@200;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        ::-webkit-scrollbar {
          width: 5px;
        }

        ::-webkit-scrollbar-track {
          background: #05070a;
        }

        ::-webkit-scrollbar-thumb {
          background: #064e3b;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
