import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoHeart, IoEye, IoPeople } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { usePresence } from '../context/PresenceContext'

// User Setup Modal - "Who is using this phone?"
export function UserSetupModal() {
  const { colors } = useTheme()
  const { showUserSetup, setCurrentUser } = usePresence()

  if (!showUserSetup) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            background: colors.card,
            borderRadius: 24,
            padding: 28,
            maxWidth: 360,
            width: '100%',
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: colors.primaryGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <IoPeople size={40} color={colors.primary} />
          </div>

          <h2 style={{ color: colors.textPrimary, fontSize: 22, fontWeight: 600, marginBottom: 24 }}>
            Who is using this phone?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentUser('prabh')}
              style={{
                background: 'linear-gradient(135deg, #6B5B95, #8B7BA7, #A99BBD)',
                border: 'none',
                borderRadius: 16,
                padding: '16px 24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>I'm Prabh</span>
              <span style={{ fontSize: 24 }}>👨‍💻</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentUser('sehaj')}
              style={{
                background: 'linear-gradient(135deg, #FF6B9D, #FF8FAB, #FFB3C1)',
                border: 'none',
                borderRadius: 16,
                padding: '16px 24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>I'm Sehaj</span>
              <span style={{ fontSize: 24 }}>❄️</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Presence Check Modal - "Should I tell them I was here?"
export function PresenceCheckModal() {
  const { colors } = useTheme()
  const { showPresenceCheck, currentUser, markPresence } = usePresence()
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!showPresenceCheck) return null

  const handleYes = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      markPresence(true)
      setShowConfirmation(false)
    }, 1500)
  }

  const handleNo = () => {
    markPresence(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            background: colors.card,
            borderRadius: 24,
            padding: 24,
            maxWidth: 360,
            width: '100%',
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {showConfirmation ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{ padding: 20 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <IoHeart size={50} color={colors.primary} />
              </motion.div>
              <p style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 500, marginTop: 16 }}>
                They'll know you were here 💕
              </p>
            </motion.div>
          ) : (
            <>
              <IoEye size={36} color={colors.secondary} />

              <h2 style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 600, marginTop: 16, marginBottom: 24 }}>
                Should I tell them I was here?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleYes}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    border: 'none',
                    borderRadius: 14,
                    padding: '14px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Yes bub, I was here</span>
                  <IoHeart size={16} color="white" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleNo}
                  style={{
                    background: colors.glass,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 14,
                    padding: '14px 16px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 1.4 }}>
                    Nah I'm shy / mad / sad<br />and can't lose my nonchalance
                  </span>
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Presence Display - Shows who was here recently
export function PresenceDisplay({ style }: { style?: React.CSSProperties }) {
  const { colors } = useTheme()
  const { prabhPresence, sehajPresence, getTimeAgo } = usePresence()

  const hasPrabhPresence = prabhPresence.shared && prabhPresence.timestamp
  const hasSehajPresence = sehajPresence.shared && sehajPresence.timestamp

  if (!hasPrabhPresence && !hasSehajPresence) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: colors.glass,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 14,
        ...style,
      }}
    >
      <p style={{ 
        color: colors.textMuted, 
        fontSize: 12, 
        fontWeight: 600, 
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
      }}>
        Presence
      </p>

      {hasPrabhPresence && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <IoHeart size={14} color="#6B5B95" />
          <span style={{ color: colors.textSecondary, fontSize: 13 }}>
            Prabh was here recently 💗 ({getTimeAgo(prabhPresence.timestamp!)})
          </span>
        </div>
      )}

      {hasSehajPresence && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IoHeart size={14} color={colors.primary} />
          <span style={{ color: colors.textSecondary, fontSize: 13 }}>
            Sehaj was here recently 💗 ({getTimeAgo(sehajPresence.timestamp!)})
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default { UserSetupModal, PresenceCheckModal, PresenceDisplay }
