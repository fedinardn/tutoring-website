'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import CalendlyButton from './CalendlyButton';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/services', label: 'SERVICES' },
  { href: '/team', label: 'OUR TEAM' },
  { href: '/testimonials', label: 'TESTIMONIALS' },
  { href: '/blog', label: 'BLOG' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <div className="logo-wrapper">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="JU STEM Academy Logo"
                width={100}
                height={100}
              />
            </Link>
            <Link href="/">
              <span className="logo-text">JU STEM ACADEMY</span>
            </Link>
          </div>

          <div
            className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-cta-wrapper ${menuOpen ? 'open' : ''}`}>
            <nav className="main-navigation">
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={pathname === link.href ? 'active' : ''}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="cta-button-container">
              <CalendlyButton className="header-cta-button">
                SCHEDULE A CONSULTATION
              </CalendlyButton>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      <div
        className={`menu-overlay ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
