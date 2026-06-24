import React from 'react'
import Head from 'next/head'
import LivingBackground from '../components/LivingBackground'
import Navbar from '../components/Navbar'
import Hero from '../components/landing/Hero'
import FeaturesGrid from '../components/landing/FeaturesGrid'
import AIShowcase from '../components/landing/AIShowcase'
import AnalyticsShowcase from '../components/landing/AnalyticsShowcase'
import ProductTour from '../components/landing/ProductTour'
import Testimonials from '../components/landing/Testimonials'
import RoadmapTimeline from '../components/landing/RoadmapTimeline'
import PricingFAQ from '../components/landing/PricingFAQ'
import Footer from '../components/landing/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>academicos — Become Impossible To Ignore</title>
        <meta name="description" content="academicos — premium student identity platform & academic operating system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LivingBackground />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <FeaturesGrid />
        <AIShowcase />
        <AnalyticsShowcase />
        <ProductTour />
        <Testimonials />
        <RoadmapTimeline />
        <PricingFAQ />
      </main>

      <Footer />
    </>
  )
}
