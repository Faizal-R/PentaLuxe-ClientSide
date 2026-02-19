import { Link } from 'react-router-dom'
import { Heart, Sparkles } from "lucide-react";

const EmptyWishlist = () => {
  return (
    <div className='flex flex-col items-center justify-center space-y-8 py-40 px-6 text-center animate-in fade-in duration-1000'>
      <div className="relative">
        <Heart className='h-24 w-24 text-emerald-500/10' strokeWidth={1} />
        <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-emerald-500/40 animate-pulse" />
      </div>
      
      <div className="space-y-4">
        <h3 className='text-3xl md:text-5xl font-serif text-white italic'>Empty Archives.</h3>
        <p className='text-slate-500 text-xs tracking-[0.3em] uppercase font-bold max-w-md'>
          You haven't preserved any manifestations in your private reserve yet.
        </p>
      </div>

      <Link
        className='mt-8 rounded-sm bg-emerald-600 px-10 py-5 text-[10px] font-bold uppercase tracking-[0.4em] text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]'
        to='/products'
      >
        Discover The Essence
      </Link>
    </div>
  )
}

export default EmptyWishlist;
