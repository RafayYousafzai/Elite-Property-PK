import React from "react";
import { X } from "lucide-react";
import { Button, Text } from "./heroui-shims";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  avatarSrc: string;
  onClear?: () => void;
  onMinimize: () => void;
  isMessageEmpty: boolean;
}

export function ChatHeader({
  title,
  subtitle,
  avatarSrc,
  onMinimize,
}: ChatHeaderProps) {
  const defaultAvatar =
    "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=256&auto=format&fit=crop";

  return (
    <header className="relative z-10 flex items-center justify-between gap-2 px-4 py-3 shrink-0 bg-white border-b border-black/5">
      <div className="flex items-center gap-3">
        <div className="flex flex-col ml-2">
          <Text.Heading className="font-semibold text-[16px] leading-tight text-black/80">
            {title}
          </Text.Heading>
          <p className="text-[11px] text-black/80 opacity-80 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          isIconOnly
          onClick={onMinimize}
          // 44px target so the close control is comfortably tappable on phones
          className="h-11 w-11 min-w-11 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 transition-colors duration-200 group"
          aria-label="Close chat"
          variant="ghost"
        >
          <X size={20} className="text-black/70 group-hover:text-black" />
        </Button>
      </div>
    </header>
  );
}
