import Link from "next/link";
import React from "react";
import Icon from "./Icon";

type ProfileLinkProps = {
  iconName: "calendar-days" | "link" | "map-pin";
  href?: string;
  title: string;
};

const ProfileLink = ({ iconName, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Icon
        name={iconName}
        size={20}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />

      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-accent-blue"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
