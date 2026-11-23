import { useEffect, useRef } from 'react'

interface FilePreviewProps {
  file: File
  kind: 'image' | 'video'
}

export default function FilePreview({ file, kind }: FilePreviewProps) {
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const url = URL.createObjectURL(file)
    media.src = url

    return () => {
      media.removeAttribute('src')
      URL.revokeObjectURL(url)
    }
  }, [file, kind])

  if (kind === 'image') {
    return <img ref={(node) => { mediaRef.current = node }}
      className="file-preview" alt={`Выбранное изображение: ${file.name}`} />
  }

  return <video ref={(node) => { mediaRef.current = node }}
    className="file-preview" controls preload="metadata"
    aria-label={`Выбранное видео: ${file.name}`} />
}
