'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
    name: string
}

export function ShareButton({ name }: ShareButtonProps) {
    const handleShare = () => {
        if (typeof window !== 'undefined') {
            const url = window.location.href
            const text = encodeURIComponent(`Check out ${name} on Satty's: ${url}`)
            window.open(`https://wa.me/?text=${text}`, '_blank')
        }
    }

    return (
        <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-1.5 text-[#878787] cursor-pointer hover:text-[#25D366] text-[11px] font-bold transition-colors"
        >
            <Share2 className="w-4 h-4" /> Share
        </button>
    )
}
