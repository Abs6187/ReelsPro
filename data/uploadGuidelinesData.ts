import { Check, AlertCircle, LucideIcon } from 'lucide-react';

export interface GuidelineItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const uploadGuidelinesData: GuidelineItem[] = [
  {
    title: "High Quality",
    description: "Upload in the highest resolution possible for the best viewing experience",
    icon: Check,
  },
  {
    title: "Optimal Format",
    description: "MP4 format with H.264 codec is recommended for best compatibility",
    icon: Check,
  },
  {
    title: "Size Limits",
    description: "Videos can be up to 50MB for free accounts",
    icon: AlertCircle,
  },
];
