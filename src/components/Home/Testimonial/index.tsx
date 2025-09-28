"use client";

import { testimonials } from "@/app/api/testimonial"; // ✅ import once
import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from "@/components/ui/ThreeDScrollTrigger";
import { Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";

const Card = ({
  name,
  company,
  image,
  feedback,
  className = "",
  style = {},
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

export default function Testimonials() {
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

      {/* Row 1 */}
      <div>
        <ThreeDScrollTriggerContainer>
          <ThreeDScrollTriggerRow baseVelocity={3} direction={1}>
            {testimonials.slice(0, 15).map((t, i) => (
              <div key={`row1-${i}`}>
                <Card
                  name={t.name}
                  company={t.position} // ✅ mapped correctly
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
      {/* <ThreeDScrollTriggerContainer>
        <ThreeDScrollTriggerRow baseVelocity={3} direction={-1}>
          {testimonials.slice(10, 20).map((t, i) => (
            <div key={`row2-${i}`}>
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
      </ThreeDScrollTriggerContainer> */}

      {/* Row 3 */}
      <div>
        <ThreeDScrollTriggerContainer>
          <ThreeDScrollTriggerRow baseVelocity={3} direction={1}>
            {testimonials.slice(15, 30).map((t, i) => (
              <div key={`row3-${i}`}>
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
  );
}
