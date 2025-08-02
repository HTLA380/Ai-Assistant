import React from "react"
import { Button } from "@mijn-ui/react"
import { motion } from "framer-motion"
import {
  Box,
  CircleDollarSign,
  CreditCard,
  FileSpreadsheet,
  FileText,
  HandCoins,
  Scale,
  TrendingUp,
} from "lucide-react"

type SuggestionItemType = {
  id: string
  icon: React.ReactNode
  text: string
}

const SUGGESTION_ITEMS: SuggestionItemType[] = [
  {
    id: "balance-sheet",
    icon: <FileSpreadsheet className="text-blue-600 dark:text-blue-400" />,
    text: "Balance Sheet",
  },
  {
    id: "income-statement",
    icon: <TrendingUp className="text-green-600 dark:text-green-400" />,
    text: "Income Statement",
  },
  {
    id: "cash-flow",
    icon: <CircleDollarSign className="text-purple-600 dark:text-purple-400" />,
    text: "Cash Flow",
  },
  {
    id: "equity-changes",
    icon: <Scale className="text-yellow-600 dark:text-yellow-400" />,
    text: "Equity Changes",
  },
  {
    id: "sales-report",
    icon: <FileText className="text-blue-600 dark:text-blue-400" />,
    text: "Sales Report",
  },
  {
    id: "inventory",
    icon: <Box className="text-yellow-600 dark:text-yellow-400" />,
    text: "Inventory",
  },

  {
    id: "receivables",
    icon: <HandCoins className="text-green-600 dark:text-green-400" />,
    text: "Receivables",
  },
  {
    id: "payables",
    icon: <CreditCard className="text-red-600 dark:text-red-400" />,
    text: "Payables",
  },
]

const SuggestionItems = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.8 }}
      className="pointer-events-auto mt-6 hidden max-w-[var(--chat-view-max-width)] flex-wrap items-center gap-2 px-4 md:flex lg:px-0">
      {SUGGESTION_ITEMS.map((item) => (
        <Button key={item.id} size="sm" className="gap-2">
          {item.icon}
          {item.text}
        </Button>
      ))}
    </motion.div>
  )
}

export { SuggestionItems }
