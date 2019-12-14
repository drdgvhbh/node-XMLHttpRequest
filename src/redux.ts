import produce from 'immer';
import { DOMEvent, XMLHttpRequestProgressEvent } from './DOMEvent';
import * as fromActions from './actions';
import { UNSET, ReadyState } from './types';
import {
  listenersSelector,
  onListenersSelector,
  flagsSelector,
} from './selectors';

type EventCB = (this: XMLHttpRequest, ev: DOMEvent) => any;
type XMLHttpRequestEventCB = (
  this: XMLHttpRequest,
  ev: XMLHttpRequestProgressEvent,
) => any;
const newReducer = () => {
  const initialState = {
    flags: {
      send: false,
      error: false,
      aborted: false,
    },
    readyState: UNSET as ReadyState,
    listeners: {
      readystatechange: [] as EventCB[],
      abort: [] as XMLHttpRequestEventCB[],
      error: [] as XMLHttpRequestEventCB[],
      load: [] as XMLHttpRequestEventCB[],
      loadend: [] as XMLHttpRequestEventCB[],
      loadstart: [] as XMLHttpRequestEventCB[],
      progress: [] as XMLHttpRequestEventCB[],
      timeout: [] as XMLHttpRequestEventCB[],
    },
    on: {
      readystatechange: null as
        | ((this: XMLHttpRequest, ev: DOMEvent) => any)
        | null,
    },
  };
  return (
    state: Readonly<typeof initialState> = initialState,
    action: fromActions.Actions,
  ) =>
    produce(state, (draftState) => {
      switch (action.type) {
        case 'SET_STATE':
          draftState.readyState = action.payload.state;
          break;
        case 'ADD_LISTENER': {
          const { listener, type } = action.payload;

          const listeners = listenersSelector(draftState);
          switch (type) {
            case 'readystatechange':
              listeners.readystatechange.push(listener);
              break;
            default:
              listeners[type].push(listener);
              break;
          }
          break;
        }
        case 'REMOVE_LISTENER': {
          const { listener, type } = action.payload;

          const listeners = listenersSelector(draftState);
          const i = listeners[type].indexOf(listener);
          if (i > 0) {
            listeners.readystatechange.splice(i, 1);
          }
          break;
        }
        case 'SET_CALLBACK_HANDLER': {
          const { cb, type } = action.payload;
          switch (type) {
            case 'readystatechange':
              onListenersSelector(draftState).readystatechange = cb;
              break;
            default:
              break;
          }
          break;
        }
        case 'SET_FLAG': {
          const flag = action.payload;
          const { type, value } = flag;
          flagsSelector(draftState)[type] = value;
          break;
        }
        default:
          break;
      }
    });
};
export type RootState = ReturnType<ReturnType<typeof newReducer>>;

export default newReducer;
