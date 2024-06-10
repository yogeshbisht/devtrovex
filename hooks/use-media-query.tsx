import { useState, useEffect } from "react";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setMatches(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
