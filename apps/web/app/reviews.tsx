"use client";
import { useEffect, useState } from 'react';
import { showToast } from '../../../toast';

type Review = {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: string;
};

export function ReviewForm({ productId, onReviewAdded }: { productId: string; onReviewAdded: () => void }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !title || !comment || !author) {
      showToast('Please fill in all fields and select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const review: Review = {
        id: `review_${Date.now()}`,
        productId,
        rating,
        title,
        comment,
        author,
        date: new Date().toISOString()
      };

      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      reviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(reviews));

      showToast('Review submitted successfully!');
      setRating(0);
      setTitle('');
      setComment('');
      setAuthor('');
      onReviewAdded();
    } catch (error) {
      showToast('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginTop: 24 }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Write a Review</h3>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Rating *</label>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: star <= rating ? '#fbbf24' : '#d1d5db'
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Your Name *</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Review Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6, resize: 'vertical' }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '12px 24px',
          background: isSubmitting ? '#94a3b8' : '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export function ReviewList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('reviews') || '[]');
    const productReviews = stored.filter((r: Review) => r.productId === productId);
    setReviews(productReviews.sort((a: Review, b: Review) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [productId, refreshKey]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  if (reviews.length === 0) {
    return (
      <div style={{ marginTop: 24 }}>
        <h3>Reviews</h3>
        <p style={{ color: '#64748b' }}>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Reviews</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} style={{ color: star <= averageRating ? '#fbbf24' : '#d1d5db', fontSize: 16 }}>
                ★
              </span>
            ))}
          </div>
          <span style={{ fontSize: 14, color: '#64748b' }}>
            {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {reviews.map((review) => (
          <div key={review.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{review.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ color: star <= review.rating ? '#fbbf24' : '#d1d5db', fontSize: 14 }}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>by {review.author}</span>
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#64748b' }}>{formatDate(review.date)}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
