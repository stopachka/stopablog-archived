// @flow

import React from 'react';
import {useLazyLoadQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import Header from './Header';
import {editIssueUrl} from './issueUrls';
import {Github} from 'grommet-icons/icons/Github';
import Comments from './Comments';
import Post from './Post';
import ErrorBox from './ErrorBox';
import Head from 'next/head';
import config from './config';
import Attribution from './Attribution';
import {Heading} from 'grommet';
import type {
  PostRoot_PostQuery,
  PostRoot_PostQueryResponse,
} from './__generated__/PostRoot_PostQuery.graphql';

export const query = graphql`
  # repoName and repoOwner provided by fixedVariables
  query PostRoot_PostQuery(
    $issueNumber: Int!
    $repoName: String!
    $repoOwner: String!
  )
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
      freeVariables: ["issueNumber"]
      cacheSeconds: 300
    ) {
    gitHub {
      viewer {
        login
        name
        avatarUrl(size: 96)
        url
      }
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        issue(number: $issueNumber) {
          labels(first: 100) {
            nodes {
              name
            }
          }
          title
          id
          number
          body
          ...Post_post
          ...Comments_post
        }
      }
    }
  }
`;

export const PostRoot = ({issueNumber}: {issueNumber: number}) => {
  const data: ?PostRoot_PostQueryResponse = useLazyLoadQuery<PostRoot_PostQuery>(
    query,
    {issueNumber},
    {fetchPolicy: 'store-and-network'},
  );

  if (!data) {
    return null;
  }

  const post = data?.gitHub?.repository?.issue;
  const labels = post?.labels?.nodes;
  const gitHub = data?.gitHub;
  if (
    !gitHub ||
    !post ||
    !labels ||
    !labels.find(l => l && l.name.toLowerCase() === 'publish')
  ) {
    return <ErrorBox error={new Error('Missing post.')} />;
  } else {
    return (
      <>
        <Head>
          <title>{post.title}</title>
          <meta name="description" content={post.body.slice(0, 250)} />
          <meta property="og:description" content={post.body.slice(0, 250)} />
          <meta key="title" property="og:title" content={post.title} />
          <meta key="type" property="og:type" content="article" />
          <meta property="article:author" content="Stepan Parunashvili" />
          <meta
            property="og:image"
            content={`${config.siteHostname}/api/og-image/${post.number}`}
          />
          <link rel="me" href="https://twitter.com/stopachka" />
        </Head>
        <Header
          gitHub={gitHub}
          adminLinks={[
            {
              label: 'Edit post',
              href: editIssueUrl({issueNumber: post.number}),
              icon: <Github size="16px" />,
            },
          ]}
        />
        <div className="layout">
          <Post context="details" post={post} />
          <hr color="lightgrey" />
          <Heading
            level={4}
            style={{
              fontWeight: 'normal',
              color: 'rgb(37, 37, 37)',
              textAlign: 'center',
              maxWidth: 'none',
            }}>
            <em>
              Thoughts? Reach out to me via{' '}
              <a href="https://twitter.com/stopachka" target="_blank">
                twitter
              </a>{' '}
              or email : )
            </em>
          </Heading>

          <Attribution />
        </div>
      </>
    );
  }
};
