'use client';

import CalendlyButton from '@/components/CalendlyButton';

const subjects = [
  'General Chemistry',
  'Organic Chemistry',
  'MCAT',
  'Biology',
  'Biochemistry',
  'Physics',
  'Algebra',
  'Medical School Applications',
  'College Applications',
  'AP Exams',
  'SAT / ACT',
];

const packages = [
  { name: 'Trial Package', details: '1 hour', link: 'https://buy.stripe.com/dRmdR9bJ6dspag9dbTf3a08' },
  { name: 'Foundation Builder', details: '5 hours', link: 'https://buy.stripe.com/28E9ATcNaagdewpfk1f3a04' },
  { name: 'Academic Achiever', details: '10 hours', link: 'https://buy.stripe.com/28E4gzaF23RP0Fz7Rzf3a05' },
  { name: 'Excellence Program', details: '20 hours', link: 'https://buy.stripe.com/eVq4gz8wUbkhewpfk1f3a06' },
  { name: "Scholar's Edge", details: '30 hours', link: 'https://buy.stripe.com/7sY28r28w3RP2NH5Jrf3a07' },
];

export default function ServicesPage() {
  return (
    <section>
      <div className="container">
        <h2>Our Services</h2>
        <p className="about-content">
          Choose from our comprehensive tutoring services designed to help you
          excel in your academic journey.
        </p>

        <div className="subjects-section">
          <h3>What We Teach</h3>
          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-item">
                {subject}
              </div>
            ))}
          </div>
        </div>

        <div className="packages-section">
          <h3>Packages</h3>
          <p className="packages-intro">Starting at $60</p>
          <div className="packages-list">
            {packages.map((pkg, index) => (
              <div key={index} className="package-item">
                <div>
                  <div className="package-name">{pkg.name}</div>
                  <div className="package-details">{pkg.details}</div>
                </div>
                <a
                  href={pkg.link}
                  className="package-buy-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Now
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-container">
          <CalendlyButton className="cta-button">
            Schedule Your Free Consultation
          </CalendlyButton>
        </div>
      </div>
    </section>
  );
}
