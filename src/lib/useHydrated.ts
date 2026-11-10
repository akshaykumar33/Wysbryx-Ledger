"use client";

import { useEffect, useState } from "react";

// True once the component has mounted in the browser. Use it to delay
// rendering data that only exists in localStorage, so the server render and
// the first client render match.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
