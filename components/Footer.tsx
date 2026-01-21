import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <Link href="/" className="footer-logo-link">
          <Image
            src="/images/logo.png"
            alt="JU STEM Academy Logo"
            width={100}
            height={100}
            className="footer-logo-image"
          />
          <div className="footer-logo">JU STEM ACADEMY</div>
        </Link>

        <div className="social-icons">
          <a
            href="mailto:justemacademy@gmail.com"
            className="social-icon"
            title="Email"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-envelope"></i>
          </a>
          <a
            href="https://instagram.com/justemacademy"
            className="social-icon"
            title="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.tiktok.com/@justemacademy_"
            className="social-icon"
            title="TikTok"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-tiktok"></i>
          </a>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} JU STEM Academy, Inc. Making STEM Accessible.
        </div>
      </div>
    </footer>
  );
}
