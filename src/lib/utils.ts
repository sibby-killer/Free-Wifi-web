import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppLink(phoneNumber: string, message: string) {
  // Ensure phone number has country code +254 for Kenya
  let formattedPhone = phoneNumber.trim();
  
  // Remove any spaces, dashes, or parentheses
  formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
  
  // Remove + if present
  formattedPhone = formattedPhone.replace(/^\+/, '');
  
  // Convert 07... or 01... to 254...
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.substring(1);
  }
  
  // If it doesn't start with 254, add it
  if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRelativeTime(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export const REGIONS = {
  kakamega: {
    name: "Kakamega",
    subLocations: ["Lurambi", "Koro", "Milimani", "Others"],
  },
  bungoma: {
    name: "Bungoma",
    subLocations: ["Marel", "Bridge", "Kanduyi", "Others"],
  },
};

export const PLANS = {
  "10mbps": {
    name: "10 Mbps Basic Plan",
    speed: "10 Mbps",
    price: 1500,
    description: "Good for browsing & social media",
  },
  "12mbps": {
    name: "12 Mbps Premium Plan",
    speed: "12 Mbps",
    price: 2000,
    description: "Best for streaming & gaming",
  },
};

export const WHATSAPP_NUMBERS = [
  { value: "0762667048", label: "0762667048" },
  { value: "0768294174", label: "0768294174" },
];

export const PROBLEM_TYPES = [
  "No Internet",
  "Slow Speed",
  "Router Issue",
  "Billing Issue",
  "Other",
];

export const URGENCY_LEVELS = [
  { value: "low", label: "Low - Can wait", color: "#10B981" },
  { value: "medium", label: "Medium - Need help today", color: "#F59E0B" },
  { value: "high", label: "High - No internet at all", color: "#EF4444" },
];
