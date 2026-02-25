'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'

interface ClassManagerProps {
  classes: string[]
  onAddClass: (className: string) => void
  onRemoveClass: (className: string) => void
}

export default function ClassManager({
  classes,
  onAddClass,
  onRemoveClass,
}: ClassManagerProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddClass(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="e.g., cats, dogs, birds..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 bg-white/5 border border-pink-500/30 text-white placeholder-white/40 rounded-xl focus:border-pink-400 focus:ring-pink-400/20 focus:ring-2 focus:ring-offset-0 transition text-base"
        />
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-xl font-bold shadow-lg shadow-pink-600/50 transition-all h-10"
          size="sm"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-3">
        {classes.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur">
            <p className="text-sm text-white/60 font-medium">Add a class to get started</p>
          </div>
        ) : (
          classes.map((className, idx) => (
            <div
              key={className}
              className="group relative flex items-center justify-between rounded-xl border border-pink-500/40 bg-gradient-to-r from-pink-900/20 to-pink-900/5 px-4 py-3 hover:border-pink-500/70 hover:bg-pink-900/30 transition-all duration-200 cursor-default"
            >
              <span className="font-semibold text-white text-base">{className}</span>
              <button
                onClick={() => onRemoveClass(className)}
                className="text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
