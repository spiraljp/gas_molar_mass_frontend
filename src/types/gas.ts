export interface Gas {
  id: number
  gas_name: string
  gas_formula: string
  short_description: string
  gas_image_url: string | null
  gas_video_url: string | null
  molar_mass: number
  density_normal_conditions: number
  likes_count: number
  is_owner: 0 | 1
}
