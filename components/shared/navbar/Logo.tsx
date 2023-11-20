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
        src="/assets/images/devtrovex.svg"
        width={40}
        height={40}
        alt="DevTroveX"
        className="mr-1"
      />
      <p
        className={`h1-bold text-dark100_light900 font-spaceGrotesk ${
          !isMobile && "max-sm:hidden"
        }`}
      >
        Dev<span className="text-primary-500">Trove</span>X
      </p>
    </Link>
  );
};

export default Logo;
