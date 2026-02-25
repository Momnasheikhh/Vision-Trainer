import { create } from 'zustand';

export type ModelType = 'Logistic Regression' | 'Random Forest' | 'CNN';

export interface ClassData {
    id: string;
    name: string;
    images: string[]; // URLs or base64
}

interface AppState {
    classes: ClassData[];
    addClass: (name: string) => void;
    updateClassName: (id: string, name: string) => void;
    addImageToClass: (classId: string, image: string) => void;
    removeImageFromClass: (classId: string, index: number) => void;

    selectedModel: ModelType;
    setSelectedModel: (model: ModelType) => void;

    isTraining: boolean;
    trainingProgress: number; // 0-100
    trainingLoss: number;
    trainingLogs: string[];
    setTrainingState: (isTraining: boolean, progress: number, loss: number) => void;
    addLog: (log: string) => void;

    modelMetrics: {
        accuracy: number;
        confusionMatrix: number[][];
    } | null;
    setModelMetrics: (metrics: any) => void;
}

export const useStore = create<AppState>((set) => ({
    classes: [
        { id: 'class-1', name: 'Class 1', images: [] },
        { id: 'class-2', name: 'Class 2', images: [] },
    ],
    addClass: (name) => set((state) => ({
        classes: [...state.classes, { id: `class-${Date.now()}`, name, images: [] }]
    })),
    updateClassName: (id, name) => set((state) => ({
        classes: state.classes.map(c => c.id === id ? { ...c, name } : c)
    })),
    addImageToClass: (classId, image) => set((state) => ({
        classes: state.classes.map(c => c.id === classId ? { ...c, images: [...c.images, image] } : c)
    })),
    removeImageFromClass: (classId, index) => set((state) => ({
        classes: state.classes.map(c => c.id === classId ? { ...c, images: c.images.filter((_, i) => i !== index) } : c)
    })),

    selectedModel: 'CNN', // Default to CNN as it is popular? Prompt says "Style: When selected...". I'll use lowercase internally probably or match types.
    setSelectedModel: (model) => set({ selectedModel: model }),

    isTraining: false,
    trainingProgress: 0,
    trainingLoss: 0,
    trainingLogs: [],
    setTrainingState: (isTraining, progress, loss) => set({ isTraining, trainingProgress: progress, trainingLoss: loss }),
    addLog: (log) => set((state) => ({ trainingLogs: [...state.trainingLogs, `[${new Date().toLocaleTimeString()}] ${log}`] })),

    modelMetrics: null,
    setModelMetrics: (metrics) => set({ modelMetrics: metrics }),
}));
