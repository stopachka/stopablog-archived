/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';

function Header({adminLinks}) {
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
        <h4 className="app-header-title" style={{margin: 0, fontWeight: 500}}>
          <Link href={'/'}>
            <a style={{color: 'inherit'}}>
              Stepan <span className="app-header-last-name">Parunashvili</span>
            </a>
          </Link>
          <a
            style={{paddingLeft: '10px'}}
            href="https://twitter.com/stopachka"
            target="_blank">
            Twitter
          </a>
          <a
            style={{paddingLeft: '10px'}}
            href="https://instantdb.dev"
            target="_blank">
            Instant
          </a>
          <a
            style={{paddingLeft: '10px'}}
            href="https://www.zeneca.io/stopa"
            target="_blank">
            Books
          </a>
          <a
            style={{paddingLeft: '10px'}}
            href="https://www.consistent.fit"
            target="_blank">
            Fitness
          </a>
        </h4>
      </header>
    </>
  );
}

export default Header;
