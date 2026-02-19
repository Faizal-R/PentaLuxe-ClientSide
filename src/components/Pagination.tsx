import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<T> {
  items: T[]; 
  itemsPerPage: number; 
  onPageChange: (currentPageData: T[]) => void; 
}

const Pagination = <T,>({
  items,
  itemsPerPage,
  onPageChange,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items ? items.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (items) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageItems = items.slice(startIndex, endIndex);
      onPageChange(currentPageItems);
    }
  }, [currentPage, items, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-6 mt-12 py-10 border-t border-emerald-500/5">
      <div className="flex items-center gap-4">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-500 border text-[10px] font-bold uppercase tracking-[0.3em] ${
            currentPage === 1
              ? "border-emerald-500/5 text-slate-800 cursor-not-allowed"
              : "border-emerald-500/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-500 hover:bg-emerald-500/[0.02]"
          }`}
        >
          <ChevronLeft className="w-3 h-3" /> Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-sm transition-all duration-500 text-xs font-mono font-bold ${
                currentPage === index + 1
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/5"
              }`}
            >
              {(index + 1).toString().padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-500 border text-[10px] font-bold uppercase tracking-[0.3em] ${
            currentPage === totalPages
              ? "border-emerald-500/5 text-slate-800 cursor-not-allowed"
              : "border-emerald-500/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-500 hover:bg-emerald-500/[0.02]"
          }`}
        >
          Next <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <p className="text-[9px] text-slate-700 uppercase tracking-widest font-bold">
        Archive Page <span className="text-emerald-500/60 font-mono italic">{currentPage}</span> of <span className="text-emerald-500/60 font-mono italic">{totalPages}</span>
      </p>
    </div>
  );
};

export default Pagination;
