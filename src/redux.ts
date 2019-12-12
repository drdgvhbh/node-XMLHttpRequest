import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import produce from 'immer';

const UNSET = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;
type ReadyState =
  | typeof UNSET
  | typeof OPENED
  | typeof HEADERS_RECEIVED
  | typeof LOADING
  | typeof DONE;

const SET_STATE = 'SET_STATE';
export const Actions = {
  setState: (state: ReadyState) => createAction(SET_STATE, state),
};
export type Actions = ActionsUnion<typeof Actions>;

const newReducer = () => {
  const initialState = {
    readyState: UNSET as ReadyState,
  };
  return (
    state: Readonly<typeof initialState> = initialState,
    action: Actions,
  ) =>
    produce(state, (draftState) => {
      switch (action.type) {
        case 'SET_STATE':
          draftState.readyState = action.payload;
          break;
        default:
          break;
      }
    });
};

export default newReducer;
