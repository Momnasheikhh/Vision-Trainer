'use client';

import { motion } from 'framer-motion';
import { Camera, CheckCircle2 } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden pt-20">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-bold tracking-tight md:text-7xl font-display mb-6">
                        Train your own <span className="text-gradient">Image Classifier</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-400 md:text-xl mb-12">
                        No coding required. Train Logistic Regression, Random Forest, or CNN models right in your browser.
                    </p>
                </motion.div>

                <div className="relative w-full max-w-4xl mx-auto h-64 md:h-96">
                    {/* Floating Cards Container */}

                    {/* Card 1: Webcam Feed */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 md:left-1/3 z-20 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-48 md:w-64"
                        initial={{ x: -100, y: -50, opacity: 0 }}
                        animate={{
                            x: -200,
                            y: [-60, -40, -60],
                            opacity: 1
                        }}
                        transition={{
                            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                            opacity: { duration: 1 }
                        }}
                        style={{ translateX: "-50%", translateY: "-50%" }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-white/10">
                                <Camera className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="text-sm font-medium">Input Feed</span>
                        </div>
                        <div className="w-full h-24 rounded-lg bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
                    </motion.div>

                    {/* Card 2: Accuracy Badge */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 md:left-2/3 z-10 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-40 md:w-56"
                        initial={{ x: 50, y: 0, opacity: 0 }}
                        animate={{
                            x: 100,
                            y: [10, -10, 10],
                            opacity: 1
                        }}
                        transition={{
                            y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 },
                            opacity: { duration: 1, delay: 0.2 }
                        }}
                        style={{ translateX: "-50%", translateY: "-50%" }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-400">Accuracy</span>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-white">98%</div>
                        <div className="w-full h-1 mt-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[98%]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
