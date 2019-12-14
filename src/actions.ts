import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { ReadyState } from './types';

export const SET_STATE = 'SET_STATE';
export const ON_READY_STATE_CHANGE = 'ON_READY_STATE_CHANGE';
export const ADD_LISTENER = 'ADD_LISTENER';
export const REMOVE_LISTENER = 'REMOVE_LISTENER';
export const SET_CALLBACK_HANDLER = 'SET_CALLBACK_HANDLER';
export const DISPATCH_EVENT = 'DISPATCH_EVENT';
export const EVENT_DISPATCHED = 'EVENT_DISPATCHED';
export const SET_FLAG = 'SET_FLAG';

export const Actions = {
  setState: (payload: { state: ReadyState; req: XMLHttpRequest }) =>
    createAction(SET_STATE, payload),
  onReadyStateChange: () => createAction(ON_READY_STATE_CHANGE),
  addListener: <K extends keyof XMLHttpRequestEventMap>(payload: {
    type: K;
    listener: (this: any, ev: XMLHttpRequestEventMap[K]) => any;
  }) => createAction(ADD_LISTENER, payload),
  removeListener: <K extends keyof XMLHttpRequestEventMap>(payload: {
    type: K;
    listener: (this: any, ev: XMLHttpRequestEventMap[K]) => any;
  }) => createAction(REMOVE_LISTENER, payload),
  setCallbackHandler: <K extends keyof XMLHttpRequestEventMap>(payload: {
    type: K;
    cb: ((this: XMLHttpRequest, ev: any) => any) | null;
  }) => createAction(SET_CALLBACK_HANDLER, payload),
  dispatchEvent: (payload: {
    type: keyof XMLHttpRequestEventMap;
    req: XMLHttpRequest;
  }) => createAction(DISPATCH_EVENT, payload),
  eventDispatched: () => createAction(EVENT_DISPATCHED),
  setFlag: (payload: { type: 'error' | 'send' | 'aborted'; value: boolean }) =>
    createAction(SET_FLAG, payload),
};

export type Actions = ActionsUnion<typeof Actions>;
