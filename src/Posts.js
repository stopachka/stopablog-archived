/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {createPaginationContainer, type RelayPaginationProp} from 'react-relay';
import type {Posts_repository} from './__generated__/Posts_repository.graphql';
import {Box, Heading} from 'grommet';
import {useInView} from 'react-intersection-observer';
import config from './config';
import 'intersection-observer';
import Link from 'next/link';


type Props = {|
  relay: RelayPaginationProp,
  repository: Posts_repository,
|};

// TODO: pagination. Can do pages or infinite scroll
const Posts = ({relay, repository}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [inViewRef, inView] = useInView({threshold: 0});

  React.useEffect(() => {
    if (inView && !isLoading && !relay.isLoading() && relay.hasMore()) {
      setIsLoading(true);
      relay.loadMore(60, x => {
        setIsLoading(false);
      });
    }
  }, [relay, isLoading, setIsLoading, inView]);

  const issues = [];
  for (const edge of repository.issues.edges || []) {
    if (edge && edge.node) {
      issues.push(edge.node);
    }
  }

  return (
    <Box>
      {issues.map((post, i) => {
        return (
          <div
            key={post.number}
            className="post"
            ref={!isLoading && i === issues.length - 1 ? inViewRef : null}>
            <h4
              style={{
                padding: '0 20px',
                paddingBottom: '20px',
                fontWeight: 'normal',
                margin: 0,
              }}>
              <Link href="/post/[...slug]" as={`/post/${post.number}`}>
                <a style={{textDecoration: 'underline'}}>{post.title}</a>
              </Link>
            </h4>
          </div>
        );
      })}
      {isLoading ? (
        <Box margin={{left: 'medium'}}>
          <Heading level={4} style={{fontWeight: 'normal'}}>
            <em>Loading...</em>
          </Heading>
        </Box>
      ) : null}
    </Box>
  );
};

export default createPaginationContainer(
  Posts,
  {
    repository: graphql`
      fragment Posts_repository on GitHubRepository
      @argumentDefinitions(
        count: {type: "Int", defaultValue: 50}
        cursor: {type: "String"}
        orderBy: {
          type: "GitHubIssueOrder"
          defaultValue: {direction: DESC, field: CREATED_AT}
        }
      ) {
        issues(
          first: $count
          after: $cursor
          orderBy: $orderBy
          labels: ["publish", "Publish"]
        ) @connection(key: "Posts_posts_issues") {
          isClientFetched @__clientField(handle: "isClientFetched")
          edges {
            node {
              id
              title
              number
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.repository && props.repository.issues;
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count: count,
        cursor,
        orderBy: fragmentVariables.orderBy,
      };
    },

    query: graphql`
      # repoName and repoOwner provided by fixedVariables
      query PostsPaginationQuery(
        $count: Int!
        $cursor: String
        $orderBy: GitHubIssueOrder
        $repoOwner: String!
        $repoName: String!
      )
      @persistedQueryConfiguration(
        accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
        freeVariables: ["count", "cursor", "orderBy"]
        fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
        cacheSeconds: 300
      ) {
        gitHub {
          repository(name: $repoName, owner: $repoOwner) {
            __typename
            ...Posts_repository
              @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
          }
        }
      }
    `,
  },
);
