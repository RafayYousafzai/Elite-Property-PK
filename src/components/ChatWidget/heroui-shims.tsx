import React from "react";
export { Button, Input, Spinner, Skeleton, Card, ScrollShadow, Avatar } from "@heroui/react";

export const Surface = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: string }
>(({ className = "", variant, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});
Surface.displayName = "Surface";

export const Text = {
  Heading: React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
  >(({ className = "", children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={className} {...props}>
        {children}
      </h3>
    );
  }),
};
