/** Public website address (no trailing slash). Set NEXT_PUBLIC_SITE_URL to the real domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://goldandglow.in").replace(
  /\/+$/,
  ""
);

/** Absolute URL for a site path or an already-absolute URL. */
export const absoluteUrl = (pathOrUrl: string) =>
  /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
