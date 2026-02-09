'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRef } from 'react'

interface FeaturePageProps {
  title: string
  content: string | { title: string; text: string }[]
  imageSrc: string
  showIcons?: boolean
  priority?: boolean
  align?: 'left' | 'right'
  valign?: 'top' | 'center' | 'bottom'
}

function FeatureSection({
  title,
  content,
  imageSrc,
  showIcons = false,
  priority = false,
  align = 'left',
  valign = 'center'
}: FeaturePageProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] md:h-screen md:min-h-[700px] w-full flex items-center justify-center overflow-hidden snap-start py-16 md:py-0"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 h-[120%] -top-[10%]"
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/5" />
      </motion.div>

      <div className={cn(
        "container relative z-10 mx-auto px-4 sm:px-6 md:px-24 min-h-[60vh] md:h-full flex",
        align === 'left' ? "justify-start" : "md:justify-end justify-start",
        valign === 'top' ? "items-start pt-20 md:pt-40" : valign === 'bottom' ? "items-end pb-20 md:pb-40" : "items-center"
      )}>
        <motion.div
          initial={{ opacity: 0, x: align === 'left' ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="group relative max-w-xl w-full"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-br from-white/40 to-white/0 rounded-xl sm:rounded-[1.5rem] blur-[1px] z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 bg-white/20 backdrop-blur-[16px] rounded-xl sm:rounded-[1.5rem] p-5 sm:p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-white/20 overflow-hidden">

            <div className="relative mb-4 sm:mb-6 text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight leading-tight">
                {title}
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-[#C8102B] mt-2 rounded-full"
              />
            </div>

            {Array.isArray(content) ? (
              <ul className="space-y-3 sm:space-y-4 text-left">
                {content.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#C8102B] rounded-full flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</span>
                      <span className="text-gray-800 text-sm sm:text-base md:text-lg font-sans leading-[1.5] sm:leading-[1.6] font-medium"> {item.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-800 text-sm sm:text-base md:text-lg font-sans leading-[1.5] sm:leading-[1.6] font-medium opacity-100 text-left">
                {content}
              </p>
            )}

            {showIcons && (
              <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 justify-start">
                {[1, 2, 3].map((num) => (
                  <motion.div
                    key={num}
                    whileHover={{ scale: 1.1, backgroundColor: "#C8102B" }}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#C8102B]/20 flex items-center justify-center text-[#C8102B] font-bold text-[10px] sm:text-xs transition-colors duration-300 group/icon"
                  >
                    <span className="group-hover/icon:text-white transition-colors">0{num}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function AboutSection() {
  const commonText = "Satty’s is more than just a store—it’s your partner in making every meal memorable. Whether you are a seasoned chef or a beginner, our app connects you directly to our full range of premium ingredients. Discover exclusive recipes tailored to our products, track your nutrition, and get fresh essentials like our signature flour and cooking cream delivered right to your doorstep. We bring the joy of cooking back to your fingertips."

  const whyUsText = [
    {
      title: "Farm-to-Fork Purity:",
      text: "We don't believe in shortcuts. Our grains and dairy are sourced directly from trusted farmers who prioritize quality over quantity, ensuring you get 100% natural ingredients with no hidden preservatives."
    },
    {
      title: "Chef-Curated Quality:",
      text: "Every Satty's product is tested and approved by culinary experts. Our flour is milled for the perfect rise, and our cream is crafted for the richest texture, guaranteeing restaurant-quality results in your home kitchen."
    },
    {
      title: "Family First Philosophy:",
      text: "We build products for families, not just consumers. From sustainable packaging to fair trade sourcing, every decision we make is designed to create a healthier, happier future for the next generation."
    }
  ]

  const companyText = "Founded on the belief that great food brings people together, Satty's began with a simple mission: to provide honest, high-quality ingredients that turn everyday cooking into a celebration. What started as a small passion project has grown into a trusted household name, loved for its dedication to authenticity. We are committed to preserving traditional flavors while embracing modern convenience, ensuring that when you cook with Satty's, you're cooking with love."

  return (
    <div className="w-full bg-white snap-y snap-mandatory cursor-default">
      <FeatureSection
        title="About the app"
        content={commonText}
        imageSrc="/images/about/about-app.png"
        align="left"
        valign="top"
        priority={true}
      />

      <FeatureSection
        title="Why Us ?"
        content={whyUsText}
        imageSrc="/images/about/why-us.png"
        align="right"
        valign="center"
      />

      <FeatureSection
        title="About the company"
        content={companyText}
        imageSrc="/images/about/about-company.png"
        align="left"
        valign="bottom"
      />
    </div>
  )
}
