import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBackOutline, IoMoon, IoSunny } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

export default function VirtualBed() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [isNight, setIsNight] = useState(false)
  const [cat1Mood, setCat1Mood] = useState<'happy' | 'sleepy' | 'playing'>('happy')
  const [cat2Mood, setCat2Mood] = useState<'happy' | 'sleepy' | 'playing'>('happy')
  const [showBlanket, setShowBlanket] = useState(false)

  // Auto-cycle time of day every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsNight(prev => !prev)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleCat1Click = () => {
    haptics.light()
    const moods: Array<'happy' | 'sleepy' | 'playing'> = ['happy', 'sleepy', 'playing']
    const currentIndex = moods.indexOf(cat1Mood)
    setCat1Mood(moods[(currentIndex + 1) % moods.length])
  }

  const handleCat2Click = () => {
    haptics.light()
    const moods: Array<'happy' | 'sleepy' | 'playing'> = ['happy', 'sleepy', 'playing']
    const currentIndex = moods.indexOf(cat2Mood)
    setCat2Mood(moods[(currentIndex + 1) % moods.length])
  }

  const toggleBlanket = () => {
    haptics.medium()
    setShowBlanket(prev => !prev)
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: isNight 
        ? 'linear-gradient(180deg, #1a1a2e 0%, #2d2d44 100%)'
        : 'linear-gradient(180deg, #87CEEB 0%, #FFA07A 100%)',
      transition: 'background 1s ease',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          haptics.light()
          navigate(-1)
        }}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 12,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        <IoChevronBackOutline size={24} color={colors.textPrimary} />
      </motion.button>

      {/* Time Indicator */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 80,
        background: colors.glass,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 100,
      }}>
        {isNight ? <IoMoon size={20} color="#FFD700" /> : <IoSunny size={20} color="#FFA500" />}
        <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600 }}>
          {isNight ? 'Night' : 'Day'}
        </span>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: 600,
        margin: '80px auto 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Virtual Bed 🛏️
        </h1>

        {/* Room Container */}
        <div style={{
          width: '100%',
          background: colors.glass,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          borderRadius: 24,
          padding: 24,
          position: 'relative',
          boxShadow: `0 8px 32px ${colors.primaryGlow}`,
        }}>
          {/* Window */}
          <div style={{
            width: 120,
            height: 100,
            background: isNight 
              ? 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)'
              : 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)',
            border: `4px solid ${isNight ? '#4a4a5e' : '#8B4513'}`,
            borderRadius: 8,
            margin: '0 auto 16px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 1s ease',
            boxShadow: isNight 
              ? 'inset 0 0 20px rgba(255,255,255,0.1)'
              : 'inset 0 0 20px rgba(255,255,255,0.3)',
          }}>
            {/* Window divider */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 4,
              height: '100%',
              background: isNight ? '#4a4a5e' : '#8B4513',
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: 4,
              background: isNight ? '#4a4a5e' : '#8B4513',
            }} />
            
            {/* Stars at night or sun during day */}
            {isNight ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      width: 3,
                      height: 3,
                      background: 'white',
                      borderRadius: '50%',
                      left: `${20 + (i % 4) * 25}%`,
                      top: `${20 + Math.floor(i / 4) * 40}%`,
                    }}
                  />
                ))}
              </>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                  boxShadow: '0 0 20px #FFA500',
                  top: '20%',
                  right: '15%',
                }}
              />
            )}
          </div>

          {/* Bed */}
          <div style={{
            width: '100%',
            height: 250,
            background: 'linear-gradient(135deg, #D2691E 0%, #8B4513 100%)',
            borderRadius: 16,
            position: 'relative',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            border: '3px solid #A0522D',
          }}>
            {/* Mattress */}
            <div style={{
              width: '90%',
              height: 180,
              background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
              borderRadius: '12px 12px 8px 8px',
              position: 'absolute',
              top: 10,
              left: '5%',
              border: '2px solid #80DEEA',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
            }}>
              {/* Pillows */}
              <div style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                marginTop: 12,
              }}>
                <div style={{
                  width: 80,
                  height: 50,
                  background: 'linear-gradient(135deg, #FFFACD 0%, #FFF8DC 100%)',
                  borderRadius: '50%',
                  border: '2px solid #FFE4B5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }} />
                <div style={{
                  width: 80,
                  height: 50,
                  background: 'linear-gradient(135deg, #FFFACD 0%, #FFF8DC 100%)',
                  borderRadius: '50%',
                  border: '2px solid #FFE4B5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }} />
              </div>

              {/* Cat 1 - Left side */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCat1Click}
                animate={cat1Mood === 'playing' ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 0.5, repeat: cat1Mood === 'playing' ? Infinity : 0 }}
                style={{
                  position: 'absolute',
                  left: '15%',
                  bottom: '25%',
                  cursor: 'pointer',
                }}
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_ea00522a-d50f-4f38-a93e-0ece2d9e5cd8/artifacts/a6djxcrh_Image%209.jpeg"
                  alt="Cat 1"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: 'contain',
                    filter: cat1Mood === 'sleepy' ? 'brightness(0.8)' : 'brightness(1)',
                    transition: 'filter 0.3s',
                  }}
                />
                <div style={{
                  fontSize: 20,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  {cat1Mood === 'happy' && '😸'}
                  {cat1Mood === 'sleepy' && '😴'}
                  {cat1Mood === 'playing' && '🎮'}
                </div>
              </motion.div>

              {/* Cat 2 - Right side */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCat2Click}
                animate={cat2Mood === 'playing' ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 0.5, repeat: cat2Mood === 'playing' ? Infinity : 0 }}
                style={{
                  position: 'absolute',
                  right: '15%',
                  bottom: '25%',
                  cursor: 'pointer',
                }}
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_ea00522a-d50f-4f38-a93e-0ece2d9e5cd8/artifacts/a6djxcrh_Image%209.jpeg"
                  alt="Cat 2"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: 'contain',
                    filter: cat2Mood === 'sleepy' ? 'brightness(0.8)' : 'brightness(1)',
                    transform: 'scaleX(-1)',
                    transition: 'filter 0.3s',
                  }}
                />
                <div style={{
                  fontSize: 20,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  {cat2Mood === 'happy' && '😸'}
                  {cat2Mood === 'sleepy' && '😴'}
                  {cat2Mood === 'playing' && '🎮'}
                </div>
              </motion.div>

              {/* Blanket */}
              <AnimatePresence>
                {showBlanket && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60%',
                      background: 'linear-gradient(135deg, #87CEEB 10%, transparent 10%, transparent 50%, #87CEEB 50%, #87CEEB 60%, transparent 60%, transparent 100%)',
                      backgroundSize: '20px 20px',
                      border: '2px solid #5F9EA0',
                      borderRadius: '0 0 8px 8px',
                      opacity: 0.9,
                      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            marginTop: 24,
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleBlanket}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                border: 'none',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.primaryGlow}`,
              }}
            >
              {showBlanket ? '🛏️ Remove Blanket' : '🛏️ Add Blanket'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptics.medium()
                setIsNight(prev => !prev)
              }}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: colors.glass,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.primaryGlow}`,
              }}
            >
              {isNight ? '☀️ Make Day' : '🌙 Make Night'}
            </motion.button>
          </div>

          <p style={{
            marginTop: 16,
            textAlign: 'center',
            color: colors.textSecondary,
            fontSize: 14,
          }}>
            Click on the cats to change their mood! 🐱
          </p>
        </div>
      </div>
    </div>
  )
}
