'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  imgClassName?: string
  variant?: 'header' | 'footer'
  height?: number
  width?: number
  priority?: boolean
  src?: string
  style?: React.CSSProperties
  responsive?: boolean
}

export function Logo({
  className,
  imgClassName,
  variant = 'header',
  height,
  width,
  src = "/Satty's Logo Red.png",
  priority = true,
  style,
  responsive = false
}: LogoProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        responsive && "logo-responsive",
        className
      )} 
      style={style}
    >
      <Image
        src={src}
        alt="Satty's Logo"
        width={width || 850}
        height={height || 350}
        className={cn(
          "object-contain select-none drop-shadow-sm transition-all duration-300",
          responsive && "logo-img-responsive",
          !responsive && !height && "h-8 sm:h-10 md:h-14 lg:h-16",
          imgClassName
        )}
        style={height && !responsive ? { height: `${height}px`, width: 'auto' } : undefined}
        priority={priority}
      />
      <style jsx global>{`
        .logo-responsive {
          width: 100%;
          max-width: clamp(120px, 45vw, 200px);
          margin: 0 auto;
          padding: 0 8px;
        }
        
        .logo-img-responsive {
          width: 100%;
          height: auto;
          max-height: 56px;
        }
        
        @media (max-width: 430px) {
          .logo-responsive {
            max-width: min(50vw, 160px);
            padding: 0 4px;
          }
          
          .logo-img-responsive {
            max-height: 48px;
          }
        }
        
        @media (min-width: 431px) and (max-width: 768px) {
          .logo-responsive {
            max-width: clamp(140px, 35vw, 180px);
          }
          
          .logo-img-responsive {
            max-height: 52px;
          }
        }
        
        @media (min-width: 769px) {
          .logo-responsive {
            max-width: 220px;
            padding: 0;
          }
          
          .logo-img-responsive {
            max-height: 56px;
          }
        }
      `}</style>
    </div>
  )
}
