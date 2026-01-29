import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoPlay, IoPause, IoPlaySkipForward, IoPlaySkipBack, IoVolumeHigh, IoVolumeMute, IoMusicalNotes, IoChevronUp, IoChevronDown } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useMusic, PLAYLIST } from '../context/MusicContext'
import haptics from '../utils/haptics'

interface MusicJukeboxProps {
  compact?: boolean
  style?: React.CSSProperties
}

export default function MusicJukebox({ compact = false, style }: MusicJukeboxProps) {
  const { colors, isDark } = useTheme()
  const { 
    currentTrack, 
    isPlaying, 
    isMuted, 
    progress, 
    duration,
    togglePlayPause, 
    toggleMute, 
    nextTrack, 
    previousTrack,
    playTrack,
    currentTrackIndex,
  } = useMusic()
  const [expanded, setExpanded] = useState(false)

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

  const handlePlayTrack = (index: number) => {
    haptics.medium()
    playTrack(index)
  }

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: 16,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          ...style,
        }}
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IoMusicalNotes size={20} color="white" />
        </motion.div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ 
            color: colors.textPrimary, 
            fontSize: 13, 
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {currentTrack?.title || 'No Track'}
          </p>
          <p style={{ 
            color: colors.textMuted, 
            fontSize: 11,
          }}>
            {currentTrack?.artist || 'Unknown'}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptics.light(); togglePlayPause(); }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: colors.primary,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isPlaying ? <IoPause size={16} color="white" /> : <IoPlay size={16} color="white" style={{ marginLeft: 2 }} />}
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      style={{
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(15px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: 20,
        padding: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        ...style,
      }}
    >
      {/* Header with expand toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={isPlaying ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 20px ${colors.primaryGlow}`,
            flexShrink: 0,
          }}
        >
          <IoMusicalNotes size={28} color="white" />
        </motion.div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ 
            color: colors.textPrimary, 
            fontSize: 15, 
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {currentTrack?.title || 'No Track'}
          </p>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: 13,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {currentTrack?.artist || 'Unknown Artist'}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(!expanded)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {expanded ? <IoChevronUp size={18} color={colors.textMuted} /> : <IoChevronDown size={18} color={colors.textMuted} />}
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          width: '100%',
          height: 6,
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: 3,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ color: colors.textMuted, fontSize: 11 }}>{formatTime(progress)}</span>
          <span style={{ color: colors.textMuted, fontSize: 11 }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptics.light(); previousTrack(); }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IoPlaySkipBack size={22} color={colors.textSecondary} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptics.medium(); togglePlayPause(); }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 20px ${colors.primaryGlow}`,
          }}
        >
          {isPlaying ? <IoPause size={26} color="white" /> : <IoPlay size={26} color="white" style={{ marginLeft: 3 }} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptics.light(); nextTrack(); }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IoPlaySkipForward size={22} color={colors.textSecondary} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptics.light(); toggleMute(); }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isMuted ? <IoVolumeMute size={18} color={colors.textMuted} /> : <IoVolumeHigh size={18} color={colors.textSecondary} />}
        </motion.button>
      </div>

      {/* Song List (Expanded) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginTop: 16 }}
          >
            <div style={{
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              paddingTop: 12,
            }}>
              <p style={{ 
                color: colors.textMuted, 
                fontSize: 11, 
                fontWeight: 600, 
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 8,
              }}>
                Playlist
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PLAYLIST.map((track, index) => (
                  <motion.button
                    key={track.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handlePlayTrack(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: 'none',
                      background: currentTrackIndex === index 
                        ? `${colors.primary}20`
                        : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: currentTrackIndex === index 
                        ? colors.primary
                        : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {currentTrackIndex === index && isPlaying ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <IoMusicalNotes size={14} color="white" />
                        </motion.div>
                      ) : (
                        <span style={{ 
                          color: currentTrackIndex === index ? 'white' : colors.textMuted, 
                          fontSize: 12, 
                          fontWeight: 600 
                        }}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ 
                        color: currentTrackIndex === index ? colors.primary : colors.textPrimary, 
                        fontSize: 13, 
                        fontWeight: currentTrackIndex === index ? 600 : 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {track.title}
                      </p>
                      <p style={{ 
                        color: colors.textMuted, 
                        fontSize: 11,
                      }}>
                        {track.artist}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
