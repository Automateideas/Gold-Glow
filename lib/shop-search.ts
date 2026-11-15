/**
 * The "Search" tab on phones opens the shop page with its search box focused.
 * These values are shared by the tab bar, the shop page and the shop client so they
 * cannot drift apart.
 */
export const SHOP_SEARCH_ID = "shop-search";
export const SHOP_SEARCH_PARAM = "search";
export const SHOP_SEARCH_HREF = `/shop?${SHOP_SEARCH_PARAM}=1`;

/**
 * iOS Safari only opens the keyboard for a focus() made during the tap itself. The tab
 * bar therefore focuses this throw-away input on tap; once the shop page has mounted, the
 * real search box takes the focus over and the proxy is removed.
 */
export const SEARCH_PROXY_ID = "gg-search-proxy";
