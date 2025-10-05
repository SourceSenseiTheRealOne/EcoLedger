/**
 * Format address to human readable format
 * @param address - the address
 * @param lengthBefore - (optional, default 4) the characters to show before the dots
 * @param lengthAfter - (optional, default 4) the characters to show after the dots
 * @returns the formatted address
 */
export const humanAddress = (
  address: string,
  lengthBefore = 4,
  lengthAfter = 4,
) => {
  if (!address || address.length < lengthBefore + lengthAfter) {
    return address;
  }
  
  const before = address.substring(0, lengthBefore);
  const after = address.substring(address.length - lengthAfter);
  return `${before}…${after}`;
};


