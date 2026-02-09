'use client'

import { AboutSection } from '@/components/about-section'
import { HomeHeader } from '@/components/home-header'

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-white">
            {/* Fixed Navigation for About Page */}
            <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
                <div className="pointer-events-auto">
                    <HomeHeader />
                </div>
            </div>

            <div className="pt-0">
                <AboutSection />
            </div>
        </main>
    )
}
