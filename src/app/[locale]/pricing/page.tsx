// src/app/pricing/page.tsx

"use client";

import { useRouter } from 'next/navigation';

export default function Pricing() {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };
  const plans = [
    {
      name: "Free",
      price: "₩0",
      period: "forever",
      description: "Try our platform with limited practice tests",
      features: [
        "1 practice test (guest access)",
        "3 practice tests with free account",
        "Basic progress tracking",
        "Community support"
      ],
      popular: false,
      buttonText: "Get Started Free",
      buttonStyle: "btn btn-outline"
    },
    {
      name: "Starter",
      price: "₩19,000",
      priceUSD: "$19",
      period: "per month",
      description: "Essential features for focused exam preparation",
      features: [
        "1 exam pack included",
        "Unlimited practice tests",
        "3 full mock tests per month",
        "Advanced AI feedback & personalization",
        "Customized study plans"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonStyle: "btn btn-primary"
    },
    {
      name: "Pro",
      price: "₩39,000",
      priceUSD: "$39",
      period: "per month",
      description: "Comprehensive preparation for serious learners",
      features: [
        "Everything in Starter",
        "3 exam packs per language",
        "Unlimited full mock tests",
        "Advanced progress analytics",
        "Priority email support"
      ],
      popular: false,
      buttonText: "Choose Pro",
      buttonStyle: "btn btn-outline"
    },
    {
      name: "Expert",
      price: "₩59,000",
      priceUSD: "$59",
      period: "per month",
      description: "Master multiple languages with unlimited access",
      features: [
        "Everything in Pro",
        "Unlimited exam packs across 3 languages",
        "All exam types (IELTS, TOEFL, TOEIC)",
        "Advanced performance insights",
        "Dedicated account support"
      ],
      popular: false,
      buttonText: "Choose Expert",
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
        <div className="container" style={{ maxWidth: '100%', padding: '0 var(--space-lg)' }}>
          <div className="grid grid-4">
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
                    {plan.priceUSD && (
                      <span className="price-usd">({plan.priceUSD})</span>
                    )}
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
                  <button onClick={() => handleNavigation('/login')} className={plan.buttonStyle}>
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}