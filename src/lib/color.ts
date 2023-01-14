export const isValidHex = (color: string) => {
  var hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  return hexRegex.test(color);
};
