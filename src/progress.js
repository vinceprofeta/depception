'use strict';

var Progress = function () {
    this._ticks = 0;
    this._stream = process.stderr;
};

Progress.prototype.tick = function () {
    this._ticks++;

    this._stream.cursorTo(0);
    this._stream.write(`Processed ${this._ticks} dependencies...`);
    this._stream.clearLine(1);
};

module.exports = Progress;
