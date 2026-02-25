'use client'

import React from "react"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  classes: string[]
  trainingData: { [key: string]: File[] }
  onAddImages: (className: string, images: File[]) => void
  onRemoveImage: (className: string, index: number) => void
}

export default function ImageUploader({
  classes,
  trainingData,
  onAddImages,
  onRemoveImage,
}: ImageUploaderProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || '')

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (selectedClass && files.length > 0) {
      onAddImages(selectedClass, files)
    }
    e.target.value = ''
  }

  return (
    <div className="space-y-5">
      {classes.length === 0 ? (
        <div className="text-center py-10 px-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur">
          <ImageIcon className="h-10 w-10 text-white/30 mx-auto mb-3" />
          <p className="text-sm text-white/60 font-medium">Create classes first to upload images</p>
        </div>
      ) : (
        <>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3 block">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-900/20 to-purple-900/5 p-3 text-white text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:ring-offset-0 transition font-semibold"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-black cursor-pointer transition-all h-11 shadow-lg shadow-purple-600/50"
            >
              <span className="flex items-center justify-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Images
              </span>
            </Button>
          </label>

          {/* Display uploaded images per class */}
          <div className="space-y-4">
            {classes.map((className) => {
              const images = trainingData[className] || []
              return images.length > 0 ? (
                <div key={className} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{className}</p>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300">
                      {images.length} images
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="rounded-lg border border-white/10 bg-white/5 aspect-square flex items-center justify-center overflow-hidden hover:border-white/20 transition">
                          {file.type.startsWith('image/') && (
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={`${className}-${idx}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {!file.type.startsWith('image/') && (
                            <ImageIcon className="h-6 w-6 text-white/30" />
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveImage(className, idx)}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500/80 hover:bg-red-600 p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <Trash2 className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })}
          </div>
        </>
      )}
    </div>
  )
}
