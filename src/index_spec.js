// @flow
import { collect, main } from './index';
import { expect } from 'chai';
import Stream from 'stream';

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
      if (output.arrayChildren == null) { throw new Error('no arrayChildren'); }
      expect(output.arrayChildren.counts.null).to.eql(2);
      if (output.arrayChildren == null) { throw new Error('no arrayChildren'); }
      expect(output.arrayChildren.counts.number).to.eql(4);
    });
  });

  describe('for object types', function () {
    it ('returns the correct count', function () {
      const input = [
        { foo: 'asdf' },
        { foo: 'bar' },
      ];
      const output = collect(input);
      expect(output.counts.object).to.eql(2)
    });

    it ('adds to their respective objectChildren buckets', function () {
      const input = [
        { foo: 'asdf' },
        { foo: 'rttt' , bar: 0 },
      ];
      const output = collect(input);
      if (output.objectChildren == null) { throw new Error('no arrayChildren'); }
      expect(output.objectChildren.foo.counts.string).to.eql(2);
      if (output.objectChildren == null) { throw new Error('no arrayChildren'); }
      expect(output.objectChildren.bar.counts.number).to.eql(1);
    });
  });
});

describe('main', function () {
  it ('with data from stdin, logs histogram to the console', async function () {
    const input = (() => {
      const stream = new Stream.Readable()
      stream.push('"hello"\n');
      stream.push('"world"\n');
      stream.push(null);
      return stream;
    })();
    let output = ""
    const log = (arg) => {
      output += arg;
    };
    await main({ input,  log });
    expect(output).to.eql('{"counts":{"string":2}}');
  });
});
