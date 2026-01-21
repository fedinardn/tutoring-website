import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <section className="contact-section">
      <div className="container">
        <h2>Get In Touch</h2>
        <p className="about-content" style={{ marginBottom: '50px' }}>
          Have questions about our tutoring services? Ready to start your journey to academic success?
          We&apos;d love to hear from you!
        </p>
        <ContactForm idPrefix="contact" />
      </div>
    </section>
  );
}
