import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
        Math.max(currentPage - 3, 0),
        Math.min(currentPage + 2, totalPages)
    )

    return (
        <div className=' flex justify-center gap-4 mt-8'>
            {/* prev button */}
            <button
                className={`px-3 py-1 bg-gray-200 rounded-full
                     ${currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-200"
                    }`}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft />
                
            </button>

            {/* page numbers */}
            <div className='bg-white shadow-2xl px-4 py-2 rounded-full flex gap-2'>
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 rounded-full
                            ${currentPage === page 
                            ?"bg-primaryCol text-white" 
                            :" hover:bg-gray-100"
                            }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

            </div>
            {/* next Button */}
            <button
                className={`px-3 py-1  bg-gray-200 rounded-full
                     ${currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-200"}
            `}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight />
            </button>
        </div>
    )
}

export default Pagination