"use client";

import { useEffect, useState } from "react";
import type { Property } from "@/types/property";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Box,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Images,
  Landmark,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  PhoneCall,
  PlayCircle,
  Ruler,
  Wallet,
} from "lucide-react";
import formatNumberShort from "@/lib/formatNumberShort";
import { formatLocation, getImageUrl, getThumbnailUrl, toSameOrigin } from "@/lib/utils";
import { getBedsCount, getBathsCount } from "@/lib/supabase/properties";

const PhotoSphereViewer = dynamic(() => import("@/components/shared/PhotoSphereViewer"), {
  ssr: false,
});
const LightboxModal = dynamic(() => import("@/components/shared/LightboxModal"), {
  ssr: false,
});

// Extend Window interface for Meta Pixel
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      data?: object,
      options?: object
    ) => void;
  }
}

interface PropertyDetailsClientProps {
  property: Property;
  related?: Property[];
}

const PHONE = "+923344111778";

const toEmbedUrl = (url: string) =>
  url.includes("youtube.com") || url.includes("youtu.be")
    ? url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
    : url;

// Photos use the two versions already stored in R2 (a ~28 KB WebP thumbnail
// and the original), served from this site's own domain via the /media
// rewrite — no image transformations, and reachable for visitors whose ISP
// struggles with the storage domain. If that fails, fall back to R2 directly.
const photoSources = (image: unknown) => {
  const thumb = getThumbnailUrl(image);
  const full = getImageUrl(image);
  return {
    thumb: toSameOrigin(thumb),
    full: toSameOrigin(full),
    fallbacks: [thumb, full],
  };
};

function retryNext(img: HTMLImageElement, fallbacks: string[]) {
  const next = fallbacks[Number(img.dataset.attempt || 0)];
  if (!next) return;
  img.dataset.attempt = String(Number(img.dataset.attempt || 0) + 1);
  img.removeAttribute("srcset");
  // Inside <picture>, a matching <source> would keep winning over img.src
  img.parentElement?.querySelectorAll("source").forEach((source) => source.remove());
  img.src = next;
}

// Server-rendered images can fail before React attaches onError, so also check
// on mount whether the browser already gave up on them.
const catchEarlyFailure = (fallbacks: string[]) => (img: HTMLImageElement | null) => {
  if (img && img.complete && img.naturalWidth === 0) retryNext(img, fallbacks);
};

function GalleryImage({
  image,
  alt,
  hero = false,
}: {
  image: unknown;
  alt: string;
  hero?: boolean;
}) {
  const { thumb, full, fallbacks } = photoSources(image);
  const className =
    "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]";

  // Lead photo: light thumbnail on phones, original on larger screens
  if (hero) {
    const heroFallbacks = [fallbacks[1], fallbacks[0]];
    return (
      <picture>
        <source media="(min-width: 768px)" srcSet={full} />
        <img
          src={thumb}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          ref={catchEarlyFailure(heroFallbacks)}
          onError={(e) => retryNext(e.currentTarget, heroFallbacks)}
          className={className}
        />
      </picture>
    );
  }

  return (
    <img
      src={thumb}
      alt={alt}
      loading="lazy"
      decoding="async"
      ref={catchEarlyFailure(fallbacks)}
      onError={(e) => retryNext(e.currentTarget, fallbacks)}
      className={className}
    />
  );
}

// Size the side tiles so the 2×2 mosaic never leaves an empty cell
const smallTileSpan = (count: number, i: number) => {
  if (count === 1) return "col-span-2 row-span-2";
  if (count === 2) return "col-span-2";
  if (count === 3 && i === 2) return "col-span-2";
  return "";
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
    {children}
  </h2>
);

