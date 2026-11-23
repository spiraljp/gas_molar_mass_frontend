import { mediaUrl } from '../api/media'
import type { Gas } from '../types/gas'

interface GasVideoProps {
  gas: Gas
  className?: string
}

function GasVideo({
  gas,
  className,
}: GasVideoProps) {
  const videoUrl =
    mediaUrl(gas.gas_video_url, '/media/default-gas-video.mp4')

  const imageUrl =
    mediaUrl(gas.gas_image_url, '/media/default-gas.png')

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
      aria-label={`Видео: ${gas.gas_name}`}
    />
  )
}

export default GasVideo
