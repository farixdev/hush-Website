import Image from "next/image";

/** The Hush app icon rendered as a rounded tile. */
export default function HushMark({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[24%] bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/hush-icon.png"
        alt="Hush"
        width={size}
        height={size}
        priority
      />
    </span>
  );
}
