import { Switch } from "@/components/ui/switch"
import { EyeOff, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface Props {
  isAnonymous: boolean
  onToggle: (value: boolean) => void
}

export default function PostTypeToggle({ isAnonymous, onToggle }: Props) {
  const shouldReduce = useReducedMotion()

  return (
    <button
      type="button"
      onClick={() => onToggle(!isAnonymous)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300",
        isAnonymous
          ? "border-slate-300/80 bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/50"
          : "border-teal-200/80 bg-teal-50/50 dark:border-teal-800/50 dark:bg-teal-950/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          isAnonymous
            ? "bg-slate-200 dark:bg-slate-800"
            : "bg-teal-100 dark:bg-teal-900/50"
        )}>
          <AnimatePresence mode="wait">
            {isAnonymous ? (
              <motion.div
                key="anon"
                initial={shouldReduce ? {} : { scale: 0.7, opacity: 0 }}
                animate={shouldReduce ? {} : { scale: 1, opacity: 1 }}
                exit={shouldReduce ? {} : { scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <EyeOff className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </motion.div>
            ) : (
              <motion.div
                key="named"
                initial={shouldReduce ? {} : { scale: 0.7, opacity: 0 }}
                animate={shouldReduce ? {} : { scale: 1, opacity: 1 }}
                exit={shouldReduce ? {} : { scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <p className={cn(
            "text-sm font-semibold leading-tight transition-colors",
            isAnonymous ? "text-slate-700 dark:text-slate-300" : "text-teal-700 dark:text-teal-300"
          )}>
            {isAnonymous ? "Posting anonymously" : "Posting as yourself"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isAnonymous
              ? "Shown as your role and institution only"
              : "Your name and photo will be visible"}
          </p>
        </div>
      </div>

      <Switch
        checked={isAnonymous}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />
    </button>
  )
}