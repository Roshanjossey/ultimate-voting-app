import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

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

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Cache', 'Amour'),
          tally: Map({
            'Cache': 322,
            'Amour': 235
          })
        }),
        entries: List.of('Funny Games', 'Code Unknown', 'White Ribbon')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Funny Games', 'Code Unknown')
        }),
        entries: List.of('White Ribbon', 'Cache')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Cache', 'Amour'),
          tally: Map({
            'Cache': 356,
            'Amour': 356
          })
        }),
        entries: List.of('Funny Games', 'Code Unknown', 'White Ribbon')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Funny Games', 'Code Unknown')
        }),
        entries: List.of('White Ribbon', 'Cache', 'Amour')
      }));
    });

    it('marks the winner when left with one entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Cache', 'Amour'),
          tally: Map({
            'Cache': 413,
            'Amour': 233
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Cache'
      }));
    });
  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Cache', 'Amour')
        }),
        entries: List()
      });
      const nextState = vote(state, 'Cache');
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Cache', 'Amour'),
          tally: Map({'Cache': 1})
        }),
        entries: List()
      }));
    });

    it('adds to existing tally for voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Cache', 'Amour'),
          tally: Map({
            'Cache': 543,
            'Amour': 234
          })
        }),
        entries: List()
      });
      const nextState = vote(state, 'Amour');
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Cache', 'Amour'),
          tally: Map({
            'Cache': 543,
            'Amour': 235
          })
        }),
        entries: List()
      }));
    });
  });
});
