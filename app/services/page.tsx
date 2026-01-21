'use client';

import CalendlyButton from '@/components/CalendlyButton';

const packages = [
  { name: 'Trial Package', details: '1 hour', price: '$25' },
  { name: 'Foundation Builder', details: '5 hours', price: '$250' },
  { name: 'Academic Achiever', details: '10 hours', price: '$550' },
  { name: 'Excellence Program', details: '20 hours', price: '$1,100' },
  { name: "Scholar's Edge", details: '30 hours', price: '$1,500' },
];

const services = [
  {
    title: 'College Course Tutoring',
    price: 'Starting at $25/hour',
    description: 'Expert help with undergraduate STEM courses including Chemistry, Biology, Physics, and more.',
  },
  {
    title: 'SAT/ACT Prep',
    price: 'Starting at $25/hour',
    description: 'Comprehensive test preparation to maximize your standardized test scores for college admissions.',
  },
  {
    title: 'K-12 Tutoring',
    price: 'Starting at $25/hour',
    description: 'Personalized tutoring for elementary through high school students in all STEM subjects.',
  },
  {
    title: 'College Application & Essays Consulting',
    price: 'Starting at $25/hour',
    description: 'Expert guidance through the college application process and essay writing from Cornell graduates.',
  },
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

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-item">
              <h3>{service.title}</h3>
              <p className="service-price">{service.price}</p>
              <p className="service-description">{service.description}</p>
              <div className="packages-list">
                <h4>Available Packages:</h4>
                {packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="package-item">
                    <div>
                      <div className="package-name">{pkg.name}</div>
                      <div className="package-details">{pkg.details}</div>
                    </div>
                    <div className="package-price">{pkg.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