export default function PropertyDetailsClient({ property, related = [] }: PropertyDetailsClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = property.images && property.images.length > 0 ? property.images : [];
  const formattedPrice = formatNumberShort(Number(property.rate)).replace("Rs", "PKR");
  const bedNum = getBedsCount(property);
  const bathNum = getBathsCount(property);
  const typeLabel = property.property_type?.replace(/-/g, " ");
  const phaseLabel = property.phase
    ? property.phase.trim().toLowerCase().startsWith("dha")
      ? property.phase.trim()
      : `DHA ${property.phase.trim()}`
    : null;
  const whatsappHref = `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(
    `Hi, I'm interested in: ${property.name} (${formattedPrice})`
  )}`;

  const lightboxSlides = images.map((img) => {
    const { thumb, full } = photoSources(img);
    return { src: full, thumb };
  });

  const openGallery = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Send ViewContent event when property loads
  useEffect(() => {
    if (!property) return;

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: property.name,
        content_category: property.property_type,
        content_ids: [property.id],
        content_type: "product",
        value: Number(property.rate) || 0,
        currency: "PKR",
      });
    }
  }, [property]);

  const keyFacts = [
    bedNum > 0 && { icon: BedDouble, label: "Bedrooms", value: String(bedNum) },
    bathNum > 0 && { icon: Bath, label: "Bathrooms", value: String(bathNum) },
    property.area && {
      icon: Maximize,
      label: "Plot size",
      value: `${property.area} ${property.area_unit || "Sq Ft"}`,
    },
    property.constructed_covered_area && {
      icon: Ruler,
      label: "Covered area",
      value: `${property.constructed_covered_area} Sq Ft`,
    },
    typeLabel && { icon: Building2, label: "Type", value: typeLabel },
    phaseLabel && { icon: Landmark, label: "Phase", value: phaseLabel },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string }[];

  const details = [
    typeLabel && ["Property type", typeLabel],
    property.purpose && ["Purpose", `For ${property.purpose}`],
    property.city && ["City", property.city],
    phaseLabel && ["DHA phase", phaseLabel],
    property.sector && ["Sector", property.sector],
    property.street && ["Street", property.street],
    property.created_at && [
      "Date listed",
      new Date(property.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ],
  ].filter(Boolean) as [string, string][];

  const features = property.features ? Object.entries(property.features) : [];

  const installments = property.installment_available
    ? ([
        property.advance_amount != null && [
          "Advance",
          `PKR ${Number(property.advance_amount).toLocaleString()}`,
        ],
        property.no_of_installments != null && [
          "Installments",
          String(property.no_of_installments),
        ],
        property.monthly_installments != null && [
          "Monthly",
          `PKR ${Number(property.monthly_installments).toLocaleString()}`,
        ],
      ].filter(Boolean) as [string, string][])
    : [];

  return (
    <>
      <main className="min-h-screen bg-[#faf8f3] pb-28 text-[#1a1714] lg:pb-0">
        {/* Title block */}
        <section className="!pt-36 !pb-8 md:!pt-44 md:!pb-10">
          <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-stone-500">
              <Link href="/explore" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#9a7a1e]">
                <ArrowLeft size={14} /> All listings
              </Link>
              {typeLabel && (
                <>
                  <ChevronRight size={12} className="text-stone-300" />
                  <span className="capitalize">{typeLabel}</span>
                </>
              )}
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-4xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {property.is_sold ? (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      Sold
                    </span>
                  ) : (
                    property.purpose && (
                      <span className="rounded-full border border-[#9a7a1e]/30 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a1e]">
                        For {property.purpose}
                      </span>
                    )
                  )}
                  {property.installment_available && (
                    <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Installments available
                    </span>
                  )}
                </div>
                <h1 className="break-words font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                  {property.name}
                </h1>
                {property.location && (
                  <p className="mt-4 flex items-center gap-2 text-stone-600">
                    <MapPin size={16} strokeWidth={1.5} className="shrink-0 text-[#9a7a1e]" />
                    {formatLocation(property.location)}
                  </p>
                )}
              </div>
              <div className="shrink-0 lg:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                  Asking price
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
                  {formattedPrice}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="!py-0">
            <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
              <div className="relative grid h-[58vw] max-h-[620px] min-h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-sm md:h-[44vw]">
                <button
                  type="button"
                  onClick={() => openGallery(0)}
                  className={`group relative cursor-pointer overflow-hidden bg-stone-200 ${
                    images.length > 1 ? "col-span-4 row-span-2 md:col-span-2" : "col-span-4 row-span-2"
                  }`}
                  aria-label="Open photo gallery"
                >
                  <GalleryImage image={images[0]} alt={property.name} hero />
                </button>
                {images.slice(1, 5).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openGallery(i + 1)}
                    className={`group relative hidden cursor-pointer overflow-hidden bg-stone-200 md:block ${smallTileSpan(
                      Math.min(images.length - 1, 4),
                      i
                    )}`}
                    aria-label={`Open photo ${i + 2}`}
                  >
                    <GalleryImage image={img} alt={`${property.name} photo ${i + 2}`} />
                  </button>
                ))}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => openGallery(0)}
                    className="absolute bottom-4 right-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white/95 px-4 text-xs font-semibold shadow-lg shadow-black/10 backdrop-blur-sm transition-colors hover:text-[#9a7a1e]"
                  >
                    <Images size={15} strokeWidth={1.75} />
                    View all {images.length} photos
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Body */}
        <section className="!pt-10 !pb-14 md:!pt-12 md:!pb-20">
          <div className="container mx-auto grid max-w-8xl gap-14 px-5 lg:grid-cols-12 lg:gap-16 2xl:px-0">
            <div className="min-w-0 space-y-16 lg:col-span-8">
              {/* Key facts */}
              {keyFacts.length > 0 && (
                <div className="flex flex-wrap gap-px border-y border-stone-200 bg-stone-200">
                  {keyFacts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="min-w-[140px] flex-1 basis-[140px] bg-[#faf8f3] px-4 py-6 first:pl-0 sm:px-6 sm:first:pl-0">
                      <Icon size={20} strokeWidth={1.25} className="text-[#9a7a1e]" />
                      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                        {label}
                      </p>
                      <p className="mt-1 text-lg font-medium capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {property.description && (
                <div>
                  <SectionTitle>About this property</SectionTitle>
                  <p className="mt-6 max-w-3xl whitespace-pre-line leading-relaxed text-stone-600 md:text-lg">
                    {property.description}
                  </p>
                </div>
              )}

              {installments.length > 0 && (
                <div>
                  <SectionTitle>
                    <span className="inline-flex items-center gap-3">
                      <Wallet size={26} strokeWidth={1.25} className="text-[#9a7a1e]" />
                      Installment plan
                    </span>
                  </SectionTitle>
                  <dl className="mt-6 grid gap-px overflow-hidden rounded-sm border border-stone-200 bg-stone-200 sm:grid-cols-3">
                    {installments.map(([label, value]) => (
                      <div key={label} className="bg-white p-6">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                          {label}
                        </dt>
                        <dd className="mt-2 text-xl font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {features.length > 0 && (
                <div>
                  <SectionTitle>Features & amenities</SectionTitle>
                  <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                    {features.map(([key, value]) => (
                      <li
                        key={key}
                        className="flex min-w-0 items-start gap-3 border-b border-stone-200 py-4"
                      >
                        <Check size={16} strokeWidth={2} className="mt-1 shrink-0 text-[#9a7a1e]" />
                        <span className="min-w-0 break-words">
                          <span className="capitalize">{key.replace(/_/g, " ")}</span>
                          {typeof value !== "boolean" && value && String(value).trim() !== "" && (
                            <span className="ml-1.5 text-stone-500">· {String(value)}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {property.video_url && (
                <div>
                  <SectionTitle>
                    <span className="inline-flex items-center gap-3">
                      <PlayCircle size={26} strokeWidth={1.25} className="text-[#9a7a1e]" />
                      Video tour
                    </span>
                  </SectionTitle>
                  <div className="relative mt-6 aspect-video overflow-hidden rounded-sm bg-stone-900">
                    <iframe
                      src={toEmbedUrl(property.video_url)}
                      className="absolute inset-0 h-full w-full"
                      allowFullScreen
                      loading="lazy"
                      title="Property video tour"
                    />
                  </div>
                </div>
              )}

              {property.photo_sphere && (
                <div>
                  <SectionTitle>
                    <span className="inline-flex items-center gap-3">
                      <Box size={26} strokeWidth={1.25} className="text-[#9a7a1e]" />
                      360° view
                    </span>
                  </SectionTitle>
                  <div className="mt-6 h-[450px] overflow-hidden rounded-sm">
                    <PhotoSphereViewer src={property.photo_sphere} height="450px" />
                  </div>
                </div>
              )}

              {details.length > 0 && (
                <div>
                  <SectionTitle>Details</SectionTitle>
                  <dl className="mt-6 grid gap-x-10 sm:grid-cols-2">
                    {details.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-baseline justify-between gap-6 border-b border-stone-200 py-4"
                      >
                        <dt className="text-stone-500">{label}</dt>
                        <dd className="text-right font-medium capitalize">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Enquiry card */}
            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-36 rounded-sm border border-stone-200 bg-white p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                  Interested in this property?
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold">
                  {formattedPrice}
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Speak to an advisor for a viewing, documents or a price discussion.
                </p>

                <div className="mt-8 space-y-3">
                  <a
                    href={`tel:${PHONE}`}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a1714] text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
                  >
                    <Phone size={16} strokeWidth={1.75} /> Call advisor
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-full border border-stone-300 text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
                  >
                    <MessageCircle size={16} strokeWidth={1.75} /> WhatsApp
                  </a>
                  <Link
                    href="/request-callback"
                    className="flex h-11 items-center justify-center gap-2 text-sm font-semibold text-[#9a7a1e] underline-offset-4 hover:underline"
                  >
                    <PhoneCall size={15} strokeWidth={1.75} /> Request a call back
                  </Link>
                </div>

                <ul className="mt-8 space-y-3 border-t border-stone-200 pt-6 text-sm text-stone-600">
                  <li className="flex items-center gap-3">
                    <Check size={15} className="text-[#9a7a1e]" /> Verified listing
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={15} className="text-[#9a7a1e]" /> In-person viewings arranged
                  </li>
                  {property.created_at && (
                    <li className="flex items-center gap-3">
                      <CalendarDays size={15} className="text-[#9a7a1e]" /> Listed{" "}
                      {new Date(property.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </li>
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* Similar listings */}
        {related.length > 0 && (
          <section className="border-t border-stone-200 bg-white !py-14 md:!py-20">
            <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
              <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
                    You may also like
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium md:text-5xl">
                    Similar <em className="text-[#9a7a1e]">properties</em>
                  </h2>
                </div>
                <Link
                  href="/explore"
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a7a1e]"
                >
                  View all listings →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                {related.map((p) => (
                  <Link key={p.id ?? p.slug} href={`/explore/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
                      <GalleryImage image={p.images?.[0]} alt={p.name} />
                    </div>
                    {p.location && (
                      <p className="mt-4 truncate text-[10px] uppercase tracking-[0.2em] text-stone-500">
                        {formatLocation(p.location)}
                      </p>
                    )}
                    <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-xl font-medium leading-snug transition-colors group-hover:text-[#9a7a1e]">
                      {p.name}
                    </h3>
                    <p className="mt-2 font-semibold">
                      {formatNumberShort(Number(p.rate)).replace("Rs", "PKR")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile enquiry bar */}
      <div
        data-mobile-enquiry-bar
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Asking price</p>
            <p className="truncate font-semibold">{formattedPrice}</p>
          </div>
          <a
            href={`tel:${PHONE}`}
            aria-label="Call advisor"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-300 text-[#1a1714]"
          >
            <Phone size={18} strokeWidth={1.75} />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#1a1714] px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white"
          >
            <MessageCircle size={16} strokeWidth={1.75} /> WhatsApp
          </a>
        </div>
      </div>

      {lightboxOpen && (
        <LightboxModal
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
        />
      )}
    </>
  );
}
