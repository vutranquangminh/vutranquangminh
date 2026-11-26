"use client";

import { useRef } from "react";
import { profile } from "../data/profile";

const NEWERA_MARK =
  "M0.642781 19.6186C0.187816 19.6186 -0.122886 20.0787 0.0470367 20.5007L5.89394 35.0228C5.99182 35.2659 6.22875 35.4273 6.49052 35.4147C12.3481 35.1325 16.2664 29.1733 14.0574 23.6835L13.2009 21.5576C12.8522 20.6922 13.4939 19.7504 14.4313 19.7504H15.37C15.9122 19.7504 16.4001 20.0783 16.6003 20.5789L24.0076 38.9745C24.1055 39.2176 24.343 39.3785 24.6048 39.3684C31.9859 39.084 36.9455 31.5957 34.1704 24.7004L32.9042 21.5563C32.5555 20.6908 33.1972 19.7504 34.1346 19.7504H43.752C44.207 19.7504 44.5177 19.2903 44.3477 18.8683L38.5008 4.34618C38.403 4.10307 38.166 3.94164 37.9043 3.95425C32.0467 4.23652 28.1284 10.1956 30.3374 15.6841L31.1939 17.8127C31.5426 18.6781 30.9009 19.6186 29.9635 19.6186H28.8922C28.35 19.6186 27.862 19.2906 27.6618 18.7901L20.2559 0.39456C20.1581 0.15144 19.9205 -0.00954107 19.6587 0.000550581C12.2776 0.284973 7.31798 7.77329 10.0931 14.6686L11.3593 17.8127C11.708 18.6781 11.0663 19.6186 10.1289 19.6186H0.642781Z";

// Flat grey facets, as printed on premium card stock (viewBox 1586x1000).
const FACETS: [string, string, number][] = [
  ["40,390 250,390 145,540", "#8e8e93", 0.55],
  ["250,390 145,540 355,540", "#5d5d62", 0.6],
  ["145,540 355,540 250,690", "#76767b", 0.5],
  ["40,540 145,540 92,620", "#9d9da2", 0.4],
  ["355,450 470,450 412,535", "#6c6c71", 0.45],
  ["260,300 340,300 300,360", "#a3a3a8", 0.4],
  ["1020,110 1250,110 1135,250", "#8a8a8f", 0.5],
  ["1135,250 1020,390 1250,390", "#66666b", 0.55],
  ["1250,110 1340,110 1295,175", "#a0a0a5", 0.38],
  ["1250,390 1340,390 1295,325", "#77777c", 0.38],
];

type Props = {
  /** Micro-label beside the date, two lines (like VALID THRU). */
  dateLabel?: [string, string];
  dateValue: string;
  /** Small label under the DEV mark (like "Debit" under VISA). */
  networkLabel?: string;
};

/**
 * The signature contact card, modelled on premium bank cards: charcoal matte stock, flat grey facets,
 * flat silver print, thin round numerals, a formal script and a heavy-italic mark. Every size is in
 * cqw (1% of the card's width) so it scales as one piece. Tilts and catches the light under a mouse.
 */
