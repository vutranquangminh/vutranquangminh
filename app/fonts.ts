import { Inter, JetBrains_Mono, Montserrat, Pinyon_Script } from "next/font/google";

// Shared by the contact card (/) and the portfolio (/portfolio).
export const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap" });
export const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});
export const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon", display: "swap" });
export const jetbrains = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-jetbrains", display: "swap" });

export const fontVariables = `${inter.variable} ${montserrat.variable} ${pinyon.variable} ${jetbrains.variable}`;
