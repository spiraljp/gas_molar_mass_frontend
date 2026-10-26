import type { Gas } from '../types/gas'

interface GasVideoProps {
  gas: Gas
  className?: string
  controls?: boolean
}

function GasVideo({
  gas,
  className,
  controls = false,
}: GasVideoProps) {
  const videoUrl =
    gas.gas_video_url?.trim() || '/media/default-gas-video.mp4'

  const imageUrl =
    gas.gas_image_url?.trim() || '/media/default-gas.png'

  return (
    <video
      key={videoUrl}
      className={className}
      src={videoUrl}
      poster={imageUrl}
      autoPlay
      loop
      muted
      playsInline
      controls={controls}
      aria-label={`Видео: ${gas.gas_name}`}
    />
  )
}

export default GasVideo
