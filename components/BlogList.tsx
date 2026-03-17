'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogPosts, BlogPost } from '@/lib/firestore';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="blog-loading">Loading posts…</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="blog-empty">
        <p>No posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="blog-feed">
      {posts.map((post) => (
        <article key={post.id} className="blog-card">
          <div className="blog-card-meta">
            <span className="blog-card-date">{post.date}</span>
            <span className="blog-card-author">By {post.author}</span>
          </div>
          <h3 className="blog-card-title">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <Link href={`/blog/${post.slug}`} className="blog-read-more">
            Read More →
          </Link>
        </article>
      ))}
    </div>
  );
}
