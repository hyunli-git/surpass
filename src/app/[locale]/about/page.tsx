// src/app/about/page.tsx

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Kim",
      role: "CEO & Founder",
      bio: "Former IELTS examiner with 10+ years in language education. Passionate about making language learning accessible to everyone.",
      image: "👩‍💼"
    },
    {
      name: "David Chen",
      role: "CTO",
      bio: "AI specialist with expertise in natural language processing. Previously at Google and Microsoft, building language learning tools.",
      image: "👨‍💻"
    },
    {
      name: "Maria Garcia",
      role: "Head of Content",
      bio: "Certified language instructor with expertise in IELTS, TOEFL, and TOEIC. Created content for major educational publishers.",
      image: "👩‍🏫"
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Helped" },
    { number: "25+", label: "Languages Supported" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="container container-narrow">
          <h1>About Surpass</h1>
          <p>Empowering language learners worldwide to surpass their goals with AI-powered practice and personalized feedback.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2>Our Mission</h2>
              <p>At Surpass, we believe that language proficiency should not be a barrier to achieving your dreams. Whether you&apos;re applying for university, seeking employment abroad, or pursuing immigration, we&apos;re here to help you succeed.</p>
              
              <p>Founded in 2023, Surpass combines cutting-edge AI technology with proven pedagogical methods to deliver personalized language practice that adapts to your learning style and pace.</p>
              
              <h3>What Makes Us Different</h3>
              <ul className="feature-list">
                <li><span className="checkmark">✓</span>AI-powered speaking practice with real-time feedback</li>
                <li><span className="checkmark">✓</span>Comprehensive test preparation for IELTS, TOEFL, TOEIC</li>
                <li><span className="checkmark">✓</span>Personalized study plans based on your strengths and weaknesses</li>
                <li><span className="checkmark">✓</span>Expert-designed content from certified language instructors</li>
              </ul>
            </div>
            
            <div>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section-alt">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="section-subtitle">Passionate educators and technologists dedicated to your success</p>
          
          <div className="grid grid-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.image}</div>
                <h4>{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <h2>Our Values</h2>
          
          <div className="grid grid-3">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h4>Excellence</h4>
              <p>We strive for the highest quality in everything we do, from content creation to user experience.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h4>Accessibility</h4>
              <p>Quality language education should be accessible to everyone, regardless of location or background.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h4>Innovation</h4>
              <p>We continuously innovate to provide the most effective and engaging learning experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section section-alt">
        <div className="container container-narrow">
          <h2>Get In Touch</h2>
          <p>Have questions about Surpass? We&apos;d love to hear from you.</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> hello@surpass.so
            </div>
            <div className="contact-item">
              <strong>Support:</strong> support@surpass.so
            </div>
            <div className="contact-item">
              <strong>Partnerships:</strong> partnerships@surpass.so
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}