const OurStory = () => {
  return (
    <section className="border-y border-stone-200 bg-white !py-14 md:!py-20">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
          Our Philosophy
        </p>

        <blockquote className="max-w-5xl font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.15] md:text-6xl">
          &ldquo;We believe real estate should be{" "}
          <em className="text-[#9a7a1e]">simple, secure</em> and{" "}
          <em className="text-[#9a7a1e]">transparent</em>.&rdquo;
        </blockquote>

        <div className="mt-10 grid gap-10 text-stone-600 md:grid-cols-2 md:gap-16 md:text-lg md:leading-relaxed">
          <p>
            Our mission is to bring trust and clarity back into real estate by
            connecting serious buyers and sellers through honest, verified and
            transparent deals.
          </p>
          <p>
            From luxury villas and apartments to high-return commercial plots,
            we handle every transaction with professionalism and integrity —
            where every deal is genuine, and every listing is verified.
          </p>
        </div>

        <div className="mt-14 grid border-t border-stone-200 md:grid-cols-2">
          {[
            {
              label: "Our Mission",
              text: "To provide real estate services that exceed expectations — creating lasting value for our clients through expert guidance and unwavering integrity in every transaction.",
            },
            {
              label: "Our Vision",
              text: "To set the standard for luxury real estate in Islamabad, transforming how people experience buying, selling and investing in property.",
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`pt-10 md:pb-2 ${i === 0 ? "md:pr-16" : "border-stone-200 max-md:mt-10 max-md:border-t md:border-l md:pl-16"}`}
            >
              <span className="font-[family-name:var(--font-display)] text-lg italic text-[#9a7a1e]">
                0{i + 1}
              </span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
                {item.label}
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-stone-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStory;
