'use client';

import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Review, BlogPost, Block, UserRecord,
  getReviews, addReview, updateReview, deleteReview,
  getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
  getUserRecord, createUserRecord, getUsers, updateUserRole,
  parseBlocks, toSlug,
} from '@/lib/firestore';

const googleProvider = new GoogleAuthProvider();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9); }

const blankReview: Omit<Review, 'id'> = {
  subject: '', stars: '★★★★★', text: '', highlight: '',
  textAfter: '', author: '', role: '', order: 0, showInCarousel: false,
};

const blankPost: Omit<BlogPost, 'id'> = {
  title: '', slug: '', author: 'JU STEM Academy',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  excerpt: '', content: '', coverImage: '', createdAt: Date.now(),
};

const blankBlock = (): Block => ({ id: uid(), type: 'paragraph', content: '', align: 'left' });

type AuthState = 'loading' | 'unauthenticated' | 'checking' | 'denied' | 'granted';

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  // Auth
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Panel
  const [tab, setTab] = useState<'reviews' | 'blog' | 'users'>('reviews');

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<Omit<Review, 'id'>>(blankReview);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Blog
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postForm, setPostForm] = useState<Omit<BlogPost, 'id'>>(blankPost);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([blankBlock()]);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [openStyleId, setOpenStyleId] = useState<string | null>(null);

  // Users
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ── Auth listener ─────────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setFirebaseUser(null); setAuthState('unauthenticated'); return; }
      setFirebaseUser(user);
      setAuthState('checking');
      const record = await getUserRecord(user.email!);
      setAuthState(record?.role === 'admin' ? 'granted' : 'denied');
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (authState === 'granted') { loadReviews(); loadPosts(); loadUsers(); }
  }, [authState]);

  // ── Auth handlers ─────────────────────────────────────────────────────────

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(''); setAuthLoading(true);
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (err) { setAuthError(friendlyError(err)); }
    finally { setAuthLoading(false); }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(''); setAuthLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserRecord(user.email!, {
        email: user.email!,
        displayName: displayName.trim() || email.split('@')[0],
        role: 'user',
        createdAt: Date.now(),
      });
    } catch (err) { setAuthError(friendlyError(err)); }
    finally { setAuthLoading(false); }
  }

  async function handleGoogleSignIn() {
    setAuthError(''); setAuthLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const existing = await getUserRecord(user.email!);
      if (!existing) {
        await createUserRecord(user.email!, {
          email: user.email!,
          displayName: user.displayName || user.email!.split('@')[0],
          role: 'user',
          createdAt: Date.now(),
        });
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code !== 'auth/popup-closed-by-user') setAuthError(friendlyError(err));
    } finally { setAuthLoading(false); }
  }

  async function handleSignOut() { await signOut(auth); setTab('reviews'); }

  function friendlyError(err: unknown): string {
    const code = (err as { code?: string }).code ?? '';
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') return 'Incorrect email or password.';
    if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
    if (code === 'auth/weak-password') return 'Password must be at least 6 characters.';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
    return 'Something went wrong. Please try again.';
  }

  // ── Reviews ───────────────────────────────────────────────────────────────

  async function loadReviews() {
    setReviewLoading(true); setReviews(await getReviews()); setReviewLoading(false);
  }

  async function handleSaveReview(e: React.FormEvent) {
    e.preventDefault(); setReviewLoading(true);
    if (editingReviewId) { await updateReview(editingReviewId, reviewForm); setEditingReviewId(null); }
    else { await addReview(reviewForm); }
    setReviewForm(blankReview); await loadReviews();
  }

  function handleEditReview(r: Review) {
    setEditingReviewId(r.id!);
    setReviewForm({ subject: r.subject, stars: r.stars, text: r.text, highlight: r.highlight, textAfter: r.textAfter, author: r.author, role: r.role, order: r.order, showInCarousel: r.showInCarousel });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeleteReview(id: string) {
    if (!confirm('Delete this review?')) return;
    await deleteReview(id); await loadReviews();
  }

  // ── Blog ──────────────────────────────────────────────────────────────────

  async function loadPosts() {
    setPostLoading(true); setPosts(await getBlogPosts()); setPostLoading(false);
  }

  function resetPostForm() {
    setEditingPostId(null);
    setPostForm(blankPost);
    setBlocks([blankBlock()]);
    setOpenStyleId(null);
  }

  async function handleSavePost(e: React.FormEvent) {
    e.preventDefault(); setPostLoading(true);
    const data = { ...postForm, content: JSON.stringify(blocks), createdAt: editingPostId ? postForm.createdAt : Date.now() };
    if (editingPostId) { await updateBlogPost(editingPostId, data); }
    else { await addBlogPost(data); }
    resetPostForm(); await loadPosts();
  }

  function handleEditPost(p: BlogPost) {
    setEditingPostId(p.id!);
    setPostForm({ title: p.title, slug: p.slug, author: p.author, date: p.date, excerpt: p.excerpt, content: p.content, coverImage: p.coverImage ?? '', createdAt: p.createdAt });
    setBlocks(parseBlocks(p.content).length > 0 ? parseBlocks(p.content) : [blankBlock()]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeletePost(id: string) {
    if (!confirm('Delete this post?')) return;
    await deleteBlogPost(id); await loadPosts();
  }

  function handleTitleChange(title: string) {
    setPostForm(prev => ({ ...prev, title, slug: editingPostId ? prev.slug : toSlug(title) }));
  }

  // ── Block editor ──────────────────────────────────────────────────────────

  function addBlock(type: Block['type']) {
    setBlocks(prev => [...prev, { id: uid(), type, content: '', align: 'left' }]);
    setShowBlockPicker(false);
  }

  function updateBlock(id: string, updates: Partial<Block>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    setBlocks(prev => {
      const arr = [...prev];
      const next = index + dir;
      if (next < 0 || next >= arr.length) return arr;
      [arr[index], arr[next]] = [arr[next], arr[index]];
      return arr;
    });
  }

  function deleteBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async function loadUsers() {
    setUsersLoading(true); setUsers(await getUsers()); setUsersLoading(false);
  }

  async function handleToggleRole(u: UserRecord) {
    if (u.id === firebaseUser?.email) { alert("You can't change your own role."); return; }
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${u.email} to ${newRole}?`)) return;
    await updateUserRole(u.id!, newRole); await loadUsers();
  }

  // ─── Render: loading / checking ───────────────────────────────────────────

  if (authState === 'loading' || authState === 'checking') {
    return (
      <section className="admin-login-section">
        <p style={{ color: '#666' }}>{authState === 'loading' ? 'Loading…' : 'Verifying access…'}</p>
      </section>
    );
  }

  // ─── Render: unauthenticated ──────────────────────────────────────────────

  if (authState === 'unauthenticated') {
    return (
      <section className="admin-login-section">
        <div className="admin-login-box">
          <h2 style={{ textAlign: 'center', marginBottom: '6px' }}>Admin Panel</h2>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginBottom: '28px' }}>JU STEM Academy</p>

          <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={authLoading} type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="admin-divider"><span>or</span></div>

          <div className="admin-auth-toggle">
            <button className={authMode === 'signin' ? 'active' : ''} onClick={() => { setAuthMode('signin'); setAuthError(''); }}>Sign In</button>
            <button className={authMode === 'signup' ? 'active' : ''} onClick={() => { setAuthMode('signup'); setAuthError(''); }}>Sign Up</button>
          </div>

          <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}>
            {authMode === 'signup' && (
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {authError && <p className="admin-auth-error">{authError}</p>}
            <button type="submit" className="form-submit-btn" disabled={authLoading}>
              {authLoading ? 'Please wait…' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ─── Render: denied ───────────────────────────────────────────────────────

  if (authState === 'denied') {
    return (
      <section className="admin-login-section">
        <div className="admin-login-box" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🔒</p>
          <h3 style={{ color: '#00273d', marginBottom: '10px' }}>Access Denied</h3>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '24px' }}>
            {firebaseUser?.email} does not have admin access.<br />Ask an admin to assign you the admin role.
          </p>
          <button className="admin-btn-secondary" onClick={handleSignOut}>Sign Out</button>
        </div>
      </section>
    );
  }

  // ─── Render: granted ──────────────────────────────────────────────────────

  return (
    <section className="admin-section">
      <div className="container">

        <div className="admin-header">
          <div>
            <h2 style={{ textAlign: 'left' }}>Admin Panel</h2>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>{firebaseUser?.email}</p>
          </div>
          <button className="admin-logout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>

        <div className="admin-tabs">
          {(['reviews', 'blog', 'users'] as const).map(t => (
            <button key={t} className={`admin-tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'reviews' ? `Reviews (${reviews.length})` : t === 'blog' ? `Blog Posts (${posts.length})` : `Users (${users.length})`}
            </button>
          ))}
        </div>

        {/* ── Reviews Tab ───────────────────────────────────────────────── */}
        {tab === 'reviews' && (
          <div>
            <div className="admin-card">
              <h3 className="admin-card-title">{editingReviewId ? 'Edit Review' : 'Add New Review'}</h3>
              <form onSubmit={handleSaveReview} className="admin-form">
                <div className="admin-form-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <input value={reviewForm.subject} onChange={e => setReviewForm({ ...reviewForm, subject: e.target.value })} placeholder="e.g. Organic Chemistry" required />
                  </div>
                  <div className="form-group">
                    <label>Stars</label>
                    <select value={reviewForm.stars} onChange={e => setReviewForm({ ...reviewForm, stars: e.target.value })}>
                      <option>★★★★★</option><option>★★★★½</option><option>★★★★</option><option>★★★½</option><option>★★★</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Text (before highlight)</label>
                  <textarea value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} rows={3} placeholder="Opening text…" />
                </div>
                <div className="form-group">
                  <label>Highlighted Text</label>
                  <textarea value={reviewForm.highlight} onChange={e => setReviewForm({ ...reviewForm, highlight: e.target.value })} rows={2} placeholder="Text shown in gold…" />
                </div>
                <div className="form-group">
                  <label>Text After Highlight</label>
                  <textarea value={reviewForm.textAfter} onChange={e => setReviewForm({ ...reviewForm, textAfter: e.target.value })} rows={2} placeholder="Closing text…" />
                </div>
                <div className="admin-form-row">
                  <div className="form-group">
                    <label>Author</label>
                    <input value={reviewForm.author} onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })} placeholder="e.g. J.A." required />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input value={reviewForm.role} onChange={e => setReviewForm({ ...reviewForm, role: e.target.value })} placeholder="e.g. Cornell Student" required />
                  </div>
                  <div className="form-group">
                    <label>Order</label>
                    <input type="number" value={reviewForm.order} onChange={e => setReviewForm({ ...reviewForm, order: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-group admin-checkbox-group">
                  <label>
                    <input type="checkbox" checked={reviewForm.showInCarousel} onChange={e => setReviewForm({ ...reviewForm, showInCarousel: e.target.checked })} />
                    Show in homepage carousel
                  </label>
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn" disabled={reviewLoading}>{editingReviewId ? 'Save Changes' : 'Add Review'}</button>
                  {editingReviewId && <button type="button" className="admin-btn-secondary" onClick={() => { setEditingReviewId(null); setReviewForm(blankReview); }}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h3 className="admin-card-title">All Reviews ({reviews.length})</h3>
              {reviewLoading ? <p style={{ color: '#666' }}>Loading…</p> : (
                <div className="admin-list">
                  {reviews.map(r => (
                    <div key={r.id} className="admin-list-item">
                      <div className="admin-list-item-info">
                        <span className="admin-list-item-title">{r.subject.replace('\n', ' / ')}</span>
                        <span className="admin-list-item-meta">{r.author} · {r.role}{r.showInCarousel && <span className="admin-badge">Carousel</span>}</span>
                      </div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn-sm" onClick={() => handleEditReview(r)}>Edit</button>
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDeleteReview(r.id!)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Blog Tab ──────────────────────────────────────────────────── */}
        {tab === 'blog' && (
          <div>
            <div className="admin-card">
              <h3 className="admin-card-title">{editingPostId ? 'Edit Blog Post' : 'New Blog Post'}</h3>
              <form onSubmit={handleSavePost} className="admin-form">

                {/* Meta fields */}
                <div className="admin-form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Title</label>
                    <input value={postForm.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Author</label>
                    <input value={postForm.author} onChange={e => setPostForm({ ...postForm, author: e.target.value })} required />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Slug (URL)</label>
                    <input value={postForm.slug} onChange={e => setPostForm({ ...postForm, slug: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Date</label>
                    <input value={postForm.date} onChange={e => setPostForm({ ...postForm, date: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Excerpt (shown on blog listing)</label>
                  <textarea value={postForm.excerpt} onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })} rows={2} required />
                </div>

                {/* Cover image */}
                <div className="form-group">
                  <label>Cover Image URL (optional)</label>
                  <input
                    type="text"
                    value={postForm.coverImage}
                    onChange={e => setPostForm({ ...postForm, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {postForm.coverImage && <img src={postForm.coverImage} alt="Cover preview" className="block-image-preview" style={{ marginTop: 10 }} />}
                </div>

                {/* Block Editor */}
                <div className="form-group">
                  <label>Content</label>
                  <div className="block-editor">
                    {blocks.map((block, index) => (
                      <div key={block.id} className="block-item">

                        {/* Block header */}
                        <div className="block-item-header">
                          <select
                            className="block-type-select"
                            value={block.type}
                            onChange={e => updateBlock(block.id, { type: e.target.value as Block['type'] })}
                          >
                            <option value="paragraph">Paragraph</option>
                            <option value="heading2">Heading 2</option>
                            <option value="heading3">Heading 3</option>
                            <option value="image">Image</option>
                            <option value="quote">Quote</option>
                            <option value="divider">Divider</option>
                          </select>
                          <div className="block-item-controls">
                            <button type="button" className="block-ctrl-btn" onClick={() => moveBlock(index, -1)} disabled={index === 0} title="Move up">↑</button>
                            <button type="button" className="block-ctrl-btn" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} title="Move down">↓</button>
                            <button type="button" className={`block-ctrl-btn ${openStyleId === block.id ? 'active' : ''}`} onClick={() => setOpenStyleId(openStyleId === block.id ? null : block.id)} title="Style">✦</button>
                            <button type="button" className="block-delete-btn" onClick={() => deleteBlock(block.id)}>Delete</button>
                          </div>
                        </div>

                        {/* Style panel */}
                        {openStyleId === block.id && block.type !== 'divider' && (
                          <div className="block-style-panel">
                            {block.type !== 'image' && (
                              <div className="style-row">
                                <span className="style-label">Align</span>
                                {(['left', 'center', 'right'] as const).map(a => (
                                  <button key={a} type="button" className={`style-opt ${block.align === a ? 'active' : ''}`} onClick={() => updateBlock(block.id, { align: a })}>{a}</button>
                                ))}
                              </div>
                            )}
                            {block.type === 'paragraph' && (
                              <div className="style-row">
                                <span className="style-label">Size</span>
                                {(['small', 'normal', 'large'] as const).map(s => (
                                  <button key={s} type="button" className={`style-opt ${(block.fontSize ?? 'normal') === s ? 'active' : ''}`} onClick={() => updateBlock(block.id, { fontSize: s })}>{s}</button>
                                ))}
                              </div>
                            )}
                            {['paragraph', 'heading2', 'heading3', 'quote'].includes(block.type) && (
                              <div className="style-row">
                                <span className="style-label">Color</span>
                                <button type="button" className={`style-opt color-default ${(block.color ?? 'default') === 'default' ? 'active' : ''}`} onClick={() => updateBlock(block.id, { color: 'default' })}>Default</button>
                                <button type="button" className={`style-opt color-gold ${block.color === 'gold' ? 'active' : ''}`} onClick={() => updateBlock(block.id, { color: 'gold' })}>Gold</button>
                                <button type="button" className={`style-opt color-navy ${block.color === 'navy' ? 'active' : ''}`} onClick={() => updateBlock(block.id, { color: 'navy' })}>Navy</button>
                              </div>
                            )}
                            {block.type === 'image' && (
                              <>
                                <div className="style-row">
                                  <span className="style-label">Size</span>
                                  {(['small', 'medium', 'full'] as const).map(s => (
                                    <button key={s} type="button" className={`style-opt ${(block.size ?? 'medium') === s ? 'active' : ''}`} onClick={() => updateBlock(block.id, { size: s })}>{s}</button>
                                  ))}
                                </div>
                                <div className="style-row">
                                  <span className="style-label">Align</span>
                                  {(['left', 'center', 'right'] as const).map(a => (
                                    <button key={a} type="button" className={`style-opt ${(block.align ?? 'center') === a ? 'active' : ''}`} onClick={() => updateBlock(block.id, { align: a })}>{a}</button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Block content */}
                        {block.type === 'divider' ? (
                          <div className="block-divider-preview"><hr /></div>
                        ) : block.type === 'image' ? (
                          <div className="block-image-editor">
                            {block.content && <img src={block.content} alt={block.caption || ''} className="block-image-preview" />}
                            <input
                              type="text"
                              placeholder="Paste image URL…"
                              value={block.content}
                              onChange={e => updateBlock(block.id, { content: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="Caption (optional)"
                              value={block.caption || ''}
                              onChange={e => updateBlock(block.id, { caption: e.target.value })}
                              style={{ marginTop: 8 }}
                            />
                          </div>
                        ) : (
                          <textarea
                            className="block-textarea"
                            value={block.content}
                            onChange={e => updateBlock(block.id, { content: e.target.value })}
                            placeholder={
                              block.type === 'paragraph' ? 'Write your paragraph…' :
                              block.type === 'heading2' ? 'Section heading…' :
                              block.type === 'heading3' ? 'Sub-heading…' :
                              'Quote text…'
                            }
                            rows={block.type === 'paragraph' ? 4 : 2}
                          />
                        )}
                      </div>
                    ))}

                    {/* Add block */}
                    <div className="block-add-row">
                      {showBlockPicker ? (
                        <div className="block-picker">
                          {(['paragraph', 'heading2', 'heading3', 'image', 'quote', 'divider'] as Block['type'][]).map(t => (
                            <button key={t} type="button" className="block-picker-btn" onClick={() => addBlock(t)}>
                              {t === 'paragraph' ? '¶ Paragraph' : t === 'heading2' ? 'H2 Heading 2' : t === 'heading3' ? 'H3 Heading 3' : t === 'image' ? '🖼 Image' : t === 'quote' ? '" Quote' : '— Divider'}
                            </button>
                          ))}
                          <button type="button" className="block-picker-cancel" onClick={() => setShowBlockPicker(false)}>Cancel</button>
                        </div>
                      ) : (
                        <button type="button" className="block-add-btn" onClick={() => setShowBlockPicker(true)}>+ Add Block</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn" disabled={postLoading}>{editingPostId ? 'Save Changes' : 'Publish Post'}</button>
                  {editingPostId && <button type="button" className="admin-btn-secondary" onClick={resetPostForm}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h3 className="admin-card-title">All Posts ({posts.length})</h3>
              {postLoading ? <p style={{ color: '#666' }}>Loading…</p> : posts.length === 0 ? (
                <p style={{ color: '#666' }}>No posts yet.</p>
              ) : (
                <div className="admin-list">
                  {posts.map(p => (
                    <div key={p.id} className="admin-list-item">
                      <div className="admin-list-item-info">
                        <span className="admin-list-item-title">{p.title}</span>
                        <span className="admin-list-item-meta">{p.date} · /blog/{p.slug}</span>
                      </div>
                      <div className="admin-list-item-actions">
                        <button className="admin-btn-sm" onClick={() => handleEditPost(p)}>Edit</button>
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDeletePost(p.id!)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ─────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div className="admin-card">
            <h3 className="admin-card-title">User Management</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
              All accounts that have signed up at /adminjustem. Only admins can access the panel.
            </p>
            {usersLoading ? <p style={{ color: '#666' }}>Loading…</p> : (
              <div className="admin-list">
                {users.map(u => (
                  <div key={u.id} className="admin-list-item">
                    <div className="admin-list-item-info">
                      <span className="admin-list-item-title">
                        {u.displayName || u.email}
                        {u.id === firebaseUser?.email && <span style={{ color: '#888', fontWeight: 400, fontSize: '0.8rem' }}> (you)</span>}
                      </span>
                      <span className="admin-list-item-meta">{u.email}</span>
                    </div>
                    <div className="admin-list-item-actions">
                      <span className={`admin-role-badge ${u.role}`}>{u.role}</span>
                      <button
                        className={`admin-btn-sm ${u.role === 'admin' ? 'admin-btn-danger' : ''}`}
                        onClick={() => handleToggleRole(u)}
                        disabled={u.id === firebaseUser?.email}
                      >
                        {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
