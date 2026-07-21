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
    <header className="relative flex items-center justify-between px-4 pt-3 shrink-0 bg-white">
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
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
          aria-label="Minimize"
          variant="ghost"
        >
          <X size={18} className="text-black/80 group-hover:text-black" />
        </Button>
      </div>
    </header>
  );
}
