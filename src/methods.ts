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

export type ForbiddenMethod = 'CONNECT' | 'TRACE' | 'TRACK';
export type AllowedMethod =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'PUT';
export type Method = AllowedMethod | ForbiddenMethod;

export const normalize = (method: string): string => method.toUpperCase();

export const isValid = (method: string): method is Method =>
  methods.has(method);

export const isForbidden = (method: Method): method is ForbiddenMethod =>
  forbiddenMethods.has(method);
