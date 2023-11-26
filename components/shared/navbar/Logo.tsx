import Link from "next/link";
import React from "react";
import Image from "next/image";

type LogoProps = {
  isMobile?: boolean;
  isNavbar?: boolean;
};

const Logo: React.FC<LogoProps> = ({ isMobile = false, isNavbar = false }) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/devtrovex.svg"
        width={32}
        height={32}
        alt="DevTroveX"
        className="mr-1"
      />
      <p
        className={`h2-bold text-dark100_light900 font-spaceGrotesk ${
          !isNavbar && !isMobile && "max-lg:hidden"
        }`}
      >
        Dev<span className="text-primary-500">Trove</span>X
      </p>
    </Link>
  );
};

export default Logo;