export default function PlatinumCard({ dateLabel = ["SHIPPING", "SINCE"], dateValue, networkLabel = "Software" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card || e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
    card.style.setProperty("--rx", `${(0.5 - y) * 9}deg`);
    card.style.setProperty("--gx", `${x * 100}%`);
    card.style.setProperty("--gy", `${y * 100}%`);
    card.style.setProperty("--glare", "1");
  }

  function onLeave() {
    ["--rx", "--ry", "--glare"].forEach((name) => ref.current?.style.removeProperty(name));
  }

  return (
    <div className="@container [perspective:1100px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        role="img"
        aria-label={`Contact card: ${profile.nickname}, ${profile.nameAscii}, phone ${profile.phoneCard}, ${profile.title}`}
        className="relative aspect-[1.586] w-full overflow-hidden rounded-[4.4cqw] font-display text-[#e6e6e9] shadow-[inset_0_1px_0_rgb(255_255_255/.12),inset_0_0_0_1px_rgb(255_255_255/.05),0_50px_80px_-30px_rgb(0_0_0/.95),0_20px_34px_-18px_rgb(0_0_0/.7)] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:transition-none"
        style={{
          background:
            "linear-gradient(118deg, rgb(255 255 255 / 0) 30%, rgb(255 255 255 / .06) 48%, rgb(255 255 255 / 0) 66%), radial-gradient(130% 100% at 100% 0%, #4a4a4e 0%, rgb(74 74 78 / 0) 55%), linear-gradient(155deg, #3b3b3f 0%, #2a2a2d 45%, #1e1e21 100%)",
        }}
      >
        {/* Matte grain */}
        <div aria-hidden className="card-grain pointer-events-none absolute inset-0 opacity-[.28] mix-blend-overlay" />
        {/* Light sweep on load */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-[60%] -inset-y-[30%] animate-sweep bg-[linear-gradient(112deg,rgb(255_255_255/0)_42%,rgb(255_255_255/.12)_50%,rgb(255_255_255/0)_58%)] motion-reduce:hidden"
        />
        {/* Glare under the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[var(--glare,0)] transition-opacity duration-300 [background:radial-gradient(60%_80%_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/.10),rgb(255_255_255/0)_60%)]"
        />

        <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 1586 1000" preserveAspectRatio="none">
          {FACETS.map(([points, fill, opacity]) => (
            <polygon key={points} points={points} fill={fill} opacity={opacity} />
          ))}
        </svg>

        <div aria-hidden>
          {/* Issuer slot: wordmark with its mark raised at the end */}
          <p className="absolute top-[9%] left-[31%] flex items-start gap-[.9cqw] text-[5.8cqw] leading-none font-bold tracking-[-.01em]">
            NewEra
            <svg viewBox="0 0 45 40" className="-mt-[2.6cqw] h-[4.8cqw] w-[5.4cqw] fill-current">
              <path d={NEWERA_MARK} />
            </svg>
          </p>

          {/* Contactless mark */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="absolute top-[21%] left-[55%] size-[5.8cqw]">
            <path d="M5.5 10.2a2.6 2.6 0 0 1 0 3.6M9 7.8a6 6 0 0 1 0 8.4M12.5 5.4a9.4 9.4 0 0 1 0 13.2M16 3a12.8 12.8 0 0 1 0 18" />
          </svg>

          <p className="absolute top-[35.5%] left-[15%] font-script text-[16.5cqw] leading-none whitespace-nowrap text-[#dcdce0] [text-shadow:0_.2cqw_.3cqw_rgb(0_0_0/.35)]">
            {profile.nickname}
          </p>

          {/* EMV chip */}
          <svg viewBox="0 0 46 35" className="absolute top-[63.5%] left-[8%] h-[8.4cqw] w-[11cqw]">
            <defs>
              <linearGradient id="pcard-emv" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ececef" />
                <stop offset=".5" stopColor="#b3b3b9" />
                <stop offset="1" stopColor="#d8d8dc" />
              </linearGradient>
            </defs>
            <rect x=".5" y=".5" width="45" height="34" rx="6" fill="url(#pcard-emv)" stroke="#808087" strokeWidth=".8" />
            <path d="M.5 12h13M.5 23h13M32.5 12h13M32.5 23h13M13.5 .5v34M32.5 .5v34M13.5 17.5h19" stroke="#808087" strokeWidth=".9" fill="none" />
          </svg>

          <p className="absolute top-[63.2%] left-[24.5%] text-[6.3cqw] leading-[1.15] font-light tracking-[.07em] whitespace-nowrap">{profile.phoneCard}</p>

          <p className="absolute top-[76.5%] left-[38%] flex items-center gap-[1.2cqw] leading-[1.15] whitespace-nowrap">
            <span className="text-right text-[1.35cqw] font-medium tracking-[.06em] text-[#b9b9be]">
              {dateLabel[0]}
              <br />
              {dateLabel[1]}
            </span>
            <span className="text-[3.1cqw] font-light tracking-[.08em]">{dateValue}</span>
          </p>

          <p className="absolute bottom-[5.5%] left-[8%] text-[3.7cqw] leading-[1.15] tracking-[.17em] whitespace-nowrap uppercase">{profile.nameAscii}</p>

          {/* Network slot (where VISA sits) */}
          <p className="absolute top-[43%] right-[6.5%] text-right leading-[.9]">
            <b className="block text-[9cqw] font-extrabold tracking-[-.02em] text-[#f2f2f4] italic">DEV</b>
            <small className="mt-[.6cqw] block text-[2.3cqw] font-normal text-[#c4c4c9]">{networkLabel}</small>
          </p>
        </div>
      </div>
    </div>
  );
}
