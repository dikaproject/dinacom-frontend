"use client"

import React from 'react'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled = false, className = '' }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 
          cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
          ${checked ? 'bg-purple-600' : 'bg-gray-200'}
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${className}
        `}
      >
        <span className="sr-only">
          {checked ? 'Turn off' : 'Turn on'}
        </span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 
            transform rounded-full bg-white shadow 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    )
  }
)

Switch.displayName = 'Switch'

export { Switch }