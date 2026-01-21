import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials - JU STEM Academy',
  description: 'Read what our students say about their experience with JU STEM Academy tutoring services.',
};

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
    text: 'Ukana was my tutor for 1st semester General Chemistry (CHEM2070) through the on-ramp program. Whenever he saw that I didn\'t understand,',
    highlight: 'he would go through the material again slowly and create useful analogies which helped deepen my understanding.',
    textAfter: 'He was also very approachable and made asking questions easy which helped a lot as I was a freshman.',
    author: 'G.D.',
    role: 'Cornell Student',
  },
  {
    subject: 'Biology\nAlgebra 1&2',
    stars: '★★★★★',
    text: "Joseph supported my daughter's academic growth through patient, step-by-step instruction and consistent practice.",
    highlight: 'He effectively used modern learning platforms and adapted his teaching to her needs.',
    textAfter: "I have no doubt that the foundation Joseph built can be attributed to my daughter's success in her IB curriculum.",
    author: 'Laura Syer',
    role: 'VP of Budget and Planning, NYU',
  },
  {
    subject: 'Introductory Biology',
    stars: '★★★★★',
    text: 'Working with Ukana really helped me turn things around in my Biology course. Before I was struggling and feeling overwhelmed,',
    highlight: 'but his consistent support helped me gain confidence and eventually finish the class with a high grade.',
    textAfter: 'His annotated slides helped break down complex topics in a more digestible way, especially for memorizing detailed concepts.',
    author: 'BIOG1440 Student',
    role: 'Cornell Student',
  },
  {
    subject: 'General Chemistry',
    stars: '★★★★★',
    text: 'Joseph was incredibly patient and made complex chemistry concepts clear and intuitive. He never fed me answers but always guided me through my reasoning, asking probing questions.',
    highlight: 'He helped me develop stronger study habits and effective problem-solving strategies that I continue to use.',
    textAfter: 'His tutoring truly transformed how I approach difficult subjects.',
    author: 'K.N',
    role: 'Cornell Student',
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
    subject: 'Algebra 1 & 2',
    stars: '★★★★★',
    text: 'Joseph was an excellent tutor for my daughter while she was taking Algebra 1 & 2 in high school. He was knowledgeable of the material, always prepared, and made sure their time together was fun and productive.',
    highlight: 'I highly recommend him!',
    textAfter: '',
    author: 'J.B',
    role: 'Guardian of High School Student',
  },
  {
    subject: 'Organic Chemistry',
    stars: '★★★★★',
    text: 'I just recently started tutoring with JU STEM Academy for organic chemistry and have been really impressed so far! They are extremely knowledgeable and good at breaking down hard concepts and guiding me during practice problems without giving away answers.',
    highlight: "With JU STEM Academy's help I was able to score significantly higher on my midterm which I appreciate!",
    textAfter: '',
    author: 'Emi E.',
    role: 'University of Pennsylvania Student',
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
    textAfter: 'Despite having his own major responsibilities, he went above and beyond by always being very flexible with meeting times, making practice problems for me to work on between sessions, and coming prepared to each session with a lesson plan tailored to the material taught in my specific class. If you have the chance to learn from Ukana, I 1000% recommend.',
    author: 'K.M.',
    role: 'Cornell Student',
  },
  {
    subject: 'SAT Prep',
    stars: '★★★★★',
    text: "JU STEM Academy was an excellent choice for SAT preparation for my daughter. Her assigned tutor Joe, provided truly personalized support, taking the time to understand her strengths, areas for improvement, and learning style.",
    highlight: "What stood out most was their flexibility—they worked seamlessly around her schoolwork and demanding sports schedule, which made a huge difference for us.",
    textAfter: 'We saw clear growth in both her skills and confidence, and we are very grateful to JU STEM Academy for their dedication and support.',
    author: 'Guardian of SAT Student',
    role: 'Kingswood Oxford Student',
  },
  {
    subject: 'SAT Prep',
    stars: '★★★★★',
    text: '',
    highlight: 'Joseph at JU STEM Academy helped me improve my SAT score from 1170 to 1280 - a 110 point increase in just 1.5 months!',
    textAfter: "He went beyond just practice questions and took the time to review every mistake I made, helping me understand the concepts and recognize the tricks the SAT uses. His approach made my practice so much more effective. If you need SAT tutoring that gets real results, I highly recommend JU STEM Academy!",
    author: 'J.A.',
    role: 'Rabun Gap-Nacoochee Student',
  },
];

export default function TestimonialsPage() {
  return (
    <section>
      <div className="container">
        <h2>What Our Students Say</h2>
        <div className="testimonials-full-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-full-card">
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
      </div>
    </section>
  );
}
