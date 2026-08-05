import type { Metadata } from 'next';
import Image from 'next/image';
import TutorApplicationForm from '@/components/TutorApplicationForm';

export const metadata: Metadata = {
  title: 'Become a Tutor | JU STEM Academy',
  description:
    'Join the JU STEM Academy team. Apply to become a tutor and help make STEM accessible, one student at a time.',
};

export default function BecomeATutorPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="mission-section">
        <Image
          src="/images/stem-background.png"
          alt="Background"
          fill
          className="background-image"
          priority
        />
        <div className="mission-overlay">
          <div className="container">
            <h2 className="mission-title">BECOME A TUTOR</h2>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section>
        <div className="container">
          <h2>Join the JU STEM Academy Team</h2>
          <p className="about-content">
            At JU STEM Academy, our tutors are the heart of our mission to make STEM accessible,
            one student at a time. We&apos;re a team of high-achieving educators who love helping
            students believe in their own abilities. If that sounds like you, we&apos;d love for
            you to apply.
          </p>
        </div>
      </section>

      {/* Application Section */}
      <section className="contact-section">
        <div className="container">
          <h2>Application</h2>
          <p className="about-content" style={{ marginBottom: '20px' }}>
            Application is reviewed on a rolling basis. If you would like to apply to become a
            tutor, feel free to fill out the form below anytime!
          </p>
          <p className="about-content compensation-note" style={{ marginBottom: '40px' }}>
            Competitive hourly compensation ranging from $20&ndash;30/hour, determined by academic
            credentials, teaching experience, subject expertise, and interview performance.
          </p>
          <TutorApplicationForm />
        </div>
      </section>
    </>
  );
}
