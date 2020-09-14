// @flow

import React from 'react';
import NextHead from 'next/head';
import config from './config';

function Head({title, imageUrl}: {title?: ?string, imageUrl?: ?string}) {
  const titleProp = title ? `${title} - ${config.title}` : config.title;
  return (
    <NextHead>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=UA-18190537-5"></script>
      <script>
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

         gtag('config', 'UA-18190537-5');`}
      </script>
      <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=block" rel="stylesheet" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      <meta name="description" content="Read essays by Stepan Parunashvili." />
      <meta
        property="og:description"
        content="Read essays by Stepan Parunashvili"
      />
      <meta key="title" property="og:title" content="Stepan Parunashvili" />
      <meta property="og:site_name" content="Stepan Parunashvili" />
      <meta key="type" property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <link rel="me" href="https://twitter.com/stopachka" />
      <meta charSet="utf-8" />
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
    </NextHead>
  );
}

export default Head;
