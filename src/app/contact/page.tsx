'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HomeHeader } from '@/components/home-header'
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  Linkedin,
  Twitter,
  ChevronRight
} from 'lucide-react'

const contactItems = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 8200892368',
    href: 'tel:+918200892368',
    color: 'group-hover/item:text-blue-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'customersupport@sattys.in',
    href: 'mailto:customersupport@sattys.in',
    color: 'group-hover/item:text-rose-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(251,113,133,0.3)]'
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@sattys.in',
    href: 'https://www.instagram.com/sattys.in/?hl=en',
    color: 'group-hover/item:text-pink-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
  },
  {
    icon: Facebook,
    label: 'Facebook',
    value: "Satty's Food",
    href: 'https://facebook.com/sattys',
    color: 'group-hover/item:text-blue-600',
    glow: 'group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]'
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Direct Chat',
    href: 'https://wa.me/918200892368',
    color: 'group-hover/item:text-green-500',
    glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: "Satty's India",
    href: 'https://linkedin.com/company/sattys',
    color: 'group-hover/item:text-blue-700',
    glow: 'group-hover:shadow-[0_0_20px_rgba(29,78,216,0.3)]'
  },
  {
    icon: Twitter,
    label: 'Twitter',
    value: '@sattys_in',
    href: 'https://twitter.com/sattys',
    color: 'group-hover/item:text-sky-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]'
  }
]

export default function ContactPage() {
  const navbarHeight = "80px"

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col bg-black text-white font-sans overflow-x-hidden selection:bg-primary/30 relative">
      <HomeHeader />

      <div className="contact-section fixed inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/10 rounded-full blur-[80px] sm:blur-[120px] animate-pulse z-20" />
      </div>

      <main
        className="flex-1 relative z-30 flex items-center justify-center p-4 sm:p-6 md:p-12 lg:p-24"
        style={{ paddingTop: navbarHeight, minHeight: `calc(100dvh - 0px)` }}
      >
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            <div className="relative bg-transparent border-none shadow-none overflow-hidden">
              <div className="p-4 sm:p-8 md:p-16">
                <div className="text-center mb-8 sm:mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary mb-4 sm:mb-6"
                  >
                    Connect with Satty&apos;s
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-3 sm:mb-4 tracking-tight"
                  >
                    Contact <span className="text-white font-medium">Us</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto opacity-80 px-2"
                  >
                    Premium food ingredients delivery at your fingertips. We&apos;re here to help you scale your kitchen operations.
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {contactItems.map((item, idx) => (
                    <motion.a
                      key={idx}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx + 0.5, ease: "easeOut" }}
                      className={`flex items-center gap-3 sm:gap-5 p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-[2rem] bg-transparent border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group/item cursor-pointer overflow-hidden relative`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 ease-in-out" />

                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 group-hover/item:scale-110 group-hover/item:border-white/20 transition-all duration-300 ${item.color}`}>
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover/item:rotate-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-white/40 group-hover/item:text-white/70 transition-colors mb-0.5 sm:mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-white transition-colors truncate">
                          {item.value}
                        </p>
                      </div>
                      <div className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 hidden sm:block">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" />
                      </div>
                    </motion.a>
                  ))}


                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-white/10"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/40">
                    <span className="hover:text-primary transition-colors cursor-default">Gujarat #1</span>
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                    <span className="hover:text-primary transition-colors cursor-default">Satty&apos;s India</span>
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                    <span className="hover:text-primary transition-colors cursor-default">Est. 2024</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="absolute -top-20 -right-20 w-20 sm:w-40 h-20 sm:h-40 bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-20 sm:w-40 h-20 sm:h-40 bg-white/5 blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: black;
          margin: 0;
          padding: 0;
        }

        .contact-section {
          background-image: url("/4.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
        }

        .contact-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 10;
        }

        .font-display {
          font-family: inherit;
          letter-spacing: -0.04em;
        }

        @media (min-height: 800px) {
          body {
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  )
}
