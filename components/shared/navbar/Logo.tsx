import Link from "next/link";
import React from "react";
import Image from "next/image";

type LogoProps = {
  isMobile?: boolean;
};

const Logo: React.FC<LogoProps> = ({ isMobile = false }) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/site-logo.svg"
        width={23}
        height={23}
        alt="DevTroveX"
      />
      <p
        className={`h2-bold text-dark100_light900 font-spaceGrotesk ${
          !isMobile && "max-sm:hidden"
        }`}
      >
        Dev<span className="text-primary-500">Trove</span>X
      </p>
    </Link>
  );
};

export default Logo;
