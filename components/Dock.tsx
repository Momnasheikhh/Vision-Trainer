'use client';

import { Database, BrainCircuit, BarChart3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'data-section', label: 'Data', icon: Database },
    { id: 'train-section', label: 'Train', icon: BrainCircuit },
    { id: 'eval-section', label: 'Evaluate', icon: BarChart3 },
    { id: 'inference-section', label: 'Preview', icon: Eye },
];

export default function Dock() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 z-50 transform -translate-x-1/2">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="flex items-center gap-2 p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex flex-col items-center justify-center w-16 h-12 gap-1 transition-colors rounded-full hover:bg-white/10 group"
                    >
                        <item.icon className="w-5 h-5 text-gray-400 transition-colors group-hover:text-cyan-400" />
                        <span className="text-[10px] text-gray-400 group-hover:text-white font-medium">{item.label}</span>
                    </button>
                ))}
            </motion.div>
        </div>
    );
}
