import { cn } from "@mijn-ui/react"
import { motion } from "framer-motion"

const WelcomeMessage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-[90%] flex-col items-start justify-center px-4 lg:px-0 xl:max-w-3xl",
        className,
      )}>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold md:text-xl md:font-medium">
        Hello there!
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl font-medium text-muted-foreground md:text-xl md:font-normal">
        How can I help you today?
      </motion.h1>
    </div>
  )
}

export { WelcomeMessage }
