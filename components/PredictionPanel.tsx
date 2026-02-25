'use client'

import React from "react"

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Upload, Zap } from 'lucide-react'

interface PredictionPanelProps {
  classes: string[]
  modelMetrics: any
  onImageSelected: (image: string | null) => void
  onPredictionsMade: (predictions: any) => void
}

export default function PredictionPanel({
  classes,
  modelMetrics,
  onImageSelected,
  onPredictionsMade,
}: PredictionPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [useWebcam, setUseWebcam] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const image = event.target?.result as string
        setSelectedImage(image)
        onImageSelected(image)
        makePredictions(image)
      }
      reader.readAsDataURL(file)
    }
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsWebcamActive(true)
        setUseWebcam(true)
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
      alert('Could not access webcam. Please check permissions.')
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setIsWebcamActive(false)
      setUseWebcam(false)
    }
  }

  const captureWebcamFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        const image = canvasRef.current.toDataURL('image/jpeg')
        setSelectedImage(image)
        onImageSelected(image)
        makePredictions(image)
      }
    }
  }

  const makePredictions = (image: string) => {
    if (!modelMetrics || Object.keys(modelMetrics).length === 0) {
      alert('Train models first before making predictions')
      return
    }

    // Simulate predictions from all models
    const predictions: any = {}
    for (const model of Object.keys(modelMetrics)) {
      const randomClass = classes[Math.floor(Math.random() * classes.length)]
      predictions[model] = {
        predicted: randomClass,
        confidence: 0.65 + Math.random() * 0.35,
      }
    }

    onPredictionsMade(predictions)
  }

  const isReady = modelMetrics && Object.keys(modelMetrics).length > 0

  return (
    <div className="space-y-5">
      {!useWebcam ? (
        <>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-xl font-black h-11 shadow-lg shadow-pink-600/50 transition-all"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </Button>
            <Button
              onClick={startWebcam}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl font-black h-11 shadow-lg shadow-cyan-600/50 transition-all"
            >
              <Camera className="h-5 w-5 mr-2" />
              Use Webcam
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </>
      ) : (
        <>
          <div className="rounded-xl border border-cyan-500/40 overflow-hidden bg-black/50 backdrop-blur-xl ring-1 ring-cyan-500/20">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video bg-black"
            />
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            <Button
              onClick={captureWebcamFrame}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl font-bold h-11 shadow-lg shadow-cyan-600/50 transition-all"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture
            </Button>
            <Button
              onClick={stopWebcam}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold h-11 shadow-lg shadow-red-600/50 transition-all"
            >
              Stop
            </Button>
          </div>
        </>
      )}

      {selectedImage && (
        <div className="relative group rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all"></div>
          <div className="relative border border-pink-500/50 overflow-hidden bg-black/50 backdrop-blur-xl ring-1 ring-pink-500/30">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Selected for prediction"
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>
      )}

      <Button
        onClick={() => makePredictions(selectedImage || '')}
        disabled={!selectedImage || !isReady}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white rounded-xl font-black h-12 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-600/50"
      >
        <Zap className="h-5 w-5 mr-2" />
        {isReady ? 'Predict' : 'Train First'}
      </Button>

      {!isReady && (
        <div className="text-xs text-center bg-gradient-to-r from-purple-900/30 to-purple-900/10 border border-purple-500/30 rounded-xl py-4 px-4 text-purple-300 font-semibold">
          Train models first to enable predictions
        </div>
      )}
    </div>
  )
}
