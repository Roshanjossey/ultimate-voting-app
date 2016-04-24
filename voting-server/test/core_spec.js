import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next} from '../src/core';

describe('application logic', () => {
  
  describe('setEntries', () => {

    it('add entries to the state', () => {
      const state = Map();
      const entries = List.of('Cache', 'Amour');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Cache', 'Amour')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Cache', 'Amour'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Cache', 'Amour')
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Cache', 'Amour', 'Funny Games')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Cache', 'Amour')
        }),
        entries: List.of('Funny Games')
      }));
    });
  });
});
