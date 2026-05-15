import { Award, Film, Users2 } from "lucide-react";

export const pricingPlans = [
    {
      name: "Basic",
      price: 0,
      billing: "Free Forever",
      description: "Perfect for beginners and casual creators",
      features: [
        "1080p HD Video Uploads",
        "5GB Storage Space",
        "Basic Editing Tools",
        "Limited Analytics",
        "Community Support"
      ],
      cta: "Start Free",
      popular: false,
      icon: Film,
      gradient: "from-gray-400 to-gray-600"
    },
    {
      name: "Pro",
      price: 9.99,
      billing: "per month",
      description: "For serious creators who want to grow",
      features: [
        "4K UHD Video Uploads",
        "50GB Storage Space",
        "Advanced Editing Suite",
        "Detailed Analytics",
        "Priority Support",
        "No Ads",
        "Custom Channel Branding"
      ],
      cta: "Go Pro",
      popular: true,
      icon: Award,
      gradient: "from-reelspro-blue to-reelspro-purple"
    },
    {
      name: "Enterprise",
      price: 29.99,
      billing: "per month",
      description: "For professional teams and businesses",
      features: [
        "8K Video Support",
        "Unlimited Storage",
        "Premium Effects Library",
        "Team Collaboration Tools",
        "White-label Options",
        "API Access",
        "Dedicated Account Manager",
        "Custom Integrations"
      ],
      cta: "Contact Sales",
      popular: false,
      icon: Users2,
      gradient: "from-amber-500 to-orange-600"
    }
  ];