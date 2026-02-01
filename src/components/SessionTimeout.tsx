"use client";

import { useEffect, useRef } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export function SessionTimeout() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (isSignedIn) {
        // Sign out the user
        signOut({ redirectUrl: "/" });
      }
    }, TIMEOUT_DURATION);
  };

  useEffect(() => {
    // Only track activity if user is signed in and not on public pages
    if (!isSignedIn || pathname === "/" || pathname.startsWith("/sign-")) {
      return;
    }

    // Events that indicate user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timeout on any activity
    const handleActivity = () => {
      resetTimeout();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSignedIn, pathname, signOut]);

  // Check on route changes
  useEffect(() => {
    if (isSignedIn && !pathname.startsWith("/sign-")) {
      resetTimeout();
    }
  }, [pathname, isSignedIn]);

  return null; // This component doesn't render anything
}
