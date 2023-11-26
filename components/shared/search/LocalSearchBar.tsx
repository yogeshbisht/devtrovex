"use client";

import React, { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

type LocalSearchBarProps = {
  route: string;
  iconPosition: string;
  placeholder: string;
  otherClasses: string;
};

const LocalSearchBar = ({
  route,
  iconPosition,
  placeholder,
  otherClasses,
}: LocalSearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div className={`search-bar ${otherClasses}`}>
      {iconPosition === "left" && <SearchIcon size={24} />}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {iconPosition === "right" && <SearchIcon size={20} />}
    </div>
  );
};

export default LocalSearchBar;
