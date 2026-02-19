import React from 'react';
import { Quote, Eye, ShieldCheck, Droplets, Sparkles } from 'lucide-react';
import { pentaluxeTheme } from '@/theme';

const AboutPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-[slowZoom_40s_infinite_alternate]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=2000')" }}
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `linear-gradient(135deg, ${pentaluxeTheme.background} 30%, transparent 100%), linear-gradient(to top, ${pentaluxeTheme.background}, transparent)` 
            }}
          />
          {/* Emerald Flow */}
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-emerald-500/10 blur-[180px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="h-px w-24 bg-emerald-500 shadow-[0_0_15px_#10b981]" />
            <span className="text-emerald-500 tracking-[0.8em] uppercase text-[10px] font-bold">The Obsidian Vision</span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-serif leading-none tracking-tighter mb-10">
            Art in <br />
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 italic"
              style={{ WebkitTextStroke: '1px rgba(16, 185, 129, 0.2)' }}
            >
              Invisibility.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light italic font-serif">
            "A perfume is a world in itself, a liquid memory that speaks when words fail."
          </p>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-px h-24 bg-gradient-to-b from-emerald-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* The Origin Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative space-y-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 text-[10px] tracking-[0.4em] uppercase font-bold text-emerald-500/80">Legacy & Lab</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-serif leading-tight">
              Crafting the <br />
              <span className="text-emerald-500 italic">Nocturnal</span> Legacy.
            </h2>
            
            <div className="space-y-8">
              <p className="text-lg text-slate-400 leading-relaxed font-light">
                PentaLuxe was born from an obsession with the darkness. Not the absence of light, but the presence of depth. We believe that true luxury is reserved for those who find beauty in the shadows.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed font-light">
                Our founders traveled from the volcanic shores of Iceland to the dense rain-forests of Borneo to source ingredients that thrive away from the sun. Every bottle is a result of years of meticulous alchemy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                <span className="text-3xl font-serif text-emerald-500 block mb-2">85+</span>
                <span className="text-[10px] tracking-widest uppercase text-slate-500 font-bold">Natural Oils</span>
              </div>
              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                <span className="text-3xl font-serif text-emerald-500 block mb-2">140h</span>
                <span className="text-[10px] tracking-widest uppercase text-slate-500 font-bold">Aging Cycle</span>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="aspect-[4/5] relative z-10 p-4 border border-emerald-500/20 bg-emerald-950/20 rounded-sm overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200" 
                  alt="Alchemy Process" 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
             </div>
             {/* Decorative element */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-emerald-500/10 animate-[spin_20s_linear_infinite]" />
          </div>
        </div>
      </section>

      {/* Values - High End Grid */}
      <section className="py-40 bg-black/40 border-y border-emerald-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32 space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif">The <span className="text-emerald-500 italic">Core</span> Pillars</h2>
            <div className="w-16 h-px bg-emerald-500 mx-auto opacity-50 shadow-[0_0_10px_#10b981]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              {
                icon: <Droplets className="w-10 h-10" />,
                title: "Pure Sillage",
                desc: "We prioritize molecular density, ensuring our scents linger in a room like a silent ghost, evolving with the heat of your pulse."
              },
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                title: "Noble Ethics",
                desc: "Transparency is our only light. We source every nocturnal botanical ethically, ensuring the preserve remains as deep as our scents."
              },
              {
                icon: <Eye className="w-10 h-10" />,
                title: "Obsidian Design",
                desc: "Our bottles are heavy-glass monoliths, crafted to shield the reactive oils from light, preserving the essence for generations."
              }
            ].map((item, i) => (
              <div key={i} className="group space-y-8 hover:bg-emerald-500/5 p-8 transition-colors duration-500 rounded-sm">
                <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed text-sm tracking-wide">
                  {item.desc}
                </p>
                <div className="w-8 h-px bg-emerald-500/20 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Master Artisans Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-emerald-500/10 pb-12 gap-8">
          <h2 className="text-5xl md:text-7xl font-serif leading-none">The <span className="text-emerald-500 italic">Noses</span></h2>
          <p className="max-w-xs text-slate-500 text-xs tracking-[0.3em] uppercase leading-loose font-bold">
            Master alchemists dedicated to the architecture of silence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {[
            {
              name: "Victor Black",
              role: "Head Alchemist",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
            },
            {
              name: "Elena Vora",
              role: "Molecular Architect",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
            },
            {
              name: "Kaelen Thorne",
              role: "Sillage Curator",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
            }
          ].map((person, idx) => (
            <div key={idx} className="group relative">
              <div className="aspect-[3/4] overflow-hidden bg-black border border-emerald-500/10 rounded-sm mb-8 filter grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <div className="space-y-2 text-center md:text-left px-4">
                <h4 className="text-2xl font-serif text-white group-hover:text-emerald-500 transition-colors uppercase tracking-widest">{person.name}</h4>
                <div className="flex items-center gap-4 justify-center md:justify-start overflow-hidden">
                   <div className="h-px w-0 group-hover:w-8 bg-emerald-500 transition-all duration-500" />
                   <p className="text-emerald-500/60 text-[10px] tracking-[0.4em] uppercase font-bold">{person.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Banner */}
      <section className="relative py-60 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#05070a]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center space-y-16">
          <Quote className="w-12 h-12 text-emerald-500/20 mx-auto" />
          <h3 className="text-4xl md:text-6xl font-serif italic text-white/90 leading-tight tracking-wide">
            "We don't sell scent. We sell the invisible shield that protects your identity in a world of light."
          </h3>
          <cite className="text-emerald-500 tracking-[0.6em] uppercase text-xs not-italic font-bold block">
            — The Obsidian Manifesto
          </cite>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </section>

      {/* Subscription/CTA */}
      <section className="py-40 relative bg-emerald-950/[0.02]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-16 relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-[5rem] font-serif leading-none">Find Your <br /> <span className="text-emerald-500 italic">Signature</span></h2>
            <p className="text-slate-500 text-lg font-light tracking-wide">Experience the architecture of scent. Your private reserve is waiting.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <button className="group relative px-12 py-5 bg-emerald-600 text-black font-bold uppercase text-[10px] tracking-[0.4em] rounded-sm transition-all hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              Enter The Archives
              <span className="absolute inset-0 border border-white/20 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            </button>
            <button className="px-12 py-5 border border-emerald-500/20 text-emerald-500 font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-emerald-500/5 hover:border-emerald-500 transition-all">
              Private Curations
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-emerald-500/5 text-center">
        <p className="text-emerald-500/20 text-[9px] tracking-[0.6em] uppercase font-bold">© 2024 PentaLuxe Obsidian Reserve — Established in Silence</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
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

export default AboutPage;
