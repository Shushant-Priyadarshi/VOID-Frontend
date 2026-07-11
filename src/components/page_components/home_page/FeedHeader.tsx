import { motion, useReducedMotion } from "framer-motion"
import { pageVariants } from "@/lib/animations"

export default function FeedHeader() {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="mb-5"
    >
      <h1 className="text-xl font-bold tracking-tight text-foreground">Feed</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">
        What's happening in your medical community
      </p>
    </motion.div>
  )
}