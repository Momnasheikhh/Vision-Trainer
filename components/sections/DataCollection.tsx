'use client';

import { useStore } from '@/lib/store';
import { Plus, Camera, Upload, AlertTriangle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';

export default function DataCollection() {
    const { classes, addClass, updateClassName, addImageToClass, removeImageFromClass } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeClassId, setActiveClassId] = useState<string | null>(null);
    const [webcamOpen, setWebcamOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, classId: string) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    addImageToClass(classId, reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const [webcamError, setWebcamError] = useState<string | null>(null);

    const startWebcam = async (classId: string) => {
        setWebcamError(null);
        setActiveClassId(classId);
        setWebcamOpen(true);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setWebcamError("Webcam not supported in this browser");
            return;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err: any) {
            console.error("Error accessing webcam:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setWebcamError("Permission denied. Please allow camera access.");
            } else {
                setWebcamError("Could not access camera. Ensure it is connected and not in use.");
            }
        }
    };

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStream(null);
        setWebcamOpen(false);
        setActiveClassId(null);
    };

    const captureImage = () => {
        if (videoRef.current && activeClassId) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            addImageToClass(activeClassId, dataUrl);
        }
    };

    // Re-attach stream when modal opens
    useEffect(() => {
        if (webcamOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [webcamOpen, stream]);


    return (
        <section id="data-section" className="relative min-h-screen py-20 bg-slate-50 text-slate-900">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-4xl font-display font-bold mb-4">Data Collection</h2>
                    <p className="text-slate-500 text-lg">Create classes and gather samples for your model.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {classes.map((cls) => (
                            <motion.div
                                key={cls.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col hover:border-cyan-500/50 transition-colors"
                            >
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={cls.name}
                                            onChange={(e) => updateClassName(cls.id, e.target.value)}
                                            className="w-full bg-transparent text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-1"
                                        />
                                        <div className="text-xs text-slate-400 mt-1">{cls.images.length} samples collected</div>
                                    </div>
                                    {/* Warning if < 3 images */}
                                    {cls.images.length < 3 && (
                                        <div className="group relative ml-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                                            <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-amber-100 text-amber-700 text-xs rounded shadow-lg border border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                Minimum 3 images required
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startWebcam(cls.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium border border-slate-200"
                                        >
                                            <Camera className="w-5 h-5 text-cyan-600" />
                                            <span>Webcam</span>
                                        </button>
                                        <div className="relative flex-1">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileUpload(e, cls.id)}
                                            />
                                            <button className="w-full h-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium border border-slate-200 pointer-events-none">
                                                <Upload className="w-5 h-5 text-slate-500" />
                                                <span>Upload</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-[150px] bg-slate-50 rounded-xl p-2 border border-slate-100">
                                        {cls.images.length === 0 ? (
                                            <div className="h-full flex items-center justify-center text-slate-300 text-sm italic">
                                                No screenshots yet
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2">
                                                {cls.images.slice(0, 16).map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group/img border border-slate-100">
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => removeImageFromClass(cls.id, idx)}
                                                            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.button
                        layout
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addClass(`Class ${classes.length + 1}`)}
                        className="h-full min-h-[300px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-cyan-500 hover:text-cyan-600 hover:bg-white transition-all gap-2 bg-white/50"
                    >
                        <Plus className="w-10 h-10" />
                        <span className="font-bold uppercase tracking-widest text-xs">Add New Class</span>
                    </motion.button>
                </div>
            </div>

            {/* Webcam Modal */}
            <AnimatePresence>
                {webcamOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
                    >
                        <div className="bg-white p-4 rounded-3xl max-w-2xl w-full mx-4 shadow-2xl relative border border-slate-200">
                            <button onClick={stopWebcam} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold mb-4 text-center text-slate-900">Capture Samples</h3>
                            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-slate-100">
                                {webcamError ? (
                                    <div className="text-red-500 text-center p-4">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                                        <p>{webcamError}</p>
                                    </div>
                                ) : (
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    onMouseDown={() => {
                                        const interval = setInterval(captureImage, 100);
                                        (window as any)._capInterval = interval;
                                    }}
                                    onMouseUp={() => clearInterval((window as any)._capInterval)}
                                    onMouseLeave={() => clearInterval((window as any)._capInterval)}
                                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-bold text-lg shadow-xl shadow-cyan-600/20 transition-all active:scale-95 flex items-center gap-3"
                                >
                                    <Camera className="w-6 h-6" />
                                    Hold to Capture
                                </button>
                            </div>
                            <p className="text-center text-slate-400 mt-4 text-sm">Samples are kept locally in your browser session</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
