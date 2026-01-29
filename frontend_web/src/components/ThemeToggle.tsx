import React from 'react'
import { motion } from 'framer-motion'
import { IoSunny, IoMoon } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

interface ThemeToggleProps {
  style?: React.CSSProperties
}

export default function ThemeToggle({ style }: ThemeToggleProps) {
  const { isDark, toggleTheme, colors } = useTheme()

  const handleToggle = () => {
    haptics.light()
    toggleTheme()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      style={{
        width: 50,
        height: 28,
        borderRadius: 14,
        background: isDark 
          ? 'linear-gradient(135deg, #1a1a2e, #2a2a4e)'
          : 'linear-gradient(135deg, #FFE4B5, #FFA07A)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,140,0,0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        padding: 3,
        cursor: 'pointer',
        position: 'relative',
        boxShadow: isDark 
          ? '0 2px 10px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.05)'
          : '0 2px 10px rgba(255,165,0,0.2)',
        ...style,
      }}
    >
      {/* Background icons */}
      <IoMoon 
        size={12} 
        color={isDark ? colors.secondary : 'rgba(0,0,0,0.2)'} 
        style={{ position: 'absolute', left: 6 }}
      />
      <IoSunny 
        size={12} 
        color={isDark ? 'rgba(255,255,255,0.2)' : '#FF8C00'} 
        style={{ position: 'absolute', right: 6 }}
      />
      
      {/* Toggle knob */}
      <motion.div
        animate={{
          x: isDark ? 0 : 22,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          background: isDark 
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : 'linear-gradient(135deg, #FFD700, #FFA500)',
          boxShadow: isDark 
            ? '0 2px 8px rgba(102, 126, 234, 0.5)'
            : '0 2px 8px rgba(255, 165, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isDark ? (
          <IoMoon size={12} color="white" />
        ) : (
          <IoSunny size={12} color="white" />
        )}
      </motion.div>
    </motion.button>
  )
}
