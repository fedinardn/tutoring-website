'use client';

import { useState } from 'react';
import Image from 'next/image';
import PromoModal from '@/components/PromoModal';
import TutorModal from '@/components/TutorModal';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import CalendlyButton from '@/components/CalendlyButton';
import ContactForm from '@/components/ContactForm';

const tutors = {
  joseph: {
    name: 'Joseph Agyemang',
    title: 'Co-Founder & Lead Consultant',
    image: '/images/joseph.jpg',
    bio: "Hi! I'm Joseph, Co-Founder and Lead Consultant of JU STEM Academy. I graduated Magna cum Laude from Cornell University with a degree in Biology and Society, and I am now a medical student at the University of Pennsylvania's Perelman School of Medicine. I've spent the past 4+ years discovering my passion for education. What I love most about this work is simple: every tutoring session is a chance to transform how a student sees learning and help them believe in their own abilities. Outside the classroom, I'm a die-hard Arsenal fan. I recently made the trip to the UK to watch them play live, and it was absolutely electric! I believe the beautiful game and STEM have a lot in common: both require strategy, creativity, and persistence.",
  },
  ukana: {
    name: 'Ukana Bassey',
    title: 'Co-Founder & Lead Tutor',
    image: '/images/ukana.jpg',
    bio: "Hi! I'm Ukana Bassey, Co-Founder and Lead Academic Tutor of JU STEM Academy. I graduated from Cornell University studying Biology and Society, and I've dedicated the past 4+ years to making STEM education engaging and accessible. My favorite part of this work is creating those breakthrough moments, when a student goes from frustrated to fascinated, when they realize they're capable of so much more than they thought. Outside of academics I enjoy fashion, photography, and endurance training as valuable pastimes!",
  },
};

export default function Home() {
  const [selectedTutor, setSelectedTutor] = useState<keyof typeof tutors | null>(null);

  return (
    <>
      <PromoModal />
      <TutorModal
        isOpen={selectedTutor !== null}
        onClose={() => setSelectedTutor(null)}
        tutor={selectedTutor ? tutors[selectedTutor] : null}
      />

      {/* Mission Section */}
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
            <h2 className="mission-title">
              Making STEM Accessible, One Student at a Time
            </h2>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section>
        <div className="container">
          <h2>Who We Are</h2>
          <p className="about-content">
            JU STEM Academy is a premier tutoring service founded by Cornell
            University graduates with high honors and top test scores. We provide
            expert, personalized instruction across STEM subjects and standardized
            test preparation, helping students master challenging coursework and
            achieve their academic goals. Our mission is simple: making STEM
            accessible, one student at a time.
          </p>
        </div>
      </section>

      {/* What We Offer Section */}
      <section>
        <div className="container">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Mentorship</h3>
              <p>
                Build meaningful relationships with Cornell University graduates
                who provide guidance, support, and inspiration to help you reach
                your full academic potential.
              </p>
            </div>
            <div className="feature-card">
              <h3>Tutoring</h3>
              <p>
                Learn from tutors with proven excellence. Our Cornell graduates
                earned high honors and achieved top test scores, including a 510+
                MCAT, demonstrating true mastery of their subjects.
              </p>
            </div>
            <div className="feature-card">
              <h3>Empathy</h3>
              <p>
                Work with tutors who remember the late-night study sessions, the
                exam anxiety, and the moment concepts finally click. We&apos;ve been
                where you are, and we&apos;re committed to helping you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tutors Section */}
      <section>
        <div className="container">
          <h2>Meet Your Expert Tutors</h2>
          <div className="tutors-grid">
            <div className="tutor-card" onClick={() => setSelectedTutor('joseph')}>
              <Image
                src="/images/joseph.jpg"
                alt="Joseph Agyemang"
                width={180}
                height={180}
                className="tutor-image"
              />
              <h3 className="tutor-name">Joseph Agyemang</h3>
              <p className="tutor-title">Co-Founder & Lead Consultant</p>
              <p className="tutor-degree">University of Pennsylvania<br />MS1</p>
            </div>
            <div className="tutor-card" onClick={() => setSelectedTutor('ukana')}>
              <Image
                src="/images/ukana.jpg"
                alt="Ukana Bassey"
                width={180}
                height={180}
                className="tutor-image"
              />
              <h3 className="tutor-name">Ukana Bassey</h3>
              <p className="tutor-title">Co-Founder & Lead Tutor</p>
              <p className="tutor-degree">Cornell University<br />510+ MCAT</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section>
        <div className="container">
          <h2>Subjects We Teach</h2>
          <div className="subjects-box">
            <p className="subjects-title">PROVIDING EXPERT INSTRUCTION IN</p>
            <div className="subjects-grid">
              <ul className="subject-list">
                <li>General Chemistry</li>
                <li>Organic Chemistry</li>
                <li>Biology</li>
                <li>Biochemistry</li>
                <li>Physics</li>
              </ul>
              <ul className="subject-list">
                <li>Algebra</li>
                <li>AP Exams</li>
                <li>SAT / ACT</li>
                <li>MCAT</li>
                <li>And More!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="container">
          <h2>What Our Students Say</h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="contact-section">
        <div className="container">
          <h2>Get In Touch</h2>
          <p className="about-content" style={{ marginBottom: '30px' }}>
            Have questions about our tutoring services? Ready to start your journey to academic success?
            We&apos;d love to hear from you!
          </p>
          <ContactForm idPrefix="home" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Excel in STEM?</h2>
          <p className="cta-tagline">
            Making STEM Accessible, One Student at a Time<br />
            Mastery Across STEM, backed by A&apos;s and 510+ MCAT tutors.
          </p>
          <div className="cta-container">
            <CalendlyButton className="cta-button">
              Schedule Your Free Consultation
            </CalendlyButton>
          </div>
        </div>
      </section>
    </>
  );
}
