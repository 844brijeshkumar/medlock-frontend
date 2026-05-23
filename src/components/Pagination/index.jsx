import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center mt-12 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center p-1.5 bg-white rounded-full shadow-xl shadow-teal-900/5 border border-gray-100">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all active:scale-95 group"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="px-6 py-2 flex items-center gap-2 select-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Page
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-800 tabular-nums leading-none">
              {currentPage}
            </span>
            <span className="text-gray-300 text-sm">/</span>
            <span className="text-sm font-medium text-gray-500 tabular-nums leading-none">
              {totalPages}
            </span>
          </div>
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all active:scale-95 group"
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Pagination;
