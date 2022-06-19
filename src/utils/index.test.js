import '@testing-library/jest-dom';
import { getFullTime, hexToInt } from '.';

describe.only('Utils', () => {
  it('function getFullTime returns as expected', async () => {
    expect(getFullTime(1655474012)).toStrictEqual('17/6/2022 19:23:32');
  });

  it('function hexToInt returns as expected', async () => {
    expect(hexToInt(0x01ca35d2)).toStrictEqual(805474918);
  });
});
