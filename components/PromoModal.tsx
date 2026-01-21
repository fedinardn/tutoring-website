'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hidePromo = localStorage.getItem('hidePromoModal');
    if (hidePromo !== 'true') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem('hidePromoModal', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`promo-modal ${isVisible ? 'visible' : ''}`} onClick={closeModal}>
      <div className="promo-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-promo" onClick={closeModal}>&times;</span>
        <i className="fas fa-gift promo-icon"></i>
        <h2 className="promo-title">Refer a Friend and Save!</h2>
        <p className="promo-message">
          Claim a permanent 25% off your hourly rate when a student you recommend purchases any package!
        </p>
        <Link href="/services" className="promo-cta" onClick={closeModal}>
          View Our Packages
        </Link>
        <div className="promo-footer">
          *Discount applies to all future sessions after referral purchase
        </div>
        <label className="dont-show-again">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Don&apos;t show this again
        </label>
      </div>
    </div>
  );
}
