import { FileText, type LucideIcon, MessageCircle, Package, Shield, Users, Zap } from "lucide-react"

export const features: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: MessageCircle,
    title: "Real-time AI Chat",
    description: "1-on-1 and group chat with multilingual support (Burmese/English) for instant customer assistance.",
  },
  {
    icon: Package,
    title: "Smart Product Suggestions",
    description: "AI suggests in-stock products and flags out-of-stock items based on customer queries.",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description: "Upload documents and chat contextually with them for better customer support.",
  },
  {
    icon: Users,
    title: "Custom AI Agents",
    description: "Create personalized AI agents with avatars and specific roles for your business needs.",
  },
  {
    icon: Zap,
    title: "ERP Integration",
    description: "Seamlessly integrated with internal APIs for real-time ERP data access and management.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Enterprise-grade security with JWT tokens and session-based authentication.",
  },
]

export const steps = [
  {
    number: "01",
    title: "Connect Your ERP",
    description: "Integrate Pica Bot with your existing ERP POS system in minutes.",
  },
  {
    number: "02",
    title: "Train Your AI",
    description: "Upload your product catalogs and business rules to customize the AI.",
  },
  {
    number: "03",
    title: "Start Assisting",
    description: "Your team can now provide instant, intelligent customer support.",
  },
]

export interface NavItem {
  title: string
  href?: string
  subItems?: { title: string; href: string }[]
}

export const navItems: NavItem[] = [
  {
    title: "Product",
    subItems: [
      { title: "Features", href: "#features" },
      { title: "How It Works", href: "#how-it-works" },
      { title: "Integrations", href: "#integrations" },
      { title: "API Docs", href: "#api" },
    ],
  },
  {
    title: "Solutions",
    subItems: [
      { title: "Small Business", href: "#small-business" },
      { title: "Enterprise", href: "#enterprise" },
      { title: "Healthcare", href: "#healthcare" },
      { title: "Supplements", href: "#supplements" },
    ],
  },
  { title: "Pricing", href: "#pricing" },
  { title: "About", href: "#about" },
  { title: "Contact", href: "#contact" },
]
