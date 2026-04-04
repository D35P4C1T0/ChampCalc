export const APP_SHARE_MESSAGE =
  "Try EV Master to convert your Showdown stats to Champions!";

export const APP_DOWNLOAD_URL: string | null = null;

export const CREATOR_GITHUB_HANDLE = "D35P4C1T0";
export const CREATOR_GITHUB_URL = "https://github.com/D35P4C1T0";

const allowedDonationHosts = new Set([
  "paypal.com",
  "www.paypal.com",
  "paypal.me",
  "www.paypal.me",
]);

export const DONATION_URL = readOptionalUrl(process.env.PAYPAL_URL);

function readOptionalUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return null;
    }

    if (!allowedDonationHosts.has(url.hostname)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
