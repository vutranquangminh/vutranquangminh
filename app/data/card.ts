/**
 * Public rows of the contact card: social profiles anyone can find anyway.
 * Private rows (extra emails, Zalo, WhatsApp, bank accounts, birthday) are NOT here:
 * they come from the CARD_DATA environment variable (see lib/private-card.ts).
 */
import { profile } from "./profile";

export type SocialIcon = "github" | "linkedin" | "facebook" | "instagram" | "threads" | "tiktok" | "telegram";

export type SocialLink = {
  name: string;
  value: string;
  href: string;
  icon: SocialIcon;
  /** Brand color for the icon on the light chip. */
  color?: string;
  /** X-SOCIALPROFILE type in the vCard. */
  vcardProfile?: string;
};

export const telegram: SocialLink = {
  name: "Telegram",
  value: "@vutranquangminh",
  href: "https://t.me/vutranquangminh",
  icon: "telegram",
  color: "#229ed9",
};

export const socialLinks: SocialLink[] = [
  telegram,
  { name: "GitHub", value: "vutranquangminh", href: profile.github, icon: "github", vcardProfile: "github" },
  { name: "LinkedIn", value: "in/vutranquangminh", href: profile.linkedin, icon: "linkedin", color: "#0a66c2", vcardProfile: "linkedin" },
  { name: "Facebook", value: "vutranquangminh.dev", href: "https://www.facebook.com/vutranquangminh.dev/", icon: "facebook", color: "#0866ff", vcardProfile: "facebook" },
  { name: "Instagram", value: "@vtqminh.dev", href: "https://www.instagram.com/vtqminh.dev/", icon: "instagram", color: "#e4405f", vcardProfile: "instagram" },
  { name: "Threads", value: "@vtqminh.dev", href: "https://www.threads.com/@vtqminh.dev", icon: "threads" },
  { name: "TikTok", value: "@vtqminh.dev", href: "https://www.tiktok.com/@vtqminh.dev", icon: "tiktok", vcardProfile: "tiktok" },
];
