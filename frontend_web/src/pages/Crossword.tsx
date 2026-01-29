import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBackOutline, IoHelp, IoCheckmarkCircle, IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'

interface Clue {
  number: number
  clue: string
  answer: string
  row: number
  col: number
  direction: 'across' | 'down'
}

// Moderate difficulty crossword themed around love and relationship
const CROSSWORD_PUZZLE: Clue[] = [
  { number: 1, clue: 'Deep affection (4)', answer: 'LOVE', row: 0, col: 0, direction: 'across' },
  { number: 2, clue: 'Forever partner (4)', answer: 'SOUL', row: 0, col: 6, direction: 'down' },
  { number: 3, clue: 'Symbol of love (5)', answer: 'HEART', row: 2, col: 0, direction: 'across' },
  { number: 4, clue: 'Your girl (5)', answer: 'SEHAJ', row: 0, col: 0, direction: 'down' },
  { number: 5, clue: 'Warm embrace (3)', answer: 'HUG', row: 4, col: 2, direction: 'across' },
  { number: 6, clue: 'Sweet gesture (4)', answer: 'KISS', row: 2, col: 6, direction: 'down' },
  { number: 7, clue: 'Your boy (5)', answer: 'PRABH', row: 6, col: 0, direction: 'across' },
  { number: 8, clue: 'Romantic gesture (4)', answer: 'DATE', row: 4, col: 7, direction: 'down' },
  { number: 9, clue: 'Close together (6)', answer: 'CUDDLE', row: 8, col: 3, direction: 'across' },
  { number: 10, clue: 'Facial joy (5)', answer: 'SMILE', row: 0, col: 10, direction: 'down' },
]

const GRID_SIZE = 11

const createEmptyGrid = (): (string | null)[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
}

const createBlackSquares = (): boolean[][] => {
  const blacks = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  
  // Place black squares strategically
  const blackPositions = [
    [1, 3], [1, 7], [3, 1], [3, 5], [3, 9],
    [5, 0], [5, 1], [5, 6], [5, 9], [5, 10],
    [7, 2], [7, 6], [7, 10], [9, 1], [9, 5], [9, 9]
  ]
  
  blackPositions.forEach(([r, c]) => {
    if (r < GRID_SIZE && c < GRID_SIZE) {
      blacks[r][c] = true
    }
  })
  
  return blacks
}

