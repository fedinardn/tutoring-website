'use client';

import { useState, useEffect } from 'react';
import { getCarouselReviews, Review } from '@/lib/firestore';

export default function TestimonialCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getCarouselReviews().then(setReviews);
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const moveCarousel = (direction: number) => {
    setCurrentSlide((prev) => {
      const next = prev + direction;
      if (next >= reviews.length) return 0;
      if (next < 0) return reviews.length - 1;
      return next;
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="testimonials-carousel" style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ color: '#666' }}>No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="testimonials-carousel">
      <button className="carousel-button prev" onClick={() => moveCarousel(-1)}>
        ❮
      </button>

      <div className="carousel-container">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`testimonial-card ${index === currentSlide ? 'active' : ''}`}
          >
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

      <button className="carousel-button next" onClick={() => moveCarousel(1)}>
        ❯
      </button>

      <div className="carousel-dots">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
