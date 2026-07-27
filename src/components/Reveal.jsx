import { motion } from 'framer-motion'

// Fade-and-rise on scroll into view. Wrap any block in <Reveal>.
export default function Reveal({ children, delay = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
