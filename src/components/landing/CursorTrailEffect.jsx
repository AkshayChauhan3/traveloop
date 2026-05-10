import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Travel-themed Unsplash images for the trail effect
const TRAIL_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=70', // mountains
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=70', // beach
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=70', // mountains lake
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200&q=70', // airplane window
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=70', // city aerial
  'https://images.unsplash.com/photo-1510525009511-b48d444334e8?w=200&q=70', // tropical
  'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=200&q=70', // beach sunset
  'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=200&q=70', // travel
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&q=70', // road trip
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=200&q=70', // culture
]

let imageIndex = 0

export default function CursorTrailEffect() {
  const [trail, setTrail] = useState([])
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const lastPos = useRef({ x: 0, y: 0 })
  const idCounter = useRef(0)
  const throttleRef = useRef(null)

  const addTrailItem = useCallback((x, y) => {
    const id = idCounter.current++
    const img = TRAIL_IMAGES[imageIndex % TRAIL_IMAGES.length]
    imageIndex++
    
    const offsetX = (Math.random() - 0.5) * 60
    const offsetY = (Math.random() - 0.5) * 60
    const rotation = (Math.random() - 0.5) * 30
    const scale = 0.6 + Math.random() * 0.5
    const size = 80 + Math.random() * 60

    setTrail(prev => [
      ...prev.slice(-15), // keep last 15
      { id, x: x + offsetX, y: y + offsetY, img, rotation, scale, size }
    ])

    // Remove after animation
    setTimeout(() => {
      setTrail(prev => prev.filter(item => item.id !== id))
    }, 1200)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      setCursorPos({ x: clientX, y: clientY })

      const dx = clientX - lastPos.current.x
      const dy = clientY - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 50 && !throttleRef.current) {
        lastPos.current = { x: clientX, y: clientY }
        addTrailItem(clientX, clientY)
        throttleRef.current = setTimeout(() => {
          throttleRef.current = null
        }, 200)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (throttleRef.current) clearTimeout(throttleRef.current)
    }
  }, [addTrailItem])

  return (
    <>
      {/* Custom cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-normal"
        style={{ left: cursorPos.x, top: cursorPos.y, translateX: '-50%', translateY: '-50%' }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full border border-brand-400/60"
          style={{ width: 40, height: 40, x: '-50%', y: '-50%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Inner dot */}
        <div
          className="absolute rounded-full bg-brand-400"
          style={{ width: 6, height: 6, x: '-50%', y: '-50%', transform: 'translate(-50%, -50%)' }}
        />
        {/* Glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 20, height: 20, x: '-50%', y: '-50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Trail images */}
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            className="fixed pointer-events-none z-[9990]"
            style={{
              left: item.x,
              top: item.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{
              opacity: 0,
              scale: 0.3,
              rotate: item.rotation - 15,
              y: 0,
            }}
            animate={{
              opacity: [0, 0.85, 0.85, 0],
              scale: [0.3, item.scale, item.scale * 0.9],
              rotate: item.rotation,
              y: -60,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.1,
              ease: 'easeOut',
              times: [0, 0.2, 0.8, 1],
            }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: item.size,
                height: item.size * 0.7,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <img
                src={item.img}
                alt="travel"
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Overlay shimmer */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, transparent 60%)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}
