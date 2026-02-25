'use client';

import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Zap } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';

export default function Inference() {
    const { classes, isTraining, modelMetrics } = useStore();
    const [mode, setMode] = useState<'webcam' | 'upload'>('webcam');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
    const [allConfidences, setAllConfidences] = useState<{ [key: string]: number }>({});
    const [isPredicting, setIsPredicting] = useState(false);

    const [webcamAllowed, setWebcamAllowed] = useState(false);
    const [webcamError, setWebcamError] = useState<string | null>(null);

    const startInferenceWebcam = async () => {
        setWebcamError(null);
        try {
            // First check if already has stream
            if (videoRef.current && videoRef.current.srcObject) return;

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setWebcamAllowed(true);
            }
        } catch (err: any) {
            console.error("Error accessing webcam:", err);
            setWebcamAllowed(false);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setWebcamError("Permission denied. Please allow camera access in browser settings.");
            } else if (err.name === 'NotFoundError') {
                setWebcamError("No camera found. Please connect a webcam.");
            } else {
                setWebcamError("Camera access failed. Check if another app is using it.");
            }
        }
    };

    useEffect(() => {
        if (mode === 'webcam' && !webcamAllowed && !webcamError) {
            startInferenceWebcam();
        }

        // Cleanup function to stop stream when switching modes or unmounting
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
                setWebcamAllowed(false);
            }
        };
    }, [mode]);

    // Real prediction logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const runInference = async () => {
            if (mode === 'webcam' && modelMetrics && !isPredicting && videoRef.current && webcamAllowed && videoRef.current.readyState === 4) {
                try {
                    const { predict } = await import('@/lib/ml');
                    const result = await predict(videoRef.current);

                    if (result && result.confidences) {
                        setAllConfidences(result.confidences as { [key: string]: number });

                        // Find the class with highest confidence
                        let maxConf = 0;
                        let predictedLabel = "";

                        Object.entries(result.confidences).forEach(([index, conf]) => {
                            const idx = parseInt(index);
                            const confidence = conf as number;
                            if (confidence > maxConf) {
                                maxConf = confidence;
                                predictedLabel = classes[idx]?.name || "Unknown";
                            }
                        });

                        if (predictedLabel) {
                            setPrediction({
                                label: predictedLabel,
                                confidence: maxConf
                            });
                        }
                    }
                } catch (error) {
                    console.error("Inference error:", error);
                }
            }
        };

        if (mode === 'webcam' && modelMetrics) {
            interval = setInterval(runInference, 200); // 5 FPS for smoother real-time feel
            return () => clearInterval(interval);
        }
    }, [mode, modelMetrics, classes, isPredicting, webcamAllowed]);

    return (
        <section id="inference-section" className="relative min-h-screen py-20 bg-[#0B0F19] overflow-hidden flex items-center justify-center">
            {/* Ambient Bacgkround */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 items-stretch h-[600px]">
                    {/* Input Area */}
                    <div className="flex-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden relative group">
                        <div className="absolute top-6 left-6 z-20 flex bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setMode('webcam')}
                                className={clsx("px-4 py-2 rounded-full text-sm font-medium transition-all", mode === 'webcam' ? 'bg-white text-black' : 'text-gray-400 hover:text-white')}
                            >
                                Live Webcam
                            </button>
                            <button
                                onClick={() => setMode('upload')}
                                className={clsx("px-4 py-2 rounded-full text-sm font-medium transition-all", mode === 'upload' ? 'bg-white text-black' : 'text-gray-400 hover:text-white')}
                            >
                                Upload File
                            </button>
                        </div>

                        <div className="w-full h-full flex items-center justify-center bg-black/50">
                            {mode === 'webcam' ? (
                                webcamError ? (
                                    <div className="text-red-400 text-center p-4">
                                        <p className="font-bold mb-2">Camera Error</p>
                                        <p className="text-sm">{webcamError}</p>
                                        <button onClick={startInferenceWebcam} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs transition-colors">
                                            Retry Access
                                        </button>
                                    </div>
                                ) : (
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                )
                            ) : (
                                <div className="text-center p-12 border-2 border-dashed border-white/10 rounded-3xl hover:border-cyan-500/50 transition-colors cursor-pointer group-hover:scale-105 duration-300">
                                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                                    <p className="text-gray-400 font-medium">Drop image or click to upload</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="w-full lg:w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold font-display text-white mb-2">Real-time Inference</h3>
                            <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Model Active
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            {classes.length > 0 ? (
                                classes.map((cls, idx) => {
                                    const isPredicted = prediction?.label === cls.name;
                                    const val = (allConfidences[idx] || 0) * 100;

                                    return (
                                        <div key={cls.id}>
                                            <div className="flex justify-between text-sm mb-2 font-medium">
                                                <span className={isPredicted ? "text-cyan-400" : "text-gray-400"}>{cls.name}</span>
                                                <span className="text-gray-500 font-mono">{val.toFixed(0)}%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={clsx("h-full rounded-full", isPredicted ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/10")}
                                                    animate={{ width: `${val}%` }}
                                                    transition={{ type: "spring", stiffness: 50 }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-gray-500 text-center py-10">
                                    No classes defined
                                </div>
                            )}
                        </div>

                        {prediction && (
                            <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-white/10 rounded-2xl text-center">
                                <p className="text-gray-400 text-xs text-left mb-4 uppercase tracking-wider font-bold">Top Prediction</p>
                                <div className="text-4xl font-black text-white font-display mb-2">{prediction.label}</div>
                                <div className="text-cyan-400 font-mono font-bold">{(prediction.confidence * 100).toFixed(1)}% Confidence</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
