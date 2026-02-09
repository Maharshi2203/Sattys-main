'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HomeHeader } from '@/components/home-header'
import { motion } from 'framer-motion'


export default function HomePage() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden bg-black font-sans">
      <section className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-105"
        >
          <source src="https://res.cloudinary.com/dsxes4hgu/video/upload/v1769956658/Untitled_design_2_zmezab.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40 z-10" />

        <HomeHeader />

        <main className="relative z-20 min-h-screen min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-8 sm:pt-24 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl space-y-1 sm:space-y-2"
          >
            <h1 className="text-white text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display font-bold tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
              Satty's
            </h1>

            <h2 className="text-white text-xl xs:text-2xl sm:text-3xl md:text-4xl font-display font-medium tracking-wide opacity-95 drop-shadow-md">
              Gujarat's #1
            </h2>

            <h3 className="text-white text-sm xs:text-base sm:text-xl md:text-2xl font-display font-medium tracking-[0.1em] sm:tracking-[0.2em] uppercase py-2 sm:py-4 drop-shadow-md">
              Food ingredients delivery app
            </h3>

            <p className="text-white/90 text-sm xs:text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm pb-6 sm:pb-10 px-2">
              Experience fast & easy online ordering on the Satty's app
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-6"
            >
              <Link
                href="#"
                className="group transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={180}
                  height={56}
                  className="object-contain w-[120px] sm:w-[160px] h-auto"
                />
              </Link>
              <Link
                href="#"
                className="group transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  width={180}
                  height={56}
                  className="object-contain w-[120px] sm:w-[160px] h-auto"
                />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] pt-3 sm:pt-4"
            >
              Coming Soon
            </motion.p>
          </motion.div>
        </main>
      </section>
    </div>
  )
}
