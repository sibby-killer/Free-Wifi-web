"use client";

import Image from "next/image";

interface IconProps {
    className?: string;
    size?: number;
}

// Custom image-based icons from icons folder
export function AIChatIcon({ className = "", size = 24 }: IconProps) {
    return (
        <Image
            src="/icons/ai chat icon.jpg"
            alt="AI Chat"
            width={size}
            height={size}
            className={`rounded ${className}`}
        />
    );
}

export function LogoIcon({ className = "", size = 40 }: IconProps) {
    return (
        <Image
            src="/icons/free wifi logo.jpg"
            alt="FreeWiFi KE"
            width={size}
            height={size}
            className={`rounded-lg object-cover ${className}`}
        />
    );
}

export function GmailIcon({ className = "", size = 24 }: IconProps) {
    return (
        <Image
            src="/icons/gmail icon.png"
            alt="Email"
            width={size}
            height={size}
            className={className}
        />
    );
}

export function OrderIcon({ className = "", size = 24 }: IconProps) {
    return (
        <Image
            src="/icons/order icon.jpg"
            alt="Orders"
            width={size}
            height={size}
            className={`rounded ${className}`}
        />
    );
}

export function WhatsAppIcon({ className = "", size = 24 }: IconProps) {
    return (
        <Image
            src="/icons/whatsapp icon.png"
            alt="WhatsApp"
            width={size}
            height={size}
            className={className}
        />
    );
}

// SVG-based icons for items without custom images
export function DashboardIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

export function StarIcon({ className = "", size = 24, filled = false }: IconProps & { filled?: boolean }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

export function WifiIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
    );
}

export function ToolIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}

export function ChatIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}

export function LocationIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export function CheckIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export function BoltIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    );
}

export function SparkleIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
        </svg>
    );
}

export function MoneyIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 0 1 0 4H8" />
            <path d="M12 6v2m0 8v2" />
        </svg>
    );
}

export function GlobeIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

export function DocumentIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
        </svg>
    );
}

export function LockIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export function LogoutIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

export function WaveIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M20.27 16.265l-.705-1.205c-.15-.252-.313-.492-.48-.72-.12-.168-.24-.336-.37-.5-.165-.216-.33-.432-.51-.636-.195-.216-.39-.432-.6-.636-.255-.252-.54-.492-.84-.72-.21-.156-.42-.312-.645-.456-.27-.168-.57-.336-.87-.48-.24-.12-.495-.228-.75-.336-.285-.12-.57-.228-.87-.312-.285-.084-.58-.156-.87-.216-.285-.06-.57-.108-.855-.132-.285-.024-.57-.024-.84-.024-.27 0-.57.024-.84.072-.27.048-.54.108-.81.18-.255.072-.51.156-.75.252-.24.096-.48.204-.705.324-.21.108-.42.228-.615.36-.18.12-.33.24-.48.372-.12.12-.24.24-.345.372-.09.12-.18.24-.255.372-.06.12-.12.24-.165.372-.045.12-.075.252-.09.384-.015.12-.015.252 0 .384.015.132.045.252.09.372.045.132.105.252.18.372.075.132.165.24.27.348.12.12.255.228.405.324.165.108.345.204.54.288.21.084.435.156.675.204.255.048.51.072.78.072h1.71c.165 0 .315-.012.465-.036.135-.024.27-.06.39-.108.12-.048.225-.108.33-.18.09-.072.18-.156.255-.252.06-.084.12-.18.165-.288.03-.108.06-.216.06-.336 0-.108-.015-.216-.045-.312-.03-.108-.075-.204-.135-.288-.06-.096-.135-.18-.225-.252-.09-.072-.195-.132-.315-.18-.135-.048-.27-.072-.42-.072h-.945l.015-1.5h.93c.84 0 1.605.264 2.235.72.135.096.255.204.375.312.105.108.21.228.3.348.075.12.15.24.21.372.045.12.09.24.12.372.015.12.03.252.03.384 0 .12-.015.24-.03.348-.015.12-.03.228-.06.336-.03.12-.06.228-.105.336-.045.096-.09.192-.15.276-.06.096-.12.18-.195.264-.075.084-.165.168-.255.24-.105.084-.21.156-.33.228-.12.072-.255.132-.39.192-.15.06-.3.12-.465.156-.165.048-.345.084-.525.108-.195.024-.39.036-.6.036h-1.71c-.45 0-.885-.06-1.29-.18-.195-.06-.39-.132-.57-.216-.18-.084-.345-.18-.51-.288-.15-.108-.3-.216-.435-.348-.12-.12-.24-.252-.345-.384-.09-.132-.18-.276-.255-.42-.06-.144-.12-.288-.165-.444-.03-.156-.06-.312-.06-.468 0-.168.015-.336.06-.492.045-.168.09-.324.165-.48.075-.156.165-.3.27-.444.12-.156.24-.288.39-.42.165-.144.345-.276.54-.396.21-.12.42-.24.66-.336.255-.108.525-.192.81-.264.3-.072.615-.12.93-.156.33-.036.675-.048 1.02-.036.36.012.705.048 1.05.108.33.06.66.144.975.24.3.096.6.216.885.348.27.132.54.276.795.432.24.156.48.324.705.504.21.18.42.372.615.576.18.192.36.396.525.612.15.204.3.42.435.636.12.204.24.42.345.648l.705 1.248-1.305.756z" />
        </svg>
    );
}

export function UserIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function AlertIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

export function BellIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
export function TrashIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    );
}
