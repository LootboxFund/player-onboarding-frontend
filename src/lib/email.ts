export const isValidEmail = (email: string) => {
  // Regular expression to match most valid email addresses
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const formatEmail = (email: string) => email.toLowerCase().trim();

export const truncateEmail = (email: string) => {
  //   return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c)
  return email.replace(/^(.)(.*)(.@.*)$/, (_, a, _b, c) => a + "*****" + c);
};
