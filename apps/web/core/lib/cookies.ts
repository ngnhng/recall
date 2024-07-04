export type SaveCookieOptions = {
  expires?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
};

export const saveLayout = (
  key: string,
  layout: any,
  options?: SaveCookieOptions
) => {
  if (typeof document === "undefined") {
    return;
  }

  const domain = document.location.hostname;

  document.cookie = `${key}=${JSON.stringify(layout)}; ${
    options?.expires ? `expires=${options.expires}; ` : ""
  }path=${options?.path || "/"}; domain=${options?.domain || domain}; ${
    options?.secure ? "secure; " : ""
  }SameSite=Lax`;
};
