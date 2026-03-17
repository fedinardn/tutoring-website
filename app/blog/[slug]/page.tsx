'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPostBySlug, BlogPost, Block, parseBlocks } from '@/lib/firestore';

function renderBlock(block: Block) {
  const align = block.align ?? 'left';
  const style: React.CSSProperties = { textAlign: align as React.CSSProperties['textAlign'] };

  switch (block.type) {
    case 'paragraph': {
      const sizeClass = block.fontSize === 'small' ? 'bp-sm' : block.fontSize === 'large' ? 'bp-lg' : 'bp-md';
      const colorClass = block.color === 'gold' ? 'bp-gold' : block.color === 'navy' ? 'bp-navy' : '';
      return <p key={block.id} className={`blog-block-p ${sizeClass} ${colorClass}`} style={style}>{block.content}</p>;
    }
    case 'heading2':
      return <h2 key={block.id} className={`blog-block-h2 ${block.color === 'gold' ? 'bp-gold' : block.color === 'navy' ? 'bp-navy' : ''}`} style={style}>{block.content}</h2>;
    case 'heading3':
      return <h3 key={block.id} className={`blog-block-h3 ${block.color === 'gold' ? 'bp-gold' : block.color === 'navy' ? 'bp-navy' : ''}`} style={style}>{block.content}</h3>;
    case 'image': {
      const sizeClass = block.size === 'small' ? 'bi-sm' : block.size === 'full' ? 'bi-full' : 'bi-md';
      return (
        <figure key={block.id} className={`blog-block-img ${sizeClass}`} style={style}>
          <img src={block.content} alt={block.caption || ''} />
          {block.caption && <figcaption className="blog-block-caption">{block.caption}</figcaption>}
        </figure>
      );
    }
    case 'quote':
      return (
        <blockquote key={block.id} className={`blog-block-quote ${block.color === 'gold' ? 'bp-gold' : block.color === 'navy' ? 'bp-navy' : ''}`} style={style}>
          {block.content}
        </blockquote>
      );
    case 'divider':
      return <hr key={block.id} className="blog-block-divider" />;
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPostBySlug(slug).then(p => { setPost(p); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <section>
        <div className="container">
          <p style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>Loading…</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section>
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ marginBottom: '20px' }}>Post Not Found</h2>
          <Link href="/blog" className="blog-back-link">← Back to Blog</Link>
        </div>
      </section>
    );
  }

  const blocks = parseBlocks(post.content);

  return (
    <section>
      <div className="container">
        <Link href="/blog" className="blog-back-link">← Back to Blog</Link>

        <article className="blog-post-full">
          {/* Cover image */}
          {post.coverImage && (
            <div className="blog-cover-image">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div className="blog-post-meta">
            <span>{post.date}</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="blog-post-title">{post.title}</h1>

          <div className="blog-post-content">
            {blocks.map(block => renderBlock(block))}
          </div>
        </article>
      </div>
    </section>
  );
}
