import createTextMatcher from './index';

describe('TextMatcher', () => {
  test('empty content should works', () => {
    expect(createTextMatcher(['']).exec('')).toMatchObject([]);
  });

  test('empty rules should works', () => {
    const content = 'Welcome to my party';
    expect(createTextMatcher([]).exec(content)).toMatchObject([content]);
  });

  test('empty content and empty rules should works', () => {
    expect(createTextMatcher([]).exec('')).toMatchObject([]);
  });

  test('no matched word should works', () => {
    const content = 'Welcome to my birthday party.';
    expect(createTextMatcher(['tom']).exec(content)).toMatchObject([content]);
  });

  test('a single matched word should works', () => {
    const content = 'Welcome to my birthday party.';

    expect(createTextMatcher(['party']).exec(content)).toMatchObject([
      'Welcome to my birthday ',
      { text: 'party' },
      '.',
    ]);
  });

  test(`multiple matched words should works`, () => {
    const content = 'hi, party time. Welcome to my birthday party.';

    expect(createTextMatcher(['party']).exec(content)).toMatchObject([
      'hi, ',
      { text: 'party' },
      ' time. Welcome to my birthday ',
      { text: 'party' },
      '.',
    ]);
  });

  test('matched word at begin should works', () => {
    const content = 'party. Welcome everyone.';

    expect(createTextMatcher(['party']).exec(content)).toMatchObject([
      { text: 'party' },
      '. Welcome everyone.',
    ]);
  });

  test('matched word at end should works', () => {
    const content = 'Welcome to my party';

    expect(createTextMatcher(['party']).exec(content)).toMatchObject([
      'Welcome to my ',
      { text: 'party' },
    ]);
  });

  test('single rule with regex should works', () => {
    const content = 'apple_banana_Apple_sun_food';

    expect(createTextMatcher([/apple/]).exec(content)).toMatchObject([
      { text: 'apple' },
      '_banana_Apple_sun_food',
    ]);

    expect(createTextMatcher([/Apple/]).exec(content)).toMatchObject([
      'apple_banana_',
      { text: 'Apple' },
      '_sun_food',
    ]);

    expect(createTextMatcher([/(Apple)|(apple)/g]).exec(content)).toMatchObject(
      [{ text: 'apple' }, '_banana_', { text: 'Apple' }, '_sun_food'],
    );

    expect(createTextMatcher([/apple/gi]).exec(content)).toMatchObject([
      { text: 'apple' },
      '_banana_',
      { text: 'Apple' },
      '_sun_food',
    ]);
  });

  test('multiple rules with regex should works', () => {
    const content = 'apple_sun_banana_Apple_sun_food_sun';
    const tm = createTextMatcher([
      new RegExp('apple', 'gi'),
      new RegExp('sun'),
    ]);

    expect(tm.exec(content)).toMatchObject([
      { text: 'apple' },
      '_',
      { text: 'sun' },
      '_banana_',
      { text: 'Apple' },
      '_sun_food_sun',
    ]);
  });

  test('multiple rules as props should works', () => {
    const content = 'Welcome to my party';

    expect(createTextMatcher(['party', 'to']).exec(content)).toMatchObject([
      'Welcome ',
      { text: 'to' },
      ' my ',
      { text: 'party' },
    ]);

    expect(createTextMatcher(['party', 'other']).exec(content)).toMatchObject([
      'Welcome to my ',
      { text: 'party' },
    ]);
  });

  test('payload should works', () => {
    const content = 'apple_sun_banana_Apple_sun_food_sun';
    const tm = createTextMatcher([
      new RegExp('apple', 'gi'),
      new RegExp('sun'),
    ]);

    expect(tm.exec(content)).toMatchObject([
      {
        text: 'apple',
        payload: { index: 0, position: 0 },
      },
      '_',
      {
        text: 'sun',
        payload: { index: 1, position: 6 },
      },
      '_banana_',
      {
        text: 'Apple',
        payload: { index: 2, position: 17 },
      },
      '_sun_food_sun',
    ]);
  });
});
