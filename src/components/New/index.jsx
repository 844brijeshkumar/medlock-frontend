import React, { useState } from 'react';
import { newsData } from '../../utils';

const itemsPerPage = 4;

const NewsFeed = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = newsData.news.slice(startIndex, endIndex);

  const totalPages = Math.ceil(newsData.news.length / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div className="mx-auto rounded-lg shadow-xl" style={{ boxShadow: 'var(--color-shadow)' }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
        Latest Health News
      </h2>
      <div
        className="overflow-hidden rounded-lg border"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {currentItems.map((item, index) => (
          <a
            key={startIndex + index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center p-4 transition-colors duration-300"
            style={{ backgroundColor: 'var(--color-card-bg)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-card-bg)')}
          >
            <div className="mr-4 h-16 w-24 flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.heading}
                className="h-full w-full rounded-md object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="text-xs" style={{ color: 'var(--color-card-text)' }}>
                <span className="font-semibold">{item.date}</span> | <span className="font-medium">{item.category}</span>
              </div>
              <h3
                className="mt-1 text-base font-semibold hover:underline"
                style={{ color: 'var(--color-card-text)' }}
              >
                {item.heading}
              </h3>
            </div>
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-4 gap-x-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="rounded-md px-4 py-2 text-white transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-50 mt-2 mb-2"
          style={{
            background: 'linear-gradient(to right, #0b4f4a, #1a756f, #2a9b94)',
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          className="rounded-md px-4 py-2 text-white transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-50 mt-2 mb-2"
          style={{
            background: 'linear-gradient(to right, #0b4f4a, #1a756f, #2a9b94)',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;