import qs from "query-string";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPluralString(num: number, str: string) {
  return num > 1 ? `${str}s` : str;
}

export const getTimestamp = (createdAt: string | Date) => {
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * month;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const createdDate = new Date(createdAt);
  const createdDay = createdDate.getDate();
  const createdMonth = createdDate.getMonth();
  const createdYear = createdDate.getFullYear();
  const timeDifferent = now.getTime() - createdDate.getTime();

  if (timeDifferent < minute) {
    return "less a minute";
  } else if (timeDifferent < hour) {
    const minutes = Math.round(timeDifferent / minute);
    return `${minutes} ${getPluralString(minutes, "minute")} ago`;
  } else if (timeDifferent > hour && timeDifferent < day) {
    const hours = Math.round(timeDifferent / hour);
    return `${hours} ${getPluralString(hours, "hour")} ago`;
  } else if (timeDifferent > day && timeDifferent < week) {
    const days = Math.round(timeDifferent / day);
    return `${days} ${getPluralString(days, "day")} ago`;
  } else if (timeDifferent > week && timeDifferent < month) {
    const weeks = Math.round(timeDifferent / week);
    return `${weeks} ${getPluralString(weeks, "week")} ago`;
  } else if (timeDifferent > month && timeDifferent < year) {
    return `${months[createdMonth]} ${createdDay}`;
  } else {
    return `${createdDay} ${months[createdMonth]} ${createdYear}`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (!num) return "0";
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = ({ criteria }: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
