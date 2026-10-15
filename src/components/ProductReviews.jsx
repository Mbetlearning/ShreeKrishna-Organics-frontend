
import React, { useEffect, useState } from 'react';
import { getProductReviews, getReviewSummary } from '../services/reviewApi';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');
    setReviews([]);
    setSummary(null);

    Promise.all([
      getProductReviews(productId),
      getReviewSummary(productId),
    ])
      .then(([reviewData, summaryData]) => {
        if (!active) return;

        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setSummary(summaryData);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load reviews.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const count = Number(summary?.reviewCount ?? 0);
  const average = Number(summary?.averageRating ?? 0);

  return (
    <section className="mt-10 bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8">
      <h2 className="text-2xl font-serif font-bold text-[#2B241D] mb-5">
        Customer Reviews
      </h2>

      {loading ? (
        <p className="text-sm text-stone-500">Loading reviews...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      ) : (
        <>
          {count > 0 ? (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-amber-500 text-xl">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(average) ? '★' : '☆'
                ).join('')}
              </span>
              <span className="text-xl font-bold">
                {average.toFixed(1)}
              </span>
              <span className="text-sm text-stone-500">
                ({count} reviews)
              </span>
            </div>
          ) : (
            <p className="text-stone-500 text-sm">
              No approved reviews yet.
            </p>
          )}

          <div className="space-y-4">
            {reviews
              .filter((review) => review.status === 'APPROVED')
              .map((review) => (
                <div
                  key={review.id}
                  className="border-t border-[#E8DFD3] pt-4"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold text-stone-800">
                      {review.customerName}
                    </p>
                    <span className="text-amber-500">
                      {'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="mt-2 text-sm text-stone-600 whitespace-pre-line">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </section>
  );
}
