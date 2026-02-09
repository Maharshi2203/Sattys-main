'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop',
    title: 'Empowering Your Business with Reliable Food Sourcing',
    subtitle: 'Global Distribution. Local Care. Partner with the most reliable network of food distributors in India and beyond.',
    cta: 'Explore Catalog',
    link: '/products'
  },
  {
    image: 'https://images.unsplash.com/photo-1466633310193-c368aa38c7b4?q=80&w=2070&auto=format&fit=crop',
    title: 'Reliability. Quality. Freshness.',
    subtitle: 'Direct from farms to your doorstep with guaranteed freshness.',
    cta: 'Our Services',
    link: '/products'
  },
  {
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=2070&auto=format&fit=crop',
    title: 'A Legacy of Trust in Food Logistics',
    subtitle: 'With a global network and local expertise, we ensure your business never runs out of the essentials.',
    cta: 'Contact Us',
    link: '/contact'
  }
]

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative w-full h-[70vh] lg:h-[85vh] overflow-hidden bg-muted">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full">
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-2xl space-y-6"
                    >
                      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl text-white/90 font-medium">
                        {slide.subtitle}
                      </p>
                      <div className="pt-4">
                        <Link href={slide.link}>
                          <Button size="lg" className="h-14 px-8 bg-primary text-white hover:bg-primary/90 font-bold rounded-full gap-2 transition-transform hover:scale-105">
                            {slide.cta}
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-10 right-20 flex gap-2">
          <CarouselPrevious className="relative translate-x-0 translate-y-0 h-12 w-12 bg-white/20 hover:bg-white text-white hover:text-primary border-none backdrop-blur-md" />
          <CarouselNext className="relative translate-x-0 translate-y-0 h-12 w-12 bg-white/20 hover:bg-white text-white hover:text-primary border-none backdrop-blur-md" />
        </div>
      </Carousel>
    </section>
  )
}
