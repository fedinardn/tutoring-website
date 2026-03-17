import type { Metadata } from 'next';
import BlogList from '@/components/BlogList';

export const metadata: Metadata = {
  title: 'Blog - JU STEM Academy',
  description: 'Study tips, subject guides, and academic insights from the JU STEM Academy team.',
};

export default function BlogPage() {
  return (
    <section>
      <div className="container">
        <h2>Our Blog</h2>
        <p className="blog-page-subtitle">
          Study tips, subject guides, and insights from our tutors.
        </p>
        <BlogList />
      </div>
    </section>
  );
}
