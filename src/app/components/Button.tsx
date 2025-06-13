import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
};

export default function Button({ href, children, className = "", ...props }: Props) {
  const base =
    "inline-flex items-center rounded bg-orange-600 text-white px-4 py-2 text-sm font-medium hover:bg-orange-700";
  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
