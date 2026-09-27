export interface ExtractionProgress {
  status: string
  progress: number
}

export async function extractFileText(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void,
) {
  if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
    onProgress?.({ status: 'Reading text', progress: 1 })
    return file.text()
  }

  if (file.type.startsWith('image/')) {
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker('eng', 1, {
      logger: (message) => {
        if (typeof message.progress === 'number') {
          onProgress?.({ status: message.status, progress: message.progress })
        }
      },
    })

    try {
      const result = await worker.recognize(file)
      const text = result.data.text.trim()
      if (!text) {
        throw new Error('No readable text was found in this image. Try a clearer, well-lit photo.')
      }
      return text
    } finally {
      await worker.terminate()
    }
  }

  throw new Error('Upload a JPG, PNG, WebP, or plain-text file, or paste the response text.')
}
