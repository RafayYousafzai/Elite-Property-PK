import { Clock, MapPin, MessageCircle, Navigation, Phone, Plus } from "lucide-react";

const faqs = [
  {
    q: "Are all your listings verified?",
    a: "Yes. Every property is checked for ownership and documentation before we publish it, and our advisors inspect listings in person — so what you see is what you get.",
  },
  {
    q: "Can I buy in DHA Islamabad while living abroad?",
    a: "Absolutely — many of our clients are overseas Pakistanis. We arrange live video viewings, share documents digitally and guide you through the transfer, whether you complete it in person or through an authorised representative.",
  },
  {
    q: "What documents will I need?",
    a: "Usually your CNIC (or NICOP if you live abroad) and photographs. Requirements can vary by transaction, so your advisor will confirm the exact list DHA needs before you begin.",
  },
  {
    q: "How does the transfer process work?",
    a: "Once a price is agreed, a token payment secures the property, outstanding dues are cleared, and buyer and seller complete the transfer at the DHA office. We coordinate every step so nothing is missed.",
  },
  {
    q: "Do you help sellers as well?",
    a: "Yes. We provide a realistic valuation, market your property with professional photos and video tours, and bring you serious, screened buyers.",
  },
];

const office = {
  address: "2nd Floor, Plaza No. 19, Tipu Boulevard, Sector G, DHA Phase II, Islamabad",
  phone: "+92 334 4111778",
  tel: "+923344111778",
  hours: "Monday – Sunday, 9:00 AM – 7:00 PM",
  directions: "https://www.google.com/maps/dir/?api=1&destination=33.535113,73.170038",
  map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.7026272595363!2d73.16746392552783!3d33.53511641307411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfed8930128de7%3A0x4b866d1a81e61490!2sElite%20Property%20Exchange!5e0!3m2!1sen!2s!4v1759570688102!5m2!1sen!2s",
};

const VisitAndFAQ = () => {
  return (
    <section className="!py-24 md:!py-32">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* FAQ */}
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Questions
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Good to <em className="text-[#9a7a1e]">know</em>
            </h2>

            <div className="mt-12 border-t border-stone-300">
              {faqs.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group border-b border-stone-200 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium transition-colors hover:text-[#9a7a1e]">
                    {f.q}
                    <Plus
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 text-[#9a7a1e] transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="-mt-1 pb-6 pr-10 leading-relaxed text-stone-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Visit */}
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Visit us
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Meet us in <em className="text-[#9a7a1e]">person</em>
            </h2>

            <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
              <iframe
                src={office.map}
                title="Elite Property Exchange office on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
              />
            </div>

            <ul className="mt-8 space-y-4 text-stone-700">
              <li className="flex gap-4">
                <MapPin size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
                {office.address}
              </li>
              <li className="flex gap-4">
                <Clock size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
                {office.hours}
              </li>
              <li className="flex gap-4">
                <Phone size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
                <a href={`tel:${office.tel}`} className="transition-colors hover:text-[#9a7a1e]">
                  {office.phone}
                </a>
              </li>
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${office.tel.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a1714] px-7 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
              >
                <MessageCircle size={16} /> WhatsApp us
              </a>
              <a
                href={office.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stone-300 px-7 text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
              >
                <Navigation size={16} /> Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitAndFAQ;
