import { DOMEvent } from './DOMEvent';
import {
  ActionsObservable,
  StateObservable,
  combineEpics,
} from 'redux-observable';
import { map, withLatestFrom, tap } from 'rxjs/operators';
import * as fromActions from './actions';
import { ofType } from '@martin_hotell/rex-tils';
import { RootState } from './redux';
import { onListenersSelector } from './selectors';

export const setStateEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.SET_STATE),
    withLatestFrom(state$),
    map(([action]) =>
      fromActions.Actions.dispatchEvent({
        type: 'readystatechange',
        req: action.payload.req,
      }),
    ),
  );

export const dispatchEventEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.DISPATCH_EVENT),
    withLatestFrom(state$),
    tap(([action, state]) => {
      const { listeners } = state;
      const { type, req } = action.payload;
      switch (type) {
        case 'readystatechange':
          const event = new DOMEvent(type);
          for (const listener of listeners.readystatechange) {
            listener.call(req, event);
          }
          const { readystatechange } = onListenersSelector(state);
          if (readystatechange) {
            readystatechange.call(action.payload.req, event);
          }
          break;
      }
    }),
    map(() => fromActions.Actions.eventDispatched()),
  );

export const rootEpic = combineEpics(setStateEpic, dispatchEventEpic);
