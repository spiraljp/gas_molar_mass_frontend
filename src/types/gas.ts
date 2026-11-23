export interface Gas {
  id: number
  gas_name: string
  gas_formula: string
  short_description: string
  gas_image_url: string | null
  gas_video_url: string | null
  molar_mass: number | null
  density_normal_conditions: number | null
  likes_count: number
  is_owner: number
  is_liked?: number
  gas_status?: string
}
