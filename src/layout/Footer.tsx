import { Link } from "react-router-dom";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Waves
} from "lucide-react";
import { pentaluxeTheme } from "@/theme";

const Footer = () => {
  return (
    <footer 
      className="relative pt-24 pb-12 overflow-hidden border-t border-emerald-500/10"
      style={{ backgroundColor: pentaluxeTheme.background }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2" />
      
      <div className="max-w-[1600px] mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <span className="text-3xl font-serif tracking-[0.2em] text-white">
                PENTA<span className="text-emerald-500">LUXE</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-light font-sans max-w-sm">
              Crafting sensory masterpieces Since 2024. Our fragrances are portals to high-art and nocturnal elegance. Based in the heart of obsidian luxury.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Instagram className="w-4 h-4" />, link: "#" },
                { icon: <Twitter className="w-4 h-4" />, link: "#" },
                { icon: <Facebook className="w-4 h-4" />, link: "#" },
                { icon: <Waves className="w-4 h-4" />, link: "#" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  className="w-10 h-10 flex items-center justify-center rounded-sm border border-emerald-500/10 text-white/50 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-emerald-500">The Archives</h4>
            <ul className="space-y-4">
              {['Home', 'Collections', 'The Vision', 'Bespoke Services', 'Limited Editions'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                    className="group flex items-center gap-3 text-white/50 hover:text-white transition-all text-sm font-light"
                  >
                    <div className="w-0 group-hover:w-4 h-[1px] bg-emerald-500 transition-all rounded-full" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-emerald-500">Assistance</h4>
            <ul className="space-y-4">
              {['Client Care', 'Sillage Concierge', 'Shipping & Returns', 'Privacy Protocol', 'Terms of Use'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="group flex items-center gap-3 text-white/50 hover:text-white transition-all text-sm font-light"
                  >
                    <div className="w-0 group-hover:w-4 h-[1px] bg-emerald-500 transition-all rounded-full" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-emerald-500">Join the Circle</h4>
            <p className="text-white/50 text-sm font-light">Receive private invitations to limited decants.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Identity" 
                className="w-full bg-[#0c1110] border-b border-white/10 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white pr-10" 
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 pt-4">
               <div className="flex items-center gap-3 text-xs text-white/30">
                  <MapPin className="w-3 h-3 text-emerald-500/50" />
                  <span>The Emerald Tower, Floor 8</span>
               </div>
               <div className="flex items-center gap-3 text-xs text-white/30">
                  <Mail className="w-3 h-3 text-emerald-500/50" />
                  <span>identity@pentaluxe.elite</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-emerald-500/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[9px] uppercase tracking-[0.6em] text-white/20 font-mono">
            © 2024 PentaLuxe Obsidian Reserve — All Rights Manifested
          </div>
          <div className="flex gap-10 items-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] tracking-widest text-white uppercase">Obsidian Grade</span>
             </div>
             <div className="flex items-center gap-2">
                <Waves className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] tracking-widest text-white uppercase">Pure Sillage</span>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
