"use client";

import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from "@/components/ui/ThreeDScrollTrigger";
import { Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  review: string;
  image: string;
}

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

const Card = ({
  name,
  company,
  image,
  feedback,
  className = "",
  style = {},
}: {
  name: string;
  company: string;
  image: string;
  feedback: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={`bg-slate-50 dark:bg-neutral-900  p-6 max-w-md m-2 transition-colors shrink-0 h-52 rounded-2xl ${className}`}
      style={style}
    >
      <div className="flex items-center">
        <Avatar src={image} />
        <div className="ml-4">
          <h3 className="font-semibold text-black dark:text-white text-sm">
            {name}
          </h3>
          <p className="text-gray-800 dark:text-gray-400 text-xs">{company}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-200 text-wrap text-sm mt-3 leading-relaxed max-w-sm">
        {feedback}
      </p>
    </div>
  );
};

export default function TestimonialsClient({
  testimonials,
}: TestimonialsClientProps) {
  return (
    <>
      <div className="mb-16 flex flex-col gap-3 ">
        <div className="flex gap-2.5 items-center justify-center">
          <span>
            <Icon
              icon={"ph:chat-circle-text-fill"}
              width={20}
              height={20}
              className="text-primary"
            />
          </span>
          <p className="text-base font-semibold text-dark/75 dark:text-white/75">
            Testimonials
          </p>
        </div>
        <h2 className="text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2">
          What our happy clients say about us
        </h2>
        <p className="text-xm font-normal text-black/50 dark:text-white/50 text-center">
          Real stories from homeowners and investors who found their perfect
          property with us.
        </p>
      </div>

      {testimonials.length > 0 ? (
        <>
          {/* Row 1 */}
          <div>
            <ThreeDScrollTriggerContainer>
              <ThreeDScrollTriggerRow baseVelocity={3} direction={1}>
                {testimonials
                  .slice(0, Math.ceil(testimonials.length / 2))
                  .map((t) => (
                    <div key={`row1-${t.id}`}>
                      <Card
                        name={t.name}
                        company={t.position}
                        image={t.image}
                        feedback={t.review}
                        className="inline-block"
                      />
                    </div>
                  ))}
              </ThreeDScrollTriggerRow>
            </ThreeDScrollTriggerContainer>
          </div>

          {/* Row 2 */}
          <div>
            <ThreeDScrollTriggerContainer>
              <ThreeDScrollTriggerRow baseVelocity={3} direction={1}>
                {testimonials
                  .slice(Math.ceil(testimonials.length / 2))
                  .map((t) => (
                    <div key={`row2-${t.id}`}>
                      <Card
                        name={t.name}
                        company={t.position}
                        image={t.image}
                        feedback={t.review}
                        className="inline-block"
                      />
                    </div>
                  ))}
              </ThreeDScrollTriggerRow>
            </ThreeDScrollTriggerContainer>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials available yet.
          </p>
        </div>
      )}
    </>
  );
}
