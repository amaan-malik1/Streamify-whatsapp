import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { PaletteIcon } from 'lucide-react'
import { THEMES } from '../constants'

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="dropdown dropdown-end">
      {/* dropdown trigger */}
      <button className="btn btn-ghost btn-circle">
        <PaletteIcon className='size-5' />
      </button>

      {/* dropdown content */}
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-2 shadow bg-base-100 rounded-box w-60 max-h-64 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOptions) => (
            <button
              key={themeOptions.name}
              className={`
                w-full px-4 py-3 rounded-xl flex items-center gap-2
                ${theme === themeOptions.name
                  ? "bg-primary/10"
                  : "hover:bg-base-content/5"}
              `}
              onClick={() => setTheme(themeOptions.name)}
            >
              <PaletteIcon className='size-4' />
              <span className="text-sm font-medium">{themeOptions.label}</span>

              {/* Theme preview colors */}
              <div className="ml-auto flex gap-1">
                {themeOptions.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
