'use client'

import { useState } from 'react'
import { MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PincodeChecker() {
    const [pincode, setPincode] = useState('')
    const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')

    const handleCheck = () => {
        if (pincode.length !== 6) return
        setStatus('checking')
        setTimeout(() => {
            // Mock logic: 38 is common for many Gujarat regions where Satty's operates
            if (pincode.startsWith('38')) {
                setStatus('available')
            } else {
                setStatus('unavailable')
            }
        }, 1200)
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Delivery Expertise</h3>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="h-12 bg-muted/30 border-border rounded-xl px-4 font-bold tracking-widest placeholder:tracking-normal placeholder:font-medium transition-all focus:ring-4 focus:ring-primary/5"
                    />
                </div>
                <Button
                    onClick={handleCheck}
                    disabled={status === 'checking' || pincode.length !== 6}
                    className="h-12 px-6 bg-primary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                    {status === 'checking' ? 'Validating...' : 'Check'}
                </Button>
            </div>

            {status === 'available' && (
                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <div className="text-xs font-bold uppercase tracking-widest leading-tight">
                        Delivery available by Tomorrow
                    </div>
                </div>
            )}

            {status === 'unavailable' && (
                <div className="flex items-center gap-3 text-destructive bg-destructive/5 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5" />
                    <div className="text-xs font-bold uppercase tracking-widest leading-tight">
                        Currently not serviceable in this area
                    </div>
                </div>
            )}

            {!status || status === 'idle' && (
                <div className="flex items-center gap-3 text-muted-foreground opacity-60">
                    <Truck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enter pincode for exact delivery time</span>
                </div>
            )}
        </div>
    )
}
