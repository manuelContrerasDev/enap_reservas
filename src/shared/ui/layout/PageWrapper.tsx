import React from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        w-full max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8
        animate-fadeIn
      "
    >
      {children}
    </section>
  );
}
