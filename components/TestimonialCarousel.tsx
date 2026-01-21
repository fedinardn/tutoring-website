'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    subject: 'Biochemistry\nOrganic Chemistry',
    stars: '★★★★★',
    text: 'Ukana took the time to prepare assignments for me to confirm my understanding of the material, especially the material I found the most challenging. With his help,',
    highlight: 'I found myself achieving grades I did not know I was capable of and improving extensively across all of my courses',
    textAfter: 'when implementing his study methods.',
    author: 'A.M.',
    role: 'Cornell Student',
  },
  {
    subject: 'Cell Biology\nOrganic Chemistry',
    stars: '★★★★★',
    text: 'Joseph really helped me strengthen my problem solving skills for classes like biology and organic chemistry. He challenged me to really think about why an answer was correct and gave insightful tips on what professors typically test students on. He is a very knowledgeable and receptive tutor, and',
    highlight: 'with his help I was able to get As in biology and organic chemistry.',
    textAfter: '',
    author: 'M.L.G',
    role: 'Cornell Student',
  },
  {
    subject: 'General Chemistry',
    stars: '★★★★★',
    text: "Joseph supported my daughter's academic growth through patient, step-by-step instruction and consistent practice.",
    highlight: 'He effectively used modern learning platforms and adapted his teaching to her needs.',
    textAfter: "I have no doubt that the foundation Joseph built can be attributed to my daughter's success in her IB curriculum.",
    author: 'Laura Syer',
    role: 'VP of Budget and Planning, NYU',
  },
  {
    subject: 'Biochemistry I',
    stars: '★★★★★',
    text: 'Ukana provided tutoring services for Biochemistry I which I was able to get an A in. He came prepared with material and was able to articulate it in a way that was easy to understand. It is evident that',
    highlight: 'Ukana values teaching others and is able to connect with clients on a level that makes the sessions seamless and comfortable.',
    textAfter: 'I would recommend Ukana to anyone.',
    author: 'Zahra',
    role: 'Cornell Student',
  },
  {
    subject: 'General Tutoring',
    stars: '★★★★½',
    text: 'Ukana was an excellent tutor. He was always very prepared for each tutoring session, asking questions and reviewing materials that were essential to my preparation for different exams.',
    highlight: 'He was always very responsive and would answer questions off-duty as well.',
    textAfter: 'Additionally, he was very patient with me and would explain things as often as I needed until I understood the content.',
    author: 'T.Z.',
    role: 'Cornell Student',
  },
  {
    subject: 'Organic Chemistry',
    stars: '★★★★★',
    text: 'Ukana was an incredible tutor and helped me do well in organic chemistry last semester.',
    highlight: 'He was wholeheartedly committed to my success.',
    textAfter: 'Despite having his own major responsibilities, he went above and beyond by always being very flexible with meeting times, making practice problems for me to work on between sessions, and coming prepared to each session with a lesson plan tailored to the material taught in my specific class.',
    author: 'K.M.',
    role: 'Cornell Student',
  },
  {
    subject: 'SAT Prep',
    stars: '★★★★★',
    text: "JU STEM Academy was an excellent choice for SAT preparation for my daughter. Her assigned tutor Joe, provided truly personalized support, taking the time to understand her strengths, areas for improvement, and learning style.",
    highlight: "What stood out most was their flexibility—they worked seamlessly around her schoolwork and demanding sports schedule, which made a huge difference for us.",
    textAfter: '',
    author: 'Guardian of SAT Student',
    role: 'Kingswood Oxford Student',
  },
  {
    subject: 'SAT Prep',
    stars: '★★★★★',
    text: '',
    highlight: 'Joseph at JU STEM Academy helped me improve my SAT score from 1170 to 1280 - a 110 point increase in just 1.5 months!',
    textAfter: "He went beyond just practice questions and took the time to review every mistake I made, helping me understand the concepts and recognize the tricks the SAT uses. His approach made my practice so much more effective.",
    author: 'J.A.',
    role: 'Rabun Gap-Nacoochee Student',
  },
];

export default function TestimonialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const moveCarousel = (direction: number) => {
    setCurrentSlide((prev) => {
      const next = prev + direction;
      if (next >= testimonials.length) return 0;
      if (next < 0) return testimonials.length - 1;
      return next;
    });
  };

  return (
    <div className="testimonials-carousel">
      <button className="carousel-button prev" onClick={() => moveCarousel(-1)}>
        ❮
      </button>

      <div className="carousel-container">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`testimonial-card ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="testimonial-header">
              <div className="testimonial-subject" style={{ whiteSpace: 'pre-line' }}>
                {testimonial.subject}
              </div>
              <div className="stars">{testimonial.stars}</div>
            </div>
            <p className="testimonial-text">
              {testimonial.text}
              {testimonial.highlight && (
                <span className="highlight">{testimonial.highlight}</span>
              )}
              {testimonial.textAfter && ` ${testimonial.textAfter}`}
            </p>
            <p className="testimonial-author">{testimonial.author}</p>
            <p className="testimonial-role">{testimonial.role}</p>
          </div>
        ))}
      </div>

      <button className="carousel-button next" onClick={() => moveCarousel(1)}>
        ❯
      </button>

      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
