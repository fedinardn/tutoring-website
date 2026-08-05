'use client';

import { useState, useEffect } from 'react';

/*
 * ============================================================================
 *  FORMSPREE SETUP (ACTION REQUIRED)
 * ----------------------------------------------------------------------------
 *  Applications submitted through this form are emailed to justemacademy@gmail.com
 *  using Formspree (https://formspree.io) — a free service that forwards form
 *  submissions to your inbox with no backend required.
 *
 *  TO ACTIVATE:
 *    1. Go to https://formspree.io and sign up (or log in) using
 *       justemacademy@gmail.com.
 *    2. Click "New Form", give it a name (e.g. "Tutor Applications"), and set
 *       the send-to email to justemacademy@gmail.com.
 *    3. Formspree will give you an endpoint that looks like:
 *          https://formspree.io/f/abcdwxyz
 *       Copy the form ID (the part after "/f/", e.g. "abcdwxyz").
 *    4. Replace the placeholder "YOUR_FORM_ID" below with that real ID.
 *
 *  Until a real ID is set, submissions will fall back to opening the visitor's
 *  email client (mailto:) addressed to justemacademy@gmail.com so no
 *  application is ever lost.
 * ============================================================================
 */
const FORMSPREE_FORM_ID = 'YOUR_FORM_ID';
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
const CONTACT_EMAIL = 'justemacademy@gmail.com';

const HANDSHAKE_URL =
  'https://app.joinhandshake.com/public/jobs/11250005?utm_source=web&utm_campaign=job_share&utm_medium=copy_link&utm_content=emp-copy_link-job_page';

const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

const EXPERIENCE_OPTIONS = [
  'Pre-professional Development',
  'High School Subjects',
  'AP/IB',
  'SAT',
  'ACT',
  'SAT Subject Tests',
  'College Essay',
  'College Application',
  'Other',
];

const AVAILABILITY_OPTIONS = [
  '<5 hours',
  '5-10 hours',
  '10-15 hours',
  '15+ hours',
];

