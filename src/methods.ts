const forbiddenMethods: ReadonlySet<string> = new Set([
  `CONNECT`,
  `TRACE`,
  `TRACK`,
]);
const methods: ReadonlySet<string> = new Set([
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

export const isForbidden = (method: string): boolean =>
  forbiddenMethods.has(normalize(method));
