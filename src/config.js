// @flow

export type Config = {
  repoName: string,
  repoOwner: string,
  appId: string,
  title: string,
  description: ?string,
  defaultLogin: ?string,
  siteHostname: string,
  gaTrackingId: ?string,
  vercelUrl: ?string,
  codeTheme: string,
  postMarginPx: string,
};

function ensureEnv(s, variable: string): string {
  if (!s) {
    throw new Error(`Expected environment variable \`${variable}\` to be set.`);
  }
  return s;
}

function removeTrailingSlash(s: ?string): string {
  if (!s) {
    return '';
  }
  if (s[s.length - 1] === '/') {
    return s.substr(0, s.length - 1);
  }
  return s;
}

if (
  !process.env.NEXT_PUBLIC_SITE_HOSTNAME &&
  process.env.NODE_ENV === 'production'
) {
  console.warn(
    'Missing NEXT_PUBLIC_SITE_HOSTNAME environment variable. OpenGraph preview images will be disabled.',
  );
}

const config: Config = {
  // Owner of the repo that OneBlog should pull issues from
  repoOwner: ensureEnv(
    process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER,
    'NEXT_PUBLIC_GITHUB_REPO_OWNER',
  ),
  // Name of the repo that OneBlog should pull issues from
  repoName: ensureEnv(
    process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
    'NEXT_PUBLIC_GITHUB_REPO_NAME',
  ),
  title: 'Stepan Parunashvili',
  description: 'Read essays by Stepan Parunashvili',
  defaultLogin: process.env.NEXT_PUBLIC_DEFAULT_GITHUB_LOGIN,
  siteHostname: 'https://stopa.io',
  hideAttribution: process.env.NEXT_PUBLIC_HIDE_ATTRIBUTION,
  gaTrackingId: 'UA-18190537-5',
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL
    ? removeTrailingSlash(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`)
    : null,
  codeTheme: process.env.NEXT_PUBLIC_CODE_THEME || 'tomorrow-night-blue',
  postMarginPx: 12,
};

export default config;
