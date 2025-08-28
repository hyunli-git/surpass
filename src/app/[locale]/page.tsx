// src/app/[locale]/page.tsx

'use client';

import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Testimonials from '@/components/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
    </>
  )
}