import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoChevronBack, IoHeart, IoChevronForward } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import { useAudio } from '../context/AudioContext'

const ORIGIN_STORY = [
  // REMOVED: "It started with a simple 'hi' on Tinder." line as per request
  { text: "I thought you were cute (still do).", delay: 0 },
  { text: "You thought I was... acceptable?", delay: 0.5 },
  { text: "Fast forward to today...", delay: 1 },
  { text: "And here we are.", delay: 1.5 },
]

export default function Origin() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { userName } = useUser()
  const { playClick, playMagic } = useAudio()

  const handleContinue = () => {
    playMagic()
    navigate('/crossword')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      position: 'relative',
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playClick(); navigate(-1); }}
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center', maxWidth: 400 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ marginBottom: 24 }}
        >
          <IoHeart size={60} color={colors.primary} />
        </motion.div>

        <h1 style={{ fontSize: 28, fontWeight: 300, color: colors.textPrimary, marginBottom: 8 }}>
          Our Story
        </h1>
        <p style={{ color: colors.textSecondary, fontStyle: 'italic', marginBottom: 40 }}>
          How it all began, {userName}
        </p>

        <div style={{ marginBottom: 40 }}>
          {ORIGIN_STORY.map((item, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay, duration: 0.6 }}
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              {item.text}
            </motion.p>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            color: 'white',
            padding: '16px 36px',
            borderRadius: 30,
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '0 auto',
            boxShadow: `0 6px 20px ${colors.primaryGlow}`,
          }}
        >
          Continue
          <IoChevronForward size={20} />
        </motion.button>
      </motion.div>
    </div>
  )
}