export default function TutorApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    graduationYear: '',
    major: '',
    gpa: '',
    coursesARange: '',
    satScore: '',
    actScore: '',
    availability: '',
    background: '',
    transcriptAcknowledged: false,
    resumeAttached: false,
  });
  const [experience, setExperience] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const toggleExperience = (option: string) => {
    setExperience((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Fallback: build a mailto: link with the application details so nothing is
  // lost if Formspree has not been configured yet.
  const buildMailtoFallback = () => {
    const lines = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `University Attended: ${formData.university}`,
      `Graduation Year: ${formData.graduationYear}`,
      `Major: ${formData.major}`,
      `GPA: ${formData.gpa}`,
      `Tutoring Experience: ${experience.join(', ') || 'None selected'}`,
      `A/A- Courses & TA/Peer Tutor Experience: ${formData.coursesARange}`,
      `SAT Score (out of 1600): ${formData.satScore}`,
      `ACT Score (out of 36): ${formData.actScore}`,
      `Availability per week: ${formData.availability}`,
      `Background / Qualifications: ${formData.background}`,
      `Transcript acknowledged: ${formData.transcriptAcknowledged ? 'Yes' : 'No'}`,
      `Resume attached separately: ${formData.resumeAttached ? 'Yes' : 'No'}`,
    ];
    const subject = encodeURIComponent(
      `Tutor Application — ${formData.name || 'New Applicant'}`
    );
    const body = encodeURIComponent(lines.join('\n'));
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.transcriptAcknowledged) {
      setStatus('error');
      setStatusMessage(
        `Please confirm you will email your unofficial transcript to ${CONTACT_EMAIL}.`
      );
      return;
    }

    // If Formspree has not been configured yet, fall back to mailto: so the
    // applicant's information still reaches justemacademy@gmail.com.
    if (FORMSPREE_FORM_ID === 'YOUR_FORM_ID') {
      window.location.href = buildMailtoFallback();
      setStatus('success');
      setStatusMessage(
        "Your email client should now open with your application ready to send. If it didn't, please email your details to " +
          CONTACT_EMAIL +
          '.'
      );
      return;
    }

    setStatus('loading');

    try {
      const payload = {
        ...formData,
        tutoringExperience: experience.join(', '),
      };

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
        setStatusMessage(
          "Thank you for applying! We've received your application and will review it on a rolling basis."
        );
        setFormData({
          name: '',
          email: '',
          phone: '',
          university: '',
          graduationYear: '',
          major: '',
          gpa: '',
          coursesARange: '',
          satScore: '',
          actScore: '',
          availability: '',
          background: '',
          transcriptAcknowledged: false,
          resumeAttached: false,
        });
        setExperience([]);
      } else {
        setStatus('error');
        setStatusMessage('Something went wrong submitting your application. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="tutor-form-box">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ta-name">Name *</label>
          <input
            type="text"
            id="ta-name"
            name="name"
            required
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-email">Email Address *</label>
          <input
            type="email"
            id="ta-email"
            name="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-phone">Phone *</label>
          <input
            type="tel"
            id="ta-phone"
            name="phone"
            required
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-graduation-year">Graduation Year *</label>
          <select
            id="ta-graduation-year"
            name="graduationYear"
            required
            value={formData.graduationYear}
            onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
          >
            <option value="" disabled>
              Select a year
            </option>
            {GRADUATION_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ta-university">Which university did you attend? *</label>
          <input
            type="text"
            id="ta-university"
            name="university"
            required
            placeholder="e.g. Cornell University"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-major">Major *</label>
          <input
            type="text"
            id="ta-major"
            name="major"
            required
            placeholder="e.g. Biology, Computer Science"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-gpa">GPA *</label>
          <input
            type="text"
            id="ta-gpa"
            name="gpa"
            required
            placeholder="e.g. 3.9"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Tutoring Experience</label>
          <p className="form-help-text">Select all that apply.</p>
          <div className="checkbox-grid">
            {EXPERIENCE_OPTIONS.map((option) => (
              <label key={option} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={experience.includes(option)}
                  onChange={() => toggleExperience(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ta-courses">A/A- Courses &amp; TA / Peer Tutor Experience</label>
          <p className="form-help-text">
            Please list any college courses you earned an A/A- in and/or courses you have served
            as a Teaching Assistant or Peer Tutor for.
          </p>
          <textarea
            id="ta-courses"
            name="coursesARange"
            placeholder="e.g. Organic Chemistry (A), Calculus II (A-), TA for Intro Biology..."
            value={formData.coursesARange}
            onChange={(e) => setFormData({ ...formData, coursesARange: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-sat">SAT Score (out of 1600) *</label>
          <input
            type="number"
            id="ta-sat"
            name="satScore"
            required
            min={0}
            max={1600}
            placeholder="e.g. 1520"
            value={formData.satScore}
            onChange={(e) => setFormData({ ...formData, satScore: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-act">ACT Score (out of 36) *</label>
          <input
            type="number"
            id="ta-act"
            name="actScore"
            required
            min={0}
            max={36}
            placeholder="e.g. 34"
            value={formData.actScore}
            onChange={(e) => setFormData({ ...formData, actScore: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ta-availability">Availability Per Week</label>
          <select
            id="ta-availability"
            name="availability"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          >
            <option value="" disabled>
              Select your availability
            </option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ta-background">Background &amp; Qualifications</label>
          <p className="form-help-text">
            In a short paragraph (up to 5 sentences), tell us about your background and why you
            would make a great tutor.
          </p>
          <textarea
            id="ta-background"
            name="background"
            placeholder="Share your teaching philosophy, relevant experience, and strengths..."
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
          />
        </div>

        <div className="form-group">
          <div className="checkbox-item required-check">
            <input
              type="checkbox"
              id="ta-transcript"
              checked={formData.transcriptAcknowledged}
              onChange={(e) =>
                setFormData({ ...formData, transcriptAcknowledged: e.target.checked })
              }
            />
            <label htmlFor="ta-transcript">
              <strong>Mandatory:</strong> email your unofficial transcript to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="ta-resume"
              checked={formData.resumeAttached}
              onChange={(e) => setFormData({ ...formData, resumeAttached: e.target.checked })}
            />
            <label htmlFor="ta-resume">
              (Optional) I will email my resume to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </label>
          </div>
        </div>

        <div className="handshake-callout">
          <p>
            <strong>Or apply through our Handshake posting:</strong>
          </p>
          <a 
            href={HANDSHAKE_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="handshake-button"
          >
            Apply via Handshake
          </a>
        </div>

        <button type="submit" className="form-submit-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit Application'}
        </button>

        {status !== 'idle' && status !== 'loading' && (
          <div className={`form-status ${status}`}>{statusMessage}</div>
        )}
      </form>
    </div>
  );
}
