"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { TeamMember } from "@/types/team";

const SOCIALS = [
  { key: "linkedin", icon: "ph:linkedin-logo", label: "LinkedIn" },
  { key: "instagram", icon: "ph:instagram-logo", label: "Instagram" },
  { key: "facebook", icon: "ph:facebook-logo", label: "Facebook" },
  { key: "twitter", icon: "ph:x-logo", label: "X" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

function SocialLinks({ member, size = "sm" }: { member: TeamMember; size?: "sm" | "lg" }) {
  const links = SOCIALS.filter((s) => member[s.key]);
  if (links.length === 0) return null;
  const box = size === "lg" ? "h-11 w-11" : "h-9 w-9";

  return (
    <div className="flex gap-2">
      {links.map((s) => (
        <a
          key={s.key}
          href={member[s.key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on ${s.label}`}
          onClick={(e) => e.stopPropagation()}
          className={`${box} flex items-center justify-center rounded-full border border-stone-300 text-stone-600 transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]`}
        >
          <Icon icon={s.icon} width={size === "lg" ? 20 : 16} />
        </a>
      ))}
    </div>
  );
}

function Spotlight({ member, onOpen }: { member: TeamMember; onOpen: () => void }) {
  return (
    <article className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
      <button
        type="button"
        onClick={onOpen}
        className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-sm bg-stone-200 text-left"
        aria-label={`View ${member.name}'s profile`}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute inset-3 border border-primary/30 transition-colors duration-500 group-hover:border-primary/60" />
      </button>

      <div>
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
          {pad(1)} — Leadership
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
          {member.name}
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-stone-500">
          {member.role}
          {member.experience && <span className="text-[#9a7a1e]"> · {member.experience}</span>}
        </p>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg line-clamp-6">
          {member.bio}
        </p>

        {member.specialties?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {member.specialties.slice(0, 5).map((s) => (
              <li
                key={s}
                className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs tracking-wide text-stone-600"
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={onOpen}
            className="group inline-flex cursor-pointer items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#9a7a1e]"
          >
            Full Profile
            <Icon
              icon="ph:arrow-right"
              width={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
          <SocialLinks member={member} />
        </div>
      </div>
    </article>
  );
}

function MemberCard({
  member,
  index,
  onOpen,
}: {
  member: TeamMember;
  index: number;
  onOpen: () => void;
}) {
  return (
    <article className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-sm bg-stone-200 text-left"
        aria-label={`View ${member.name}'s profile`}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top grayscale-[20%] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
        <span className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        <span className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/70" />

        <span className="absolute left-5 top-5 font-[family-name:var(--font-display)] text-lg italic text-white">
          {pad(index)}
        </span>
        {member.experience && (
          <span className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a1e] backdrop-blur-sm">
            {member.experience}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 p-6">
          <span className="block font-[family-name:var(--font-display)] text-3xl font-medium leading-tight text-white">
            {member.name}
          </span>
          <span className="mt-1 flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-white/75">
              {member.role}
            </span>
            <Icon
              icon="ph:arrow-up-right"
              width={20}
              className="shrink-0 text-primary opacity-0 transition-all duration-500 group-hover:opacity-100"
            />
          </span>
        </span>
      </button>
    </article>
  );
}

function ProfileModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={member.name}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-stone-200 bg-white text-[#1a1714] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 sm:rounded-sm md:grid-cols-[2fr_3fr] md:overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#1a1714] shadow-sm backdrop-blur-sm transition-colors hover:text-[#9a7a1e]"
        >
          <Icon icon="ph:x" width={20} />
        </button>

        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[560px]">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(min-width: 768px) 400px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <div className="p-8 md:max-h-[92vh] md:overflow-y-auto md:p-12" data-lenis-prevent>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
            {member.experience ? `Experience · ${member.experience}` : "Elite Property"}
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-5xl">
            {member.name}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-stone-500">{member.role}</p>

          <div className="my-8 h-px w-16 bg-primary/60" />

          <p className="whitespace-pre-line leading-relaxed text-stone-600">{member.bio}</p>

          {member.specialties?.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-stone-400">
                Specialties
              </h3>
              <ul className="flex flex-wrap gap-2">
                {member.specialties.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-[#9a7a1e]/30 bg-[#faf8f3] px-4 py-1.5 text-xs tracking-wide text-[#9a7a1e]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(member.email || member.phone) && (
            <div className="mt-10 space-y-3">
              {member.phone && (
                <a
                  href={`tel:${member.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-4 text-stone-700 transition-colors hover:text-[#9a7a1e]"
                >
                  <Icon icon="ph:phone" width={18} className="text-[#9a7a1e]" />
                  {member.phone}
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-4 break-all text-stone-700 transition-colors hover:text-[#9a7a1e]"
                >
                  <Icon icon="ph:envelope-simple" width={18} className="text-[#9a7a1e]" />
                  {member.email}
                </a>
              )}
            </div>
          )}

          <div className="mt-10 border-t border-stone-200 pt-8">
            <SocialLinks member={member} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamShowcase({ members }: { members: TeamMember[] }) {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const [lead, ...rest] = members;

  return (
    <>
      <Spotlight member={lead} onOpen={() => setSelected(lead)} />

      {rest.length > 0 && (
        <>
          <div className="mb-12 mt-24 flex items-end justify-between gap-6 border-b border-stone-300 pb-6 md:mt-32">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium md:text-5xl">
              The <em className="text-[#9a7a1e]">team</em>
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              {pad(rest.length)} Advisors
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-10">
            {rest.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i + 2} onOpen={() => setSelected(m)} />
            ))}
          </div>
        </>
      )}

      {selected && <ProfileModal member={selected} onClose={close} />}
    </>
  );
}
