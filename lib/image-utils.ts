/**
 * Image Processing Utilities
 */

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DIMENSION = 4096
const MIN_DIMENSION = 32

export interface ImageValidation {
  valid: boolean
  errors: string[]
  metadata?: {
    width: number
    height: number
    size: number
    format: string
  }
}

/**
 * Validate image file
 */
export async function validateImage(file: File): Promise<ImageValidation> {
  const errors: string[] = []

  // Check file type
  if (!ALLOWED_FORMATS.includes(file.type)) {
    errors.push(`Invalid format. Allowed: ${ALLOWED_FORMATS.join(', ')}`)
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Check image dimensions
  const dimensions = await getImageDimensions(file)
  if (dimensions) {
    const { width, height } = dimensions

    if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
      errors.push(`Image too small. Minimum: ${MIN_DIMENSION}x${MIN_DIMENSION}`)
    }

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      errors.push(`Image too large. Maximum: ${MAX_DIMENSION}x${MAX_DIMENSION}`)
    }

    return {
      valid: errors.length === 0,
      errors,
      metadata: {
        width,
        height,
        size: file.size,
        format: file.type,
      },
    }
  }

  return {
    valid: false,
    errors: [...errors, 'Unable to read image dimensions'],
  }
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }

    img.src = url
  })
}

/**
 * Resize image to standard size for training
 */
export function resizeImageForTraining(
  file: File,
  targetSize: number = 224
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve(null)
        return
      }

      // Calculate scaling to maintain aspect ratio
      let width = img.width
      let height = img.height

      if (width > height) {
        height = (height / width) * targetSize
        width = targetSize
      } else {
        width = (width / height) * targetSize
        height = targetSize
      }

      canvas.width = targetSize
      canvas.height = targetSize

      // Fill background and draw image
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, targetSize, targetSize)

      const x = (targetSize - width) / 2
      const y = (targetSize - height) / 2
      ctx.drawImage(img, x, y, width, height)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        resolve(blob)
      }, 'image/jpeg', 0.9)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }

    img.src = url
  })
}

/**
 * Convert image to tensor (for TensorFlow.js)
 */
export async function imageToTensor(file: File, targetSize: number = 224) {
  const resizedBlob = await resizeImageForTraining(file, targetSize)
  if (!resizedBlob) return null

  const url = URL.createObjectURL(resizedBlob)
  return url
}

/**
 * Batch validate images
 */
export async function validateBatch(
  files: File[]
): Promise<{ valid: boolean; results: ImageValidation[] }> {
  const results = await Promise.all(files.map(validateImage))
  const valid = results.every((result) => result.valid)
  return { valid, results }
}
