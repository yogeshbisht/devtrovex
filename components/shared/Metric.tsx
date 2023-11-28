import React from "react";
import Link from "next/link";
import Icon from "./Icon";

interface MetricProps {
  iconName: "eye" | "message-circle" | "thumbs-up";
  value: string | number;
  title?: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  iconName,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Icon
        name={iconName}
        size={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        {title && (
          <span
            className={`small-regular line-clamp-1 ${
              isAuthor ? "max-sm:hidden" : ""
            }`}
          >
            {title}
          </span>
        )}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
