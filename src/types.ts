export const UNSET = 0;
export const OPENED = 1;
export const HEADERS_RECEIVED = 2;
export const LOADING = 3;
export const DONE = 4;
export type ReadyState =
  | typeof UNSET
  | typeof OPENED
  | typeof HEADERS_RECEIVED
  | typeof LOADING
  | typeof DONE;
