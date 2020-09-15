/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {createPaginationContainer, type RelayPaginationProp} from 'react-relay';
import type {Posts_repository} from './__generated__/Posts_repository.graphql';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import Link from 'next/link';
import nullthrows from 'fbjs/lib/nullthrows';

type Props = {|
  relay: RelayPaginationProp,
  repository: Posts_repository,
|};

// TODO: pagination. Can do pages or infinite scroll
const Posts = ({relay, repository}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const scheduledRef = React.useRef(false);
  const handleScroll = React.useCallback(() => {
    if (!scheduledRef.current) {
      scheduledRef.current = true;
      window.requestAnimationFrame(() => {
        scheduledRef.current = false;
        if (
          window.innerHeight + (document.documentElement?.scrollTop ?? 0) >=
          (document.documentElement?.offsetHeight || 0) - 500
        ) {
          if (!isLoading && !relay.isLoading() && relay.hasMore()) {
            setIsLoading(true);
            relay.loadMore(10, x => {
              setIsLoading(false);
            });
          }
        }
      });
    }
  }, [relay, isLoading, setIsLoading]);
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const issues = repository.issues.edges || [];

  return (
    <>
      <Box>
        {issues
          .map(e => e && e.node)
          .filter(x => x)
          .map(node => {
            const post = nullthrows(node);
            return (
              <div key={post.number} className="post">
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
    </>
  );
};

export default createPaginationContainer(
  Posts,
  {
    repository: graphql`
      fragment Posts_repository on GitHubRepository
        @argumentDefinitions(
          count: {type: "Int", defaultValue: 60}
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
