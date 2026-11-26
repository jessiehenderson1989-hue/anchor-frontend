import { ButtonHTMLAttributes } from 'react'
import { haptics } from '../lib/haptics'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'large' | 'medium'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'large',
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'abtn'

  const variantStyles = {
    primary: 'abtn-primary',
    secondary: 'abtn-soft',
    outline: 'abtn-outline',
  }

  const sizeStyles = {
    large: '',
    medium: 'abtn-sm',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    haptics.light()
    onClick?.(e)
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
