'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

interface TrainingPanelProps {
  classes: string[]
  trainingData: { [key: string]: File[] }
  isTraining: boolean
  onTrainingStart: () => void
  onTrainingEnd: (metrics: any) => void
}

export default function TrainingPanel({
  classes,
  trainingData,
  isTraining,
  onTrainingStart,
  onTrainingEnd,
}: TrainingPanelProps) {
  const [progress, setProgress] = useState(0)
  const [currentModel, setCurrentModel] = useState('')

  const validateTrainingData = () => {
    if (classes.length < 2) {
      alert('Please create at least 2 classes')
      return false
    }

    for (const className of classes) {
      const imageCount = (trainingData[className] || []).length
      if (imageCount < 3) {
        alert(`Class "${className}" needs at least 3 images`)
        return false
      }
    }
    return true
  }

  const simulateTraining = async () => {
    if (!validateTrainingData()) return

    onTrainingStart()
    setProgress(0)

    // Simulate training with multiple models
    const models = ['Logistic Regression', 'Random Forest', 'CNN (TensorFlow)']
    const metrics: any = {}

    for (const model of models) {
      setCurrentModel(model)
      
      // Simulate progressive training
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      // Generate mock metrics
      metrics[model] = {
        accuracy: 0.75 + Math.random() * 0.20,
        loss: Math.random() * 0.5,
      }
    }

    setCurrentModel('')
    setProgress(0)
    onTrainingEnd(metrics)
  }

  const totalImages = classes.reduce(
    (sum, className) => sum + (trainingData[className]?.length || 0),
    0
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all"></div>
          <div className="relative rounded-xl border border-pink-500/40 bg-gradient-to-br from-pink-900/20 to-pink-900/5 p-4 backdrop-blur">
            <p className="text-xs text-white/70 font-bold uppercase tracking-wider">Classes</p>
            <p className="text-4xl font-black mt-2 bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">{classes.length}</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all"></div>
          <div className="relative rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 p-4 backdrop-blur">
            <p className="text-xs text-white/70 font-bold uppercase tracking-wider">Total Images</p>
            <p className="text-4xl font-black mt-2 bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">{totalImages}</p>
          </div>
        </div>
      </div>

      {currentModel && (
        <div className="relative overflow-hidden rounded-xl border border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-black/40 p-5 backdrop-blur-xl cyber-glow">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-black text-white">Training: <span className="text-purple-300">{currentModel}</span></p>
              <p className="text-xs font-mono font-bold text-cyan-400">{progress}%</p>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-purple-500/30">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300 shadow-lg shadow-purple-600/80"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={simulateTraining}
        disabled={isTraining || classes.length < 2}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white rounded-xl font-black text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 h-12 shadow-lg shadow-purple-600/50"
      >
        <Zap className="h-5 w-5 mr-2" />
        {isTraining ? 'Training in Progress...' : 'Train All Models'}
      </Button>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="text-xs text-white/60 font-bold uppercase tracking-wider text-center mb-2">Available Models</p>
        <div className="flex items-center justify-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">Logistic Regression</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 border border-pink-500/40 text-pink-300">Random Forest</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 border border-purple-500/40 text-purple-300">CNN</span>
        </div>
      </div>
    </div>
  )
}
