'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
    images: string[]
    name: string
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
    const [selectedIdx, setSelectedIdx] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isWishlisted, setIsWishlisted] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setMousePos({ x, y })
    }

    const nextImage = () => setSelectedIdx((prev) => (prev + 1) % images.length)
    const prevImage = () => setSelectedIdx((prev) => (prev - 1 + images.length) % images.length)

    return (
        <div className="flex flex-col md:flex-row gap-5 lg:sticky lg:top-24">
            {/* Thumbnails (Desktop Only) */}
            <div className="hidden md:flex flex-col gap-2.5 overflow-y-auto max-h-[500px] scrollbar-none py-1 flex-shrink-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIdx(idx)}
                        className={cn(
                            "relative w-16 h-16 rounded-sm overflow-hidden border transition-all flex-shrink-0 bg-white",
                            selectedIdx === idx ? "border-[#2874f0] ring-1 ring-[#2874f0]" : "border-border/60 hover:border-[#2874f0]/40"
                        )}
                    >
                        <img src={img} alt={`${name} ${idx + 1}`} className="w-full h-full object-contain p-1" />
                    </button>
                ))}
            </div>

            {/* Main Image Viewport (Slider on Mobile) */}
            <div className="flex-grow relative group rounded-sm overflow-hidden bg-white border border-border/10 aspect-[4/5] md:aspect-square lg:aspect-[4/5] shadow-sm">
                <div
                    className="w-full h-full cursor-zoom-in relative"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedIdx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            src={images[selectedIdx]}
                            alt={name}
                            className={cn(
                                "w-full h-full object-contain transition-transform duration-150",
                                isZoomed && "scale-[2]"
                            )}
                            style={isZoomed ? {
                                transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                            } : undefined}
                        />
                    </AnimatePresence>

                    {/* Mobile Navigation Arrows */}
                    <div className="md:hidden absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center pointer-events-auto"
                        >
                            <ChevronLeft className="w-6 h-6 text-[#212121]" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center pointer-events-auto"
                        >
                            <ChevronRight className="w-6 h-6 text-[#212121]" />
                        </button>
                    </div>

                    {/* Mobile Indicators/Dots */}
                    <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-sm">
                        {images.map((_, i) => (
                            <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === selectedIdx ? "bg-white w-4" : "bg-white/40")} />
                        ))}
                    </div>
                </div>

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                    <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all border border-border/20",
                            "bg-white text-[#c2c2c2] hover:text-[#2874f0]"
                        )}
                    >
                        <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#c2c2c2] hover:text-[#2874f0] shadow-md transition-all border border-border/20">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Zoom Hint (Desktop Only) */}
                <div className="hidden md:block">
                    {!isZoomed && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border rounded shadow-sm text-[#878787] text-[10px] font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                            <ZoomIn className="w-3.5 h-3.5" /> Hover to zoom
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Thumbnails Track (Alternative to Arrows if preferred) */}
            <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-none px-1">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIdx(idx)}
                        className={cn(
                            "w-14 h-14 rounded-sm border transition-all flex-shrink-0 bg-white p-1",
                            selectedIdx === idx ? "border-[#2874f0]" : "border-border/40"
                        )}
                    >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                    </button>
                ))}
            </div>
        </div>
    )
}
