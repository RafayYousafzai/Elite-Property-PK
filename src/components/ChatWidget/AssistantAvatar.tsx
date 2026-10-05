import { ASSISTANT_NAME } from "@/lib/agent/brand";

// Monogram avatar drawn inline: no image request, so it appears instantly and
// can't be blocked by a visitor's network.
export function AssistantAvatar({
  size = 40,
  online = false,
}: {
  size?: number;
  online?: boolean;
}) {
  const dot = Math.max(8, Math.round(size * 0.22));
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#f3dc8b] via-[#d4af37] to-[#9a7a1e] p-[1.5px] shadow-[0_6px_18px_rgba(154,122,30,0.25)]"
        aria-hidden
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#faf8f3]">
          <span
            className="font-[family-name:var(--font-display)] font-semibold italic leading-none text-[#9a7a1e]"
            style={{ fontSize: size * 0.52 }}
          >
            {ASSISTANT_NAME.charAt(0)}
          </span>
        </span>
      </span>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-emerald-500"
          style={{ width: dot, height: dot }}
        />
      )}
      <span className="sr-only">{ASSISTANT_NAME}</span>
    </span>
  );
}
