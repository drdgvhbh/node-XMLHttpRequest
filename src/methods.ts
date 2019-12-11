const forbiddenMethods = new Set([`CONNECT`, `TRACE`, `TRACK`]);
const methods = new Set([
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'POST',
  'PUT',
  ...forbiddenMethods,
]);

export const normalize = (method: string): string => method.toUpperCase();

export const isValid = (method: string): boolean =>
  methods.has(normalize(method));
