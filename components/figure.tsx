import Image from "next/image";

interface FigureProps {
  src: string;
  alt?: string;
  caption?: string;
}

export function Figure({ src, alt = "", caption }: FigureProps) {
  return (
    <figure className="my-8 space-y-3 text-center">
      <div className="overflow-hidden rounded-3xl border border-border/60">
        <Image src={src} alt={alt} width={1200} height={720} className="h-auto w-full" />
      </div>
      {caption && <figcaption className="text-sm text-foreground/60">{caption}</figcaption>}
    </figure>
  );
}
