'use client';

import { useEffect, useState } from 'react';
import { getReviews, Review } from '@/lib/firestore';

export default function TestimonialsGrid() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
        No reviews yet. Add some from the{' '}
        <a href="/admin" style={{ color: '#e4b118' }}>admin panel</a>.
      </p>
    );
  }

  return (
    <div className="testimonials-full-grid">
      {reviews.map((review) => (
        <div key={review.id} className="testimonial-full-card">
          <div className="testimonial-header">
            <div className="testimonial-subject" style={{ whiteSpace: 'pre-line' }}>
              {review.subject}
            </div>
            <div className="stars">{review.stars}</div>
          </div>
          <p className="testimonial-text">
            {review.text}
            {review.text && review.highlight && ' '}
            {review.highlight && <span className="highlight">{review.highlight}</span>}
            {review.textAfter && ` ${review.textAfter}`}
          </p>
          <p className="testimonial-author">{review.author}</p>
          <p className="testimonial-role">{review.role}</p>
        </div>
      ))}
    </div>
  );
}
