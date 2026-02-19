import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Settings,
  Search,
  Menu,
  X
} from "lucide-react";
import { setCartProducts } from "@/store/slices/cartSlice";
import { toast } from "sonner";
import { logOut } from "@/store/slices/userSlice";
import { pentaluxeTheme } from "@/theme";
import { CartService } from "@/services/user/CartService";

const Header = () => {
  const user = useSelector((state: any) => state.user.user);
  const cartLength = useSelector((state: any) => state.cart.products?.length);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCartProducts = useCallback(async () => {
    const res = await CartService.getCart();
    if (res.success) {
      dispatch(setCartProducts(res.data || []));
    }
  }, [dispatch]);

  const logoutHandler = async () => {
    localStorage.clear();
    dispatch(logOut());
    dispatch(setCartProducts([]));
    toast.success("Logged out successfully");
    navigate('/');
  };

  useEffect(() => {
    getCartProducts();
  }, [getCartProducts]);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => 
    `relative text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-300 ${
      isActive ? "" : "text-white/70"
    }`;

  const activeLinkBase = { color: pentaluxeTheme.primary };

  const iconActionStyle = "relative p-2 text-white/80 transition-all duration-300 hover:scale-110";

  return (
    <header 
      className={`sticky top-0 left-0 w-full z-[100] transition-all duration-500 border-b backdrop-blur-xl py-4 shadow-2xl`}
      style={{ 
        backgroundColor: `${pentaluxeTheme.background}F2`, // F2 for 95% opacity
        borderColor: `${pentaluxeTheme.border}40` 
      }}
    >
      <div className="max-w-[1600px] mx-auto px-8 flex justify-between items-center">
        
        {/* Left: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12 flex-1">
          <NavLink to="/" className={navLinkStyle} style={({ isActive }) => isActive ? activeLinkBase : {}}>
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: pentaluxeTheme.primary }} />
          </NavLink>
          <NavLink to="/products" className={navLinkStyle} style={({ isActive }) => isActive ? activeLinkBase : {}}>
            Shop
          </NavLink>
          <NavLink to="/about" className={navLinkStyle} style={({ isActive }) => isActive ? activeLinkBase : {}}>
            The Vision
          </NavLink>
        </nav>

        {/* Center: Logo */}
        <Link to="/" className="flex flex-col items-center group">
           <span className="text-2xl md:text-3xl font-serif tracking-[0.2em] text-white group-hover:text-emerald-400 transition-colors" style={{ color: pentaluxeTheme.foreground }}>
             PENTA<span style={{ color: pentaluxeTheme.primary }}>LUXE</span>
           </span>
           <span className="text-[7px] tracking-[0.6em] uppercase mt-1" style={{ color: `${pentaluxeTheme.primary}80` }}>Obsidian Reserve</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1 justify-end">
          
          {/* Search */}
          <button className={iconActionStyle}>
            <Search className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative">
            {user ? (
              <div 
                className="group/user"
                onClick={()=>setIsOpen(prev=>!prev)}
              >
                <button className={iconActionStyle}>
                  <User className="w-5 h-5" />
                </button>
                
                {/* User Dropdown */}
                <div 
                   className={`absolute right-0 top-full mt-2 w-56 bg-[#0c1110] border border-emerald-500/10 shadow-2xl py-2 rounded-sm transition-all duration-300 origin-top-right ${
                     isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                   }`}
                >
                  <div className="px-4 py-3 border-b border-emerald-500/5 mb-2">
                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-serif truncate text-white">{user.name || user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-2 text-xs text-white/70 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                  >
                    <Settings className="w-4 h-4" /> Account Settings
                  </Link>
                  <button 
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={iconActionStyle}>
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <NavLink to="/wishlist" className={iconActionStyle} style={({ isActive }) => isActive ? activeLinkBase : {}}>
            <Heart className="w-5 h-5" />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full border border-black animate-pulse opacity-0 group-hover:opacity-100" 
              style={{ backgroundColor: pentaluxeTheme.primary }}
            />
          </NavLink>

          {/* Cart */}
          <Link to="/cart" className={iconActionStyle}>
            <ShoppingBag className="w-5 h-5" />
            {cartLength > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 text-black text-[9px] font-bold flex items-center justify-center rounded-full shadow-lg"
                style={{ backgroundColor: pentaluxeTheme.primary, boxShadow: `0 0 10px ${pentaluxeTheme.primary}80` }}
              >
                {cartLength}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 top-[76px] z-[90] p-8 transition-transform duration-500 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: pentaluxeTheme.background }}
      >
        <nav className="flex flex-col gap-8">
          <NavLink to="/" className="text-4xl font-serif text-white transition-colors" style={({ isActive }) => isActive ? activeLinkBase : {}} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" className="text-4xl font-serif text-white transition-colors" style={({ isActive }) => isActive ? activeLinkBase : {}} onClick={() => setMobileMenuOpen(false)}>Collections</NavLink>
          <NavLink to="/about" className="text-4xl font-serif text-white transition-colors" style={({ isActive }) => isActive ? activeLinkBase : {}} onClick={() => setMobileMenuOpen(false)}>Our Story</NavLink>
          <div className="h-px w-full mt-12 opacity-10" style={{ backgroundColor: pentaluxeTheme.primary }} />
          <div className="flex gap-6 mt-12">
             <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-xs tracking-[0.3em] uppercase transition-colors" style={{ color: pentaluxeTheme.primary }}>Wishlist</Link>
             <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="text-xs tracking-[0.3em] uppercase transition-colors" style={{ color: pentaluxeTheme.primary }}>Bag ({cartLength})</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
