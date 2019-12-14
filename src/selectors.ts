import { RootState } from './redux';
import { createSelector } from 'reselect';

export const listenersSelector = (state: RootState) => state.listeners;

export const onListenersSelector = (state: RootState) => state.on;

export const flagsSelector = (state: RootState) => state.flags;

export const errorFlagSelector = createSelector(flagsSelector, (f) => f.error);

export const sendFlagSelector = createSelector(flagsSelector, (f) => f.send);
