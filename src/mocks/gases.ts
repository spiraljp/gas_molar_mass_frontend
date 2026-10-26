import type { Gas } from '../types/gas'

export const mockGases: Gas[] = [
  {
    id: 2,
    gas_name: 'Азот',
    gas_formula: 'N2',
    short_description:
      'Основной компонент воздуха, используется для создания инертной среды.',
    gas_image_url: '/media/nitrogen-n2.png',
    gas_video_url: '/media/gas-molecule-motion.mp4',
    molar_mass: 28.01,
    density_normal_conditions: 1.251,
    likes_count: 1,
    is_owner: 0,
  },
  {
    id: 3,
    gas_name: 'Углекислый газ',
    gas_formula: 'CO2',
    short_description:
      'Газ, образующийся при дыхании и горении.',
    gas_image_url: '/media/carbon-dioxide-co2.png',
    gas_video_url: '/media/gas-blue-particles.mp4',
    molar_mass: 44.01,
    density_normal_conditions: 1.977,
    likes_count: 1,
    is_owner: 0,
  },
  {
    id: 4,
    gas_name: 'Гелий',
    gas_formula: 'He',
    short_description:
      'Лёгкий инертный газ, используется для наполнения воздушных шаров.',
    gas_image_url: '/media/helium-he.png',
    gas_video_url: '/media/gas-atom-structure.mp4',
    molar_mass: 4.0026,
    density_normal_conditions: 0.1785,
    likes_count: 0,
    is_owner: 0,
  },
  {
    id: 5,
    gas_name: 'Метан',
    gas_formula: 'CH4',
    short_description:
      'Основной компонент природного газа.',
    gas_image_url: '/media/methane-ch4.png',
    gas_video_url: '/media/gas-laboratory-flow.mp4',
    molar_mass: 16.04,
    density_normal_conditions: 0.717,
    likes_count: 0,
    is_owner: 0,
  },
  {
    id: 6,
    gas_name: 'Кислород',
    gas_formula: 'O2',
    short_description:
      'Компонент воздуха, необходимый для дыхания и поддерживающий горение.',
    gas_image_url: null,
    gas_video_url: null,
    molar_mass: 32,
    density_normal_conditions: 1.429,
    likes_count: 0,
    is_owner: 0,
  },
]
