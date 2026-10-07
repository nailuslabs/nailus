export function hex2RGB(hex: string): number[] | undefined {
  const rgbHex = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;
  const [, short, long] = String(hex).match(rgbHex) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    return [value >> 16, (value >> 8) & 0xff, value & 0xff];
  }

  if (short) {
    return Array.from(short, digit => Number.parseInt(digit, 16)).map(
      value => (value << 4) | value
    );
  }
}