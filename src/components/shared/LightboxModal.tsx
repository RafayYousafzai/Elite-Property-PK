"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface LightboxModalProps {
  open: boolean;
  close: () => void;
  slides: { src: string }[];
  index: number;
}

export default function LightboxModal({
  open,
  close,
  slides,
  index,
}: LightboxModalProps) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      carousel={{ finite: false }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
