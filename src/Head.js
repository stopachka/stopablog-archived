// @flow

import React from 'react';
import NextHead from 'next/head';
import config from './config';

function Head() {
  return (
    <NextHead>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=block"
        rel="stylesheet"
      />
      <link rel="me" href="https://twitter.com/stopachka" />
      <meta charSet="utf-8" />
      <title>{config.title}</title>
      {config.description ? (
        <meta
          key="description"
          name="description"
          content={config.description}
        />
      ) : null}
      {config.description ? (
        <meta
          key="og:description"
          name="og:description"
          content={config.description}
        />
      ) : null}
      <meta charSet="utf-8" />
      <meta key="og:title" property="og:title" content={config.title} />
      <meta property="og:site_name" content={config.title} />
      <meta property="og:locale" content="en_US" />
      <meta key="type" property="og:type" content="website" />

      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/feed.rss"
      />
      <link
        rel="alternate"
        href="/feed.atom"
        title="Atom feed"
        type="application/atom+xml"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </NextHead>
  );
}

export default Head;
