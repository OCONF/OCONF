'use strict';

import assert from 'assert';
// import hello from '../src/hello';

describe('hello.js', () => {
  xit('it should return "Hello, world!" when name is empty', () => {
    assert.equal('Hello, world!', hello());
  });

  xit('it should pass the name when it is passed', () => {
    assert.equal('Hello, username!', hello('username'));
  });
});
