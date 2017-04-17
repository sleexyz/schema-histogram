// @flow

import { collect } from './index';
import { expect } from 'chai';

describe('collect', function () {
  describe('for non recursive types', function() {
    it ('returns the correct counts', function () {
      const input = [
        "hello",
        null,
        null,
        1,
        "world",
        2,
        undefined,
      ];
      const output = collect(input);
      expect(output.counts.string).to.eql(2);
      expect(output.counts.number).to.eql(2);
      expect(output.counts.null).to.eql(2);
      expect(output.counts.undefined).to.eql(1);
    });
  });

  describe('for arrays types', function() {
    it ('returns the correct counts', function () {
      const input = [
        [null],
        [1, 2, 3],
      ];
      const output = collect(input);
      expect(output.counts.array).to.eql(2);
    });

    it ('adds to the arrayChildren bucket', function () {
      const input = [
        [null, 2],
        [1, 2, 3, null],
      ];
      const output = collect(input);
      if (output.arrayChildren == null) {
        throw new Error('no arrayChildren');
      }
      expect(output.arrayChildren.counts.null).to.eql(2);
      if (output.arrayChildren == null) {
        throw new Error('no arrayChildren');
      }
      expect(output.arrayChildren.counts.number).to.eql(4);
    });
  });

  describe('for object types', function () {
    it ('returns the correct count');
    it ('adds to the objectChildren bucket');
  });
});
