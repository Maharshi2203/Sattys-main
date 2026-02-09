'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calculator, CreditCard, Landmark, Coins } from 'lucide-react'

interface EMIModalProps {
    price: number
}

export function EMIModal({ price }: EMIModalProps) {
    const emiOptions = [
        { provider: 'HDFC Bank', interest: '13%', duration: '24 Months', monthly: (price * 1.13 / 24).toFixed(0) },
        { provider: 'ICICI Bank', interest: '12.5%', duration: '12 Months', monthly: (price * 1.125 / 12).toFixed(0) },
        { provider: 'SBI Card', interest: '14%', duration: '36 Months', monthly: (price * 1.14 / 36).toFixed(0) },
        { provider: 'Bajaj Finserv', interest: '0%', duration: '6 Months', monthly: (price / 6).toFixed(0) },
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline group">
                    <Calculator className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    View EMI Plans
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-[2.5rem] border-0 shadow-2xl p-8 bg-white/95 backdrop-blur-xl">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-display font-bold">Financial Options</DialogTitle>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Flexible credit solutions for your purchase</p>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                    {emiOptions.map((option, idx) => (
                        <div
                            key={idx}
                            className="group p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-white flex items-center justify-center transition-colors">
                                    {idx % 2 === 0 ? <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-primary" /> : <Landmark className="w-5 h-5 text-muted-foreground group-hover:text-primary" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">{option.provider}</h4>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{option.duration} • {option.interest} Interest</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-foreground">₹{option.monthly}/mo</p>
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#0d4f3c]">Recommended</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-muted/40 rounded-2xl flex gap-3 items-start">
                    <Coins className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase tracking-widest">
                        Eligible for No Cost EMI on select credit cards. Charges may apply depending on your provider's terms.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
