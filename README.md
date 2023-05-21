# text-matcher

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/shhhplus/text-matcher/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@shhhplus/text-matcher.svg?style=flat)](https://www.npmjs.com/package/@shhhplus/text-matcher) [![codecov](https://img.shields.io/codecov/c/github/shhhplus/text-matcher/main?token=MPV0GHAKL9)](https://codecov.io/gh/shhhplus/text-matcher) [![build status](https://img.shields.io/github/actions/workflow/status/shhhplus/text-matcher/cd.yml)](https://github.com/shhhplus/text-matcher/actions)

This tool can use specified rules to match text. If you want to use it in React, you can consider choosing [@shhhplus/react-text-matcher](https://www.npmjs.com/package/@shhhplus/react-text-matcher).

## Install

```sh
npm install @shhhplus/text-matcher --save
```

## Usage

### Basic

```js
import createTextMatcher from '@shhhplus/text-matcher';

const rules = ['everyone', 'birthday'];
const tm = createTextMatcher(rules);
const result = tm.exec('Welcome everyone to come and join my birthday party.');

// result:
[
  'Welcome ',
  {
    text: 'everyone',
    payload: { position: 8, ruleIndex: 0, matchIndex: 0 },
  },
  ' to come and join my ',
  {
    text: 'birthday',
    payload: { position: 37, ruleIndex: 1, matchIndex: 1 },
  },
  ' party.',
];
```

### RegExp

```js
import createTextMatcher from '@shhhplus/text-matcher';

const rules = [new RegExp('apple', 'gi'), new RegExp('food')];
const tm = createTextMatcher(rules);
const result = tm.exec('apple_sun_banana_Apple_sun_food_sun');

// result:
[
  {
    text: 'apple',
    payload: { position: 0, ruleIndex: 0, matchIndex: 0 },
  },
  '_sun_banana_',
  {
    text: 'Apple',
    payload: { position: 17, ruleIndex: 0, matchIndex: 1 },
  },
  '_sun_',
  {
    text: 'food',
    payload: { position: 27, ruleIndex: 1, matchIndex: 2 },
  },
  '_sun',
];
```
