import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends Omit<ImageProps, "className"> {
  className?: string;
  rounded?: boolean;
}

export function ResponsiveImage({ className, rounded = true, alt, ...props }: ResponsiveImageProps) {
  return (
    <div className={cn("relative overflow-hidden", rounded ? "rounded-3xl" : undefined, className)}>
      <Image
        alt={alt}
        fill
        sizes={props.sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="h-full w-full object-cover"
        {...props}
      />
    </div>
  );
}