export default function Crossword() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  
  const [userGrid, setUserGrid] = useState<(string | null)[][]>(() => {
    const saved = localStorage.getItem('crossword_progress')
    return saved ? JSON.parse(saved) : createEmptyGrid()
  })
  
  const [blackSquares] = useState(createBlackSquares())
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across')
  const [revealCount, setRevealCount] = useState(3)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)

  // Save progress
  useEffect(() => {
    localStorage.setItem('crossword_progress', JSON.stringify(userGrid))
  }, [userGrid])

  // Check if puzzle is complete
  const isComplete = () => {
    return CROSSWORD_PUZZLE.every(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        const row = clue.direction === 'across' ? clue.row : clue.row + i
        const col = clue.direction === 'across' ? clue.col + i : clue.col
        if (userGrid[row][col] !== clue.answer[i]) return false
      }
      return true
    })
  }

  useEffect(() => {
    if (isComplete()) {
      haptics.success()
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [userGrid])

  const handleCellClick = (row: number, col: number) => {
    if (blackSquares[row][col]) return
    
    haptics.selection()
    
    // Toggle direction if clicking same cell
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setSelectedDirection(prev => prev === 'across' ? 'down' : 'across')
    } else {
      setSelectedCell({ row, col })
    }
    
    setShowKeyboard(true)
  }

  const handleLetterInput = (letter: string) => {
    if (!selectedCell) return
    
    haptics.light()
    
    const { row, col } = selectedCell
    const newGrid = userGrid.map(r => [...r])
    newGrid[row][col] = letter
    setUserGrid(newGrid)
    
    // Move to next cell
    if (selectedDirection === 'across') {
      let nextCol = col + 1
      while (nextCol < GRID_SIZE && blackSquares[row][nextCol]) nextCol++
      if (nextCol < GRID_SIZE) {
        setSelectedCell({ row, col: nextCol })
      }
    } else {
      let nextRow = row + 1
      while (nextRow < GRID_SIZE && blackSquares[nextRow][col]) nextRow++
      if (nextRow < GRID_SIZE) {
        setSelectedCell({ row: nextRow, col })
      }
    }
  }

  const handleBackspace = () => {
    if (!selectedCell) return
    
    haptics.light()
    
    const { row, col } = selectedCell
    const newGrid = userGrid.map(r => [...r])
    newGrid[row][col] = null
    setUserGrid(newGrid)
  }

  const handleRevealLetter = () => {
    if (revealCount <= 0 || !selectedCell) return
    
    haptics.medium()
    
    const { row, col } = selectedCell
    
    // Find which answer this cell belongs to
    for (const clue of CROSSWORD_PUZZLE) {
      for (let i = 0; i < clue.answer.length; i++) {
        const cellRow = clue.direction === 'across' ? clue.row : clue.row + i
        const cellCol = clue.direction === 'across' ? clue.col + i : clue.col
        
        if (cellRow === row && cellCol === col) {
          const newGrid = userGrid.map(r => [...r])
          newGrid[row][col] = clue.answer[i]
          setUserGrid(newGrid)
          setRevealCount(prev => prev - 1)
          return
        }
      }
    }
  }

  const handleCheckWord = () => {
    if (!selectedCell) return
    
    haptics.medium()
    
    const { row, col } = selectedCell
    
    // Find word at current position
    const clue = CROSSWORD_PUZZLE.find(c => {
      if (c.direction === selectedDirection) {
        if (selectedDirection === 'across') {
          return c.row === row && col >= c.col && col < c.col + c.answer.length
        } else {
          return c.col === col && row >= c.row && row < c.row + c.answer.length
        }
      }
      return false
    })
    
    if (!clue) return
    
    // Check if word is correct
    let isCorrect = true
    for (let i = 0; i < clue.answer.length; i++) {
      const cellRow = clue.direction === 'across' ? clue.row : clue.row + i
      const cellCol = clue.direction === 'across' ? clue.col + i : clue.col
      
      if (userGrid[cellRow][cellCol] !== clue.answer[i]) {
        isCorrect = false
        break
      }
    }
    
    if (isCorrect) {
      haptics.success()
      alert('✓ Correct!')
    } else {
      alert('✗ Not quite right. Keep trying!')
    }
  }

  const getClueNumber = (row: number, col: number): number | null => {
    const clue = CROSSWORD_PUZZLE.find(c => c.row === row && c.col === col)
    return clue ? clue.number : null
  }

  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false
    
    // Highlight selected cell
    if (selectedCell.row === row && selectedCell.col === col) return true
    
    // Highlight entire word
    const clue = CROSSWORD_PUZZLE.find(c => {
      if (c.direction === selectedDirection) {
        if (selectedDirection === 'across') {
          return c.row === selectedCell.row && selectedCell.col >= c.col && selectedCell.col < c.col + c.answer.length &&
                 row === c.row && col >= c.col && col < c.col + c.answer.length
        } else {
          return c.col === selectedCell.col && selectedCell.row >= c.row && selectedCell.row < c.row + c.answer.length &&
                 col === c.col && row >= c.row && row < c.row + c.answer.length
        }
      }
      return false
    })
    
    return !!clue
  }

  const acrossClues = CROSSWORD_PUZZLE.filter(c => c.direction === 'across')
  const downClues = CROSSWORD_PUZZLE.filter(c => c.direction === 'down')

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      padding: 24,
      paddingTop: 80,
      position: 'relative',
      overflow: 'auto',
    }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
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

      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            Crossword ✏️
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: 14 }}>
            {isComplete() ? '🎉 Puzzle Complete!' : 'Fill in all the words'}
          </p>
        </div>

        {/* Puzzle Container */}
        <div style={{
          background: colors.glass,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          padding: 24,
          boxShadow: `0 8px 32px ${colors.primaryGlow}`,
        }}>
          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: 2,
            maxWidth: 450,
            margin: '0 auto 24px',
            touchAction: 'none',
          }}>
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => {
                const isBlack = blackSquares[row][col]
                const clueNum = getClueNumber(row, col)
                const highlighted = isHighlighted(row, col)
                const isSelected = selectedCell?.row === row && selectedCell?.col === col

                return (
                  <motion.div
                    key={`${row},${col}`}
                    whileTap={!isBlack ? { scale: 0.95 } : {}}
                    onClick={() => !isBlack && handleCellClick(row, col)}
                    style={{
                      aspectRatio: '1',
                      background: isBlack
                        ? '#000'
                        : isSelected
                        ? colors.primary
                        : highlighted
                        ? colors.primaryLight
                        : colors.card,
                      border: `2px solid ${isSelected ? colors.primaryDark : highlighted ? colors.primary : colors.border}`,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 700,
                      color: isSelected || highlighted ? 'white' : colors.textPrimary,
                      cursor: isBlack ? 'default' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s',
                    }}
                  >
                    {clueNum && (
                      <span style={{
                        position: 'absolute',
                        top: 2,
                        left: 3,
                        fontSize: 8,
                        fontWeight: 600,
                        color: isSelected || highlighted ? 'rgba(255,255,255,0.7)' : colors.textMuted,
                      }}>
                        {clueNum}
                      </span>
                    )}
                    {!isBlack && userGrid[row][col]}
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRevealLetter}
              disabled={revealCount <= 0 || !selectedCell}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                background: revealCount > 0 && selectedCell ? colors.card : colors.border,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: 600,
                cursor: revealCount > 0 && selectedCell ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: revealCount > 0 && selectedCell ? 1 : 0.5,
              }}
            >
              <IoHelp size={18} />
              Reveal ({revealCount})
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckWord}
              disabled={!selectedCell}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                background: selectedCell ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.border,
                border: 'none',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedCell ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: selectedCell ? 1 : 0.5,
              }}
            >
              <IoCheckmarkCircle size={18} />
              Check Word
            </motion.button>
          </div>

          {/* Clues */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}>
            <div>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: 12,
              }}>
                Across
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {acrossClues.map((clue) => (
                  <p key={clue.number} style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    lineHeight: 1.4,
                  }}>
                    <strong style={{ color: colors.textPrimary }}>{clue.number}.</strong> {clue.clue}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: 12,
              }}>
                Down
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {downClues.map((clue) => (
                  <p key={clue.number} style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    lineHeight: 1.4,
                  }}>
                    <strong style={{ color: colors.textPrimary }}>{clue.number}.</strong> {clue.clue}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* On-Screen Keyboard */}
      <AnimatePresence>
        {showKeyboard && (
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: colors.card,
              borderTop: `2px solid ${colors.border}`,
              padding: 16,
              zIndex: 1000,
            }}
          >
            <div style={{
              maxWidth: 500,
              margin: '0 auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600 }}>
                  Enter Letter
                </p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowKeyboard(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <IoClose size={24} color={colors.textMuted} />
                </motion.button>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 8,
                marginBottom: 8,
              }}>
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                  <motion.button
                    key={letter}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLetterInput(letter)}
                    style={{
                      padding: '12px',
                      borderRadius: 8,
                      background: colors.glass,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBackspace}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  background: colors.error,
                  border: 'none',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Backspace
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
