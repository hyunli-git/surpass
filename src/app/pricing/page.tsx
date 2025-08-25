// src/app/pricing/page.tsx

import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with language practice",
      features: [
        "5 practice tests per month",
        "Basic progress tracking",
        "Speaking practice (limited)",
        "Community support",
        "Basic feedback"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonStyle: "btn btn-outline"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Best for serious language learners",
      features: [
        "Unlimited practice tests",
        "Advanced progress analytics",
        "Full speaking practice suite",
        "AI-powered detailed feedback",
        "Priority support",
        "Personalized study plans",
        "Mock exam simulations"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonStyle: "btn btn-primary"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For educational institutions and organizations",
      features: [
        "Everything in Pro",
        "Up to 100 student accounts",
        "Admin dashboard",
        "Custom branding",
        "Advanced reporting",
        "Integration support",
        "Dedicated account manager"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonStyle: "btn btn-outline"
    }
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="container container-narrow">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your language learning journey</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="pricing-header">
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="price-amount">{plan.price}</span>
                    <span className="price-period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <ul className="feature-list">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pricing-footer">
                  <Link href="/login" className={plan.buttonStyle}>
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-alt">
        <div className="container container-narrow">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-list">
            <div className="faq-item">
              <h4>Can I change my plan anytime?</h4>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>
            </div>
            
            <div className="faq-item">
              <h4>Is there a free trial for Pro plan?</h4>
              <p>Yes! You get a 7-day free trial with full access to all Pro features. No credit card required.</p>
            </div>
            
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.</p>
            </div>
            
            <div className="faq-item">
              <h4>Do you offer student discounts?</h4>
              <p>Yes! Students get 50% off the Pro plan with a valid student ID. Contact support for verification.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}