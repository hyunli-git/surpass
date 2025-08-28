// src/app/pricing/page.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCurrency, setSelectedCurrency] = useState<'KRW' | 'USD'>('USD');

  const plans = [
    {
      name: "Free",
      priceMonthly: { KRW: "₩0", USD: "$0" },
      priceYearly: { KRW: "₩0", USD: "$0" },
      period: "forever",
      description: "Try our platform with limited practice tests",
      features: [
        { text: "3 practice tests per month", included: true },
        { text: "Basic progress tracking", included: true },
        { text: "Community support", included: true },
        { text: "AI-powered feedback", included: false },
        { text: "Mock tests", included: false },
        { text: "Study plans", included: false },
        { text: "Priority support", included: false }
      ],
      limits: {
        tests: "3/month",
        languages: "1",
        support: "Community"
      },
      popular: false,
      buttonText: "Get Started Free",
      buttonStyle: "btn-pricing-outline"
    },
    {
      name: "Starter",
      priceMonthly: { KRW: "₩19,000", USD: "$19" },
      priceYearly: { KRW: "₩190,000", USD: "$190" },
      savings: "17%",
      period: "per month",
      description: "Essential features for focused exam preparation",
      features: [
        { text: "Unlimited practice tests", included: true },
        { text: "3 full mock tests per month", included: true },
        { text: "Advanced AI feedback", included: true },
        { text: "Personalized study plans", included: true },
        { text: "Progress analytics", included: true },
        { text: "Email support", included: true },
        { text: "Priority support", included: false }
      ],
      limits: {
        tests: "Unlimited",
        languages: "1",
        support: "Email (48h)"
      },
      popular: true,
      buttonText: "Start 7-Day Free Trial",
      buttonStyle: "btn-pricing-primary"
    },
    {
      name: "Pro",
      priceMonthly: { KRW: "₩39,000", USD: "$39" },
      priceYearly: { KRW: "₩390,000", USD: "$390" },
      savings: "17%",
      period: "per month",
      description: "Comprehensive preparation for serious learners",
      features: [
        { text: "Everything in Starter", included: true },
        { text: "Unlimited mock tests", included: true },
        { text: "3 languages included", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Custom practice sessions", included: true },
        { text: "Priority email support", included: true },
        { text: "Live chat support", included: true }
      ],
      limits: {
        tests: "Unlimited",
        languages: "3",
        support: "Priority (24h)"
      },
      popular: false,
      buttonText: "Choose Pro",
      buttonStyle: "btn-pricing-outline"
    },
    {
      name: "Expert",
      priceMonthly: { KRW: "₩59,000", USD: "$59" },
      priceYearly: { KRW: "₩590,000", USD: "$590" },
      savings: "17%",
      period: "per month",
      description: "Master multiple languages with unlimited access",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Unlimited languages", included: true },
        { text: "All exam types included", included: true },
        { text: "1-on-1 coaching sessions", included: true },
        { text: "Custom exam simulations", included: true },
        { text: "White-glove onboarding", included: true },
        { text: "Dedicated account manager", included: true }
      ],
      limits: {
        tests: "Unlimited",
        languages: "Unlimited",
        support: "Dedicated"
      },
      popular: false,
      buttonText: "Choose Expert",
      buttonStyle: "btn-pricing-outline"
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 7-day free trial. No credit card required to start."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Korean payment methods including Kakao Pay and Naver Pay."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students get 20% off all plans with a valid .edu email address."
    },
    {
      question: "Can I share my account?",
      answer: "Each account is for individual use only. For teams or schools, contact us for group pricing."
    }
  ];

  const getCurrentPrice = (plan: typeof plans[0]) => {
    const prices = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
    return prices[selectedCurrency];
  };

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container container-narrow">
          <div className="pricing-badge">
            <span>💰</span>
            <span>Save 17% with yearly billing</span>
          </div>
          
          <h1 className="pricing-title">
            Transparent Pricing,
            <span className="gradient-text"> No Surprises</span>
          </h1>
          
          <p className="pricing-subtitle">
            Join 50,000+ learners achieving their language goals. 
            Start with a 7-day free trial, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <button 
              className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`toggle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="toggle-badge">Save 17%</span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="currency-toggle">
            <button 
              className={`currency-option ${selectedCurrency === 'USD' ? 'active' : ''}`}
              onClick={() => setSelectedCurrency('USD')}
            >
              USD ($)
            </button>
            <button 
              className={`currency-option ${selectedCurrency === 'KRW' ? 'active' : ''}`}
              onClick={() => setSelectedCurrency('KRW')}
            >
              KRW (₩)
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-section">
        <div className="container pricing-container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`pricing-card-enhanced ${plan.popular ? 'card-popular' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-ribbon">
                    <span>Most Popular</span>
                  </div>
                )}
                
                <div className="card-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="price-display">
                    <span className="price-amount">{getCurrentPrice(plan)}</span>
                    {plan.name !== 'Free' && (
                      <span className="price-period">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.savings && (
                    <div className="savings-badge">Save {plan.savings}</div>
                  )}
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="card-limits">
                  <div className="limit-item">
                    <span className="limit-icon">📝</span>
                    <span className="limit-text">Tests: {plan.limits.tests}</span>
                  </div>
                  <div className="limit-item">
                    <span className="limit-icon">🌍</span>
                    <span className="limit-text">Languages: {plan.limits.languages}</span>
                  </div>
                  <div className="limit-item">
                    <span className="limit-icon">💬</span>
                    <span className="limit-text">Support: {plan.limits.support}</span>
                  </div>
                </div>

                <ul className="feature-list-enhanced">
                  {plan.features.map((feature, index) => (
                    <li key={index} className={feature.included ? 'included' : 'not-included'}>
                      <span className="feature-icon">
                        {feature.included ? '✓' : '×'}
                      </span>
                      <span className="feature-text">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-footer">
                  <Link href="/login" className={plan.buttonStyle}>
                    {plan.buttonText}
                  </Link>
                  {plan.name !== 'Free' && (
                    <p className="footer-note">No credit card required</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <h4>Secure Payment</h4>
              <p>256-bit SSL encryption</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💳</span>
              <h4>Flexible Billing</h4>
              <p>Cancel or pause anytime</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🎯</span>
              <h4>30-Day Guarantee</h4>
              <p>Full refund if not satisfied</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🎓</span>
              <h4>Student Discount</h4>
              <p>20% off with .edu email</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container container-narrow">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta-section">
        <div className="container container-narrow">
          <div className="cta-card">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of successful learners today</p>
            <div className="cta-actions">
              <Link href="/login" className="btn-cta-primary">
                Start Free Trial
              </Link>
              <Link href="/tests" className="btn-cta-secondary">
                Try Free Practice
              </Link>
            </div>
            <p className="cta-note">
              🎁 Limited time: Get 2 months free with yearly plan
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}