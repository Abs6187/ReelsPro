import { 
  Film, 
  Upload, 
  Share2, 
  Shield, 
  Zap, 
  MessageSquare,
  Sparkles,
  Palette,
  Users,
  Award
} from "lucide-react";

export const features = [
  {
    id: 1,
    title: "HD Video Uploads",
    description: "Upload high-definition videos that maintain their quality, showcasing your content exactly as you intended.",
    icon: Upload,
    animation: "fade-in-up",
    delay: "100",
    image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-blue-600/20 to-purple-600/20",
    highlight: "4K Support",
    size: "small" // new size property
  },
  {
    id: 2,
    title: "Rapid Sharing",
    description: "Share your videos instantly across all major social platforms with a single click.",
    icon: Share2,
    animation: "fade-in-up",
    delay: "200",
    image: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-pink-600/20 to-orange-600/20",
    highlight: "Instant Share",
    size: "large" // new size property
  },
  {
    id: 3,
    title: "Advanced Security",
    description: "Keep your content secure with our advanced encryption and privacy controls.",
    icon: Shield,
    animation: "fade-in-up",
    delay: "300",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-green-600/20 to-emerald-600/20",
    highlight: "End-to-End Encryption",
    size: "medium" // new size property
  },
  {
    id: 4,
    title: "Trending Discovery",
    description: "Get discovered by thousands of users with our intelligent trend-based recommendation system.",
    icon: Zap,
    animation: "fade-in-up",
    delay: "400",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-amber-600/20 to-yellow-600/20",
    highlight: "AI Powered",
    size: "medium" // new size property
  },
  {
    id: 5,
    title: "Interactive Comments",
    description: "Build community through real-time, interactive comment threads on all your videos.",
    icon: MessageSquare,
    animation: "fade-in-up",
    delay: "500",
    image: "https://images.unsplash.com/photo-1573164713712-03790a178651?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-indigo-600/20 to-blue-600/20",
    highlight: "Real-time Chat",
    size: "small" // new size property
  },
  {
    id: 6,
    title: "Creative Filters",
    description: "Express yourself with our vast library of high-quality effects, filters, and transitions.",
    icon: Film,
    animation: "fade-in-up",
    delay: "600",
    image: "https://images.unsplash.com/photo-1550784343-6bd0ce5d600b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-purple-600/20 to-fuchsia-600/20",
    highlight: "100+ Filters",
    size: "large" // new size property
  },
  {
    id: 7,
    title: "AI Enhancement",
    description: "Use our AI-powered tools to automatically enhance video quality, remove noise, and stabilize footage.",
    icon: Sparkles,
    animation: "fade-in-up",
    delay: "700",
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-cyan-600/20 to-teal-600/20",
    highlight: "Smart Enhance",
    size: "medium" // new size property
  },
  {
    id: 8,
    title: "Custom Themes",
    description: "Personalize your channel with custom themes, colors, and layouts to match your brand identity.",
    icon: Palette,
    animation: "fade-in-up",
    delay: "800",
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-red-600/20 to-orange-600/20",
    highlight: "Brand Customization",
    size: "small" // new size property
  },
  {
    id: 9,
    title: "Creator Community",
    description: "Connect with other creators, collaborate on projects, and grow your audience together.",
    icon: Users,
    animation: "fade-in-up",
    delay: "900",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-blue-600/20 to-violet-600/20",
    highlight: "Collaboration Tools",
    size: "large" // new size property
  },
  {
    id: 10,
    title: "Verified Achievements",
    description: "Showcase badges and milestones earned through your content creation journey and community contributions.",
    icon: Award,
    animation: "fade-in-up",
    delay: "1000",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=500&h=350",
    backgroundColor: "from-yellow-600/20 to-orange-500/20",
    highlight: "Badge System",
    size: "small"
  }
];