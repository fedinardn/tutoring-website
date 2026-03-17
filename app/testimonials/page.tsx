import type { Metadata } from 'next';
import TestimonialsGrid from '@/components/TestimonialsGrid';

export const metadata: Metadata = {
  title: 'Testimonials - JU STEM Academy',
  description: 'Read what our students say about their experience with JU STEM Academy tutoring services.',
};

export default function TestimonialsPage() {
  return (
    <section>
      <div className="container">
        <h2>What Our Students Say</h2>
        <TestimonialsGrid />
      </div>
    </section>
  );
}
