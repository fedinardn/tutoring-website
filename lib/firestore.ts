import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserRecord {
  id?: string;  // Firestore doc ID = user's email
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export interface Block {
  id: string;
  type: 'paragraph' | 'heading2' | 'heading3' | 'image' | 'quote' | 'divider';
  content: string;         // text content or image URL
  caption?: string;        // image caption
  align?: 'left' | 'center' | 'right';
  fontSize?: 'small' | 'normal' | 'large';  // paragraph only
  color?: 'default' | 'gold' | 'navy';      // text blocks
  size?: 'small' | 'medium' | 'full';       // image blocks
}

export interface Review {
  id?: string;
  subject: string;
  stars: string;
  text: string;
  highlight: string;
  textAfter: string;
  author: string;
  role: string;
  order: number;
  showInCarousel: boolean;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;    // JSON.stringify(Block[])
  coverImage?: string;
  createdAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function parseBlocks(content: string): Block[] {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  // Legacy plain-text fallback
  if (!content) return [];
  return content.split('\n\n').filter(Boolean).map((text, i) => ({
    id: String(i),
    type: 'paragraph' as const,
    content: text,
  }));
}

function reviewFromDoc(d: QueryDocumentSnapshot): Review {
  const data = d.data();
  return {
    id: d.id,
    subject: data.subject ?? '',
    stars: data.stars ?? '★★★★★',
    text: data.text ?? '',
    highlight: data.highlight ?? '',
    textAfter: data.textAfter ?? '',
    author: data.author ?? '',
    role: data.role ?? '',
    order: data.order ?? 0,
    showInCarousel: data.showInCarousel ?? false,
  };
}

function postFromDoc(d: QueryDocumentSnapshot): BlogPost {
  const data = d.data();
  return {
    id: d.id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    author: data.author ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    coverImage: data.coverImage ?? '',
    createdAt: data.createdAt ?? 0,
  };
}

// ─── Users (doc ID = email) ───────────────────────────────────────────────────

export async function getUserRecord(email: string): Promise<UserRecord | null> {
  const snap = await getDoc(doc(db, 'users', email));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { id: snap.id, email: d.email, displayName: d.displayName ?? '', role: d.role, createdAt: d.createdAt };
}

export async function createUserRecord(email: string, data: Omit<UserRecord, 'id'>): Promise<void> {
  await setDoc(doc(db, 'users', email), data);
}

export async function getUsers(): Promise<UserRecord[]> {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'asc')));
  return snap.docs.map((d) => ({
    id: d.id,
    email: d.data().email,
    displayName: d.data().displayName ?? '',
    role: d.data().role,
    createdAt: d.data().createdAt,
  }));
}

export async function updateUserRole(email: string, role: 'admin' | 'user'): Promise<void> {
  await updateDoc(doc(db, 'users', email), { role });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  const snap = await getDocs(query(collection(db, 'reviews'), orderBy('order', 'asc')));
  return snap.docs.map(reviewFromDoc);
}

export async function getCarouselReviews(): Promise<Review[]> {
  const snap = await getDocs(query(
    collection(db, 'reviews'),
    where('showInCarousel', '==', true),
    orderBy('order', 'asc'),
  ));
  return snap.docs.map(reviewFromDoc);
}

export async function addReview(review: Omit<Review, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'reviews'), review);
  return ref.id;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  await updateDoc(doc(db, 'reviews', id), data as Record<string, unknown>);
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', id));
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  const snap = await getDocs(query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc')));
  return snap.docs.map(postFromDoc);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await getDocs(query(collection(db, 'blogPosts'), where('slug', '==', slug)));
  if (snap.empty) return null;
  return postFromDoc(snap.docs[0]);
}

export async function addBlogPost(post: Omit<BlogPost, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'blogPosts'), post);
  return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  await updateDoc(doc(db, 'blogPosts', id), data as Record<string, unknown>);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'blogPosts', id));
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getPrices(): Promise<Record<string, string>> {
  const snap = await getDoc(doc(db, 'settings', 'prices'));
  if (!snap.exists()) return {};
  return snap.data() as Record<string, string>;
}

export async function setPrices(prices: Record<string, string>): Promise<void> {
  await setDoc(doc(db, 'settings', 'prices'), prices);
}


