import { usePageContext } from "vike-react/usePageContext";
import React from "react";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className = "" }: LinkProps) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  const classes = [className, isActive ? "is-active" : ""].filter(Boolean).join(" ");
  
  return (
    <a href={href} className={classes || undefined}>
      {children}
    </a>
  );
}
