import React, { useEffect, useState } from 'react';
import { getProductReviews, getReviewSummary } from '../services/reviewApi';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setReviews([]);
    setSummary(null);
    setSubmitted(false);
    setCustomerName('');
    setRating(5);
    setComment('');

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
  const approvedReviews = reviews.filter((review) => review.status === 'APPROVED');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!customerName.trim() || !comment.trim() || rating < 1 || rating > 5) return;

    // Frontend demo only: no API request and no database persistence.
    setSubmitted(true);
    setCustomerName('');
    setRating(5);
    setComment('');
  };

  return (
    <div className="mt-10 space-y-6">
      {/* Section 1: Published customer reviews */}
      <section className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8">
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
                <span className="text-amber-500 text-xl" aria-label={`${average.toFixed(1)} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.round(average) ? '★' : '☆'
                  ).join('')}
                </span>
                <span className="text-xl font-bold">{average.toFixed(1)}</span>
                <span className="text-sm text-stone-500">({count} reviews)</span>
              </div>
            ) : (
              <p className="text-stone-500 text-sm">No approved reviews yet.</p>
            )}

            {/* Exactly four review rows fit; remaining reviews scroll within this box. */}
            <div
              className="max-h-[320px] overflow-y-auto overscroll-contain pr-2"
              aria-label="Customer reviews list; scroll to read more"
              tabIndex={approvedReviews.length > 4 ? 0 : undefined}
            >
              {approvedReviews.map((review) => (
                <div
                  key={review.id}
                  className="h-20 overflow-hidden border-t border-[#E8DFD3] py-3"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold text-sm text-stone-800 truncate">{review.customerName}</p>
                    <span className="text-amber-500 shrink-0" aria-label={`${review.rating} out of 5 stars`}>
                      {'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-1 text-sm text-stone-600 line-clamp-2 whitespace-pre-line">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {approvedReviews.length > 4 && (
              <p className="mt-3 text-xs text-stone-500">Scroll inside this section to read more reviews.</p>
            )}
          </>
        )}
      </section>

      {/* Section 2: Separate frontend-only review form */}
      <section className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-5">
        <h2 className="text-xl font-serif font-bold text-[#2B241D] mb-1">
          Write a Review
        </h2>
        <p className="text-xs text-stone-500 mb-3">Share your experience with this product.</p>

        {submitted && (
          <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
            ✓ Review added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="review-customer-name" className="mb-1 block text-sm font-medium text-stone-800">
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              id="review-customer-name"
              type="text"
              required
              maxLength={100}
              value={customerName}
              onChange={(event) => {
                setCustomerName(event.target.value);
                if (submitted) setSubmitted(false);
              }}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-[#E8DFD3] bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <fieldset>
            <legend className="mb-1 text-sm font-medium text-stone-800">
              Your Rating <span className="text-red-600">*</span>
            </legend>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => {
                      setRating(starValue);
                      if (submitted) setSubmitted(false);
                    }}
                    aria-label={`Rate ${starValue} out of 5 stars`}
                    aria-pressed={rating === starValue}
                    className={`text-2xl leading-none transition hover:scale-110 ${starValue <= rating ? 'text-amber-500' : 'text-stone-300'}`}
                  >
                    {starValue <= rating ? '★' : '☆'}
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-stone-500">{rating}/5</span>
            </div>
          </fieldset>

          <div>
            <label htmlFor="review-comment" className="mb-1 block text-sm font-medium text-stone-800">
              Your Review <span className="text-red-600">*</span>
            </label>
            <textarea
              id="review-comment"
              required
              rows={2}
              maxLength={2000}
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                if (submitted) setSubmitted(false);
              }}
              placeholder="Write your review here..."
              className="w-full resize-y rounded-xl border border-[#E8DFD3] bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#08765B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#065c47]"
          >
            Submit Review
          </button>
        </form>
              </section>
    </div>
  );
}
