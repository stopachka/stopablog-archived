/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {Box, Heading} from 'grommet';
import Avatar from './Avatar';
import Link from 'next/link';
import config from './config';
import {PostBox} from './Post';

function Header({gitHub, adminLinks}) {
  return (
    <>
      <header
        className="app-header-container"
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'baseline',
          padding: '20px',
        }}>
        <h4
          className="app-header-title"
          style={{paddingRight: '10px', margin: 0, fontWeight: 500}}>
          <Link href={'/'}>
            <a style={{color: 'inherit'}}>Stepan Parunashvili</a>
          </Link>
          <a
            style={{paddingLeft: '1em'}}
            href="https://twitter.com/stopachka"
            target="_blank">
            Twitter
          </a>
        </h4>
      </header>
    </>
  );
}

export default Header;
