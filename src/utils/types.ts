type UserData = {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  created_at: Date
  is_verified: boolean
  is_admin: boolean
  hash: string
}

type IconSize = '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x' | undefined

type ProductImages = {
  id: number
  path: string
  variant: {
    id: number
    name: string
  }
}
export {
	UserData,
	IconSize,
	ProductImages,
}