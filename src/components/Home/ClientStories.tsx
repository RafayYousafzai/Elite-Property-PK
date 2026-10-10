import { createStaticClient } from "@/utils/supabase/static";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  review: string;
  image: string;
}

const Avatar = ({ t, size }: { t: Testimonial; size: string }) =>
  t.image ? (
    <img
      src={t.image}
      alt={t.name}
      loading="lazy"
      decoding="async"
      className={`${size} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#faf8f3] font-[family-name:var(--font-display)] text-lg text-[#9a7a1e]`}
    >
      {t.name.charAt(0)}
    </span>
  );

// Stretch the last card so an incomplete final row never leaves an empty cell
const lastSpan = (n: number) =>
  [
    n % 2 === 1 ? "md:col-span-2" : "",
    n % 3 === 1 ? "lg:col-span-3" : n % 3 === 2 ? "lg:col-span-2" : "lg:col-span-1",
  ].join(" ");

export default async function ClientStories() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id,name,position,review,image")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const stories = ((data || []) as Testimonial[]).map((t) => ({
    ...t,
    review: t.review.trim(),
  }));
  if (stories.length === 0) return null;
  const [lead, ...rest] = stories;

  return (
    <section className="border-y border-stone-200 bg-white !py-14 md:!py-20">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
          Client Stories
        </p>

        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-[family-name:var(--font-display)] text-3xl font-medium leading-snug md:text-5xl">
            <span className="text-[#9a7a1e]">&ldquo;</span>
            {lead.review}
            <span className="text-[#9a7a1e]">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-10 flex items-center justify-center gap-4">
            <Avatar t={lead} size="h-12 w-12" />
            <span className="text-left">
              <span className="block font-semibold">{lead.name}</span>
              <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
                {lead.position}
              </span>
            </span>
          </figcaption>
        </figure>

        {rest.length > 0 && (
          <div className="mt-12 grid gap-px border-y border-stone-200 bg-stone-200 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((t, i) => (
              <figure
                key={t.id}
                className={`flex flex-col justify-between bg-white px-1 py-10 md:px-8 ${
                  i === rest.length - 1 ? lastSpan(rest.length) : ""
                }`}
              >
                <blockquote className="leading-relaxed text-stone-600">
                  &ldquo;{t.review}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <Avatar t={t} size="h-10 w-10" />
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      {t.position}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
