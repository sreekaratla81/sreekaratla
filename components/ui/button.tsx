import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: Variant;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground px-4 py-2 shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  ghost: "px-3 py-2 hover:bg-muted",
  outline:
    "border border-border bg-transparent px-4 py-2 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
};

type ChildWithClassName = { className?: string };

type ChildWithOptionalRef = ChildWithClassName & { ref?: React.Ref<HTMLButtonElement> };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, children, type, ...props }, ref) => {
    const mergedClassName = cn(baseStyles, variants[variant], className);

    if (asChild && React.isValidElement(children)) {
      const child = React.Children.only(children) as React.ReactElement<ChildWithOptionalRef>;
      return React.cloneElement(child, {
        ...props,
        className: cn(mergedClassName, child.props.className)
      });
    }

    const buttonType = type ?? "button";

    return (
      <button ref={ref} className={mergedClassName} type={buttonType} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
