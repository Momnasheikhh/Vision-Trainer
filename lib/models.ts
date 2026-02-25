/**
 * Machine Learning Model Utilities
 * Handles model training, inference, and metrics
 */

export interface ModelMetrics {
  accuracy: number
  loss: number
  trainingTime: number
  classCount: number
  imageCount: number
}

export interface PredictionResult {
  predicted: string
  confidence: number
  probabilities: { [key: string]: number }
}

export interface TrainingDataPoint {
  className: string
  imageCount: number
}

/**
 * Validate training data before starting training
 */
export function validateTrainingData(
  classes: string[],
  trainingData: { [key: string]: File[] }
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (classes.length < 2) {
    errors.push('At least 2 classes are required')
  }

  for (const className of classes) {
    const imageCount = (trainingData[className] || []).length
    if (imageCount < 3) {
      errors.push(`Class "${className}" requires at least 3 images`)
    }
    if (imageCount > 1000) {
      errors.push(`Class "${className}" exceeds maximum 1000 images`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get training statistics
 */
export function getTrainingStats(trainingData: { [key: string]: File[] }) {
  const stats = {
    totalClasses: Object.keys(trainingData).length,
    totalImages: 0,
    imagesPerClass: {} as { [key: string]: number },
    minImagesPerClass: Infinity,
    maxImagesPerClass: 0,
  }

  for (const [className, files] of Object.entries(trainingData)) {
    const count = files.length
    stats.totalImages += count
    stats.imagesPerClass[className] = count
    stats.minImagesPerClass = Math.min(stats.minImagesPerClass, count)
    stats.maxImagesPerClass = Math.max(stats.maxImagesPerClass, count)
  }

  return stats
}

/**
 * Calculate F1 score from accuracy and loss
 */
export function calculateF1Score(accuracy: number, loss: number): number {
  // Simplified F1 calculation based on accuracy and loss
  const precision = accuracy * (1 - loss)
  const recall = accuracy
  const f1 = (2 * precision * recall) / (precision + recall + 0.001)
  return Math.min(f1, 1.0)
}

/**
 * Model comparison based on metrics
 */
export function compareModels(
  metrics: { [key: string]: ModelMetrics }
): { [key: string]: number } {
  const scores: { [key: string]: number } = {}

  for (const [modelName, modelMetrics] of Object.entries(metrics)) {
    const accuracyScore = modelMetrics.accuracy * 0.6
    const lossScore = (1 - modelMetrics.loss) * 0.3
    const timeScore = Math.max(0, 1 - modelMetrics.trainingTime / 10000) * 0.1

    scores[modelName] = accuracyScore + lossScore + timeScore
  }

  return scores
}

/**
 * Export model data for download
 */
export function exportModelData(
  metrics: { [key: string]: ModelMetrics },
  trainingStats: any
): string {
  const data = {
    timestamp: new Date().toISOString(),
    trainingStats,
    metrics,
    summary: {
      bestModel: Object.entries(metrics).sort(
        ([, a], [, b]) => b.accuracy - a.accuracy
      )[0]?.[0],
      averageAccuracy:
        Object.values(metrics).reduce((sum, m) => sum + m.accuracy, 0) /
        Object.keys(metrics).length,
    },
  }

  return JSON.stringify(data, null, 2)
}
