import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoHeart, IoHeartHalf, IoSparkles } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'

export default function Hub() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { playKiss, playClick } = useAudio()

  const handleBegin = () => {
    playKiss()
    navigate('/personalization')
  }

  const handleSillyCrybaby = () => {
    playClick()
    navigate('/daily-love')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        {/* Main Heart */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ marginBottom: 24, position: 'relative' }}
        >
          <div style={{
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: 75,
            background: colors.primaryGlow,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
          <IoHeart size={90} color={colors.primary} />
        </motion.div>

        <h1 style={{
          fontSize: 44,
          fontWeight: 300,
          color: colors.textPrimary,
          marginBottom: 12,
          letterSpacing: 2,
        }}>
          For Sehaj
        </h1>

        <p style={{
          fontSize: 16,
          color: colors.textSecondary,
          marginBottom: 30,
          fontStyle: 'italic',
        }}>
          Made with love
        </p>

        {/* BEGIN Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBegin}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            color: 'white',
            padding: '18px 50px',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: `0 8px 24px ${colors.primaryGlow}`,
          }}
        >
          BEGIN
          <IoHeart size={18} />
        </motion.button>

        <p style={{ color: colors.textMuted, margin: '12px 0', fontStyle: 'italic' }}>or</p>

        {/* Silly Crybaby Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSillyCrybaby}
          style={{
            background: colors.glass,
            border: `1.5px solid ${colors.secondary}`,
            borderRadius: 25,
            padding: '14px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IoHeartHalf size={18} color={colors.secondary} />
          <span style={{ color: colors.secondary, fontSize: 14, fontWeight: 500 }}>
            when you're being my silly crybaby
          </span>
          <span>💕</span>
        </motion.button>
      </motion.div>
    </div>
  )
}