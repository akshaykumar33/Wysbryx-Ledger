import { TourStep, ElementRect } from "./types";

export function isRouteMatch(currentPathname: string, stepRoute?: string): boolean {
  if (!stepRoute) return true;
  if (stepRoute === "/") {
    return currentPathname === "/";
  }
  return currentPathname === stepRoute || currentPathname.startsWith(stepRoute);
}

export function getElementRect(element: HTMLElement): ElementRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom,
  };
}

export async function waitForTargetElement(
  selector: string,
  timeoutMs: number = 2500
): Promise<HTMLElement | null> {
  if (typeof window === "undefined" || !selector || selector === "center") {
    return null;
  }

  const existing = document.querySelector(selector) as HTMLElement | null;
  if (existing && isElementVisible(existing)) {
    return existing;
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el && isElementVisible(el)) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - startTime >= timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
}

export function isElementVisible(el: HTMLElement): boolean {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export function scrollElementIntoViewIfNeeded(el: HTMLElement): void {
  if (!el || typeof window === "undefined") return;
  const rect = el.getBoundingClientRect();
  const isInViewport =
    rect.top >= 80 &&
    rect.left >= 10 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 80 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) - 10;

  if (!isInViewport) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
}
