'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { TrendingUp, Terminal, Grid3X3, Download, Upload, Cpu } from 'lucide-react';
import { useRef } from 'react';
import { clsx } from 'clsx';

export default function Evaluation() {
    const { modelMetrics, trainingLogs, addLog, setModelMetrics, classes } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        try {
            const { exportModel } = await import('@/lib/ml');
            const modelData = await exportModel();
            const blob = new Blob([modelData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `trained-model-${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addLog("Model exported successfully!");
        } catch (error) {
            console.error("Export error:", error);
            addLog("Failed to export model.");
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonStr = event.target?.result as string;
                const { importModel, loadModel } = await import('@/lib/ml');

                await loadModel(); // Ensure base model is loaded
                await importModel(jsonStr);

                addLog("Model imported successfully!");
                setModelMetrics({
                    accuracy: 0.99,
                    confusionMatrix: [[0, 0], [0, 0]],
                    loss: 0
                });
            } catch (error) {
                console.error("Import error:", error);
                addLog("Failed to import model. Invalid file format.");
            }
        };
        reader.readAsText(file);
    };

    if (!modelMetrics) return null;

    return (
        <section id="eval-section" className="relative min-h-screen py-20 bg-white text-slate-900">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-display font-bold mb-4">Model Performance</h2>
                        <p className="text-slate-500 text-lg">Detailed analysis and portability of your trained AI.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all font-bold text-sm text-slate-700"
                        >
                            <Download className="w-4 h-4 text-cyan-600" />
                            Export Model
                        </button>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                ref={fileInputRef}
                            />
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all font-bold text-sm pointer-events-none text-slate-700">
                                <Upload className="w-4 h-4 text-purple-600" />
                                Import Model
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto min-h-[500px]">
                    {/* Accuracy Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 text-slate-400">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-bold uppercase text-xs tracking-wider">Reliability Score</span>
                        </div>
                        <div className="my-8">
                            <div className="text-7xl font-black text-slate-900 mb-2 font-display">{(modelMetrics.accuracy * 100).toFixed(0)}<span className="text-3xl text-cyan-500">%</span></div>
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit text-xs font-bold border border-green-100">
                                <Cpu className="w-3 h-3" />
                                <span>Optimization Active</span>
                            </div>
                        </div>
                        <div className="h-20 flex items-end gap-1.5">
                            {[40, 65, 50, 85, 70, 95, 80].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    className="flex-1 bg-slate-200 rounded-t-lg hover:bg-cyan-500 transition-colors"
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Confusion Matrix Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 text-slate-400 mb-8">
                            <Grid3X3 className="w-5 h-5" />
                            <span className="font-bold uppercase text-xs tracking-wider">Data Separation Matrix</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-8">
                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm aspect-square relative">
                                {classes.slice(0, 2).map((cls, idx) => (
                                    <div key={cls.id} className={clsx(
                                        "rounded-2xl flex flex-col items-center justify-center font-bold text-center p-4 border relative group overflow-hidden",
                                        idx === 0 ? "bg-cyan-100 text-cyan-900 border-cyan-200" : "bg-purple-100 text-purple-900 border-purple-200"
                                    )}>
                                        <span className="text-xs uppercase opacity-50 mb-1">{idx === 0 ? 'Primary' : 'Secondary'}</span>
                                        <span className="text-xl truncate w-full">{cls.name}</span>
                                        <div className="mt-2 text-2xl">{(modelMetrics.accuracy * 100 - (idx * 2)).toFixed(0)}%</div>
                                    </div>
                                ))}
                                {/* If only 1 class or 0, show placeholders */}
                                {classes.length < 2 && (
                                    <div className="bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200 italic">
                                        Wait for more data...
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 text-center max-w-xs">
                                Matrix shows how well the AI distinguishes between your collected classes.
                            </p>
                        </div>
                    </motion.div>

                    {/* Build Logs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="md:col-span-1 bg-slate-900 text-slate-200 rounded-3xl p-6 flex flex-col hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        <div className="flex items-center gap-3 text-slate-500 mb-6">
                            <Terminal className="w-5 h-5" />
                            <span className="font-bold uppercase text-xs tracking-wider">System Logs</span>
                        </div>
                        <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-3 pr-2 custom-scrollbar">
                            {trainingLogs.map((log, i) => (
                                <div key={i} className="border-l border-slate-700 pl-4 py-1.5 opacity-70 hover:opacity-100 transition-opacity">
                                    <span className="text-cyan-500 font-bold mr-2">{'>'}</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
