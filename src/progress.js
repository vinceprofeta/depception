var progress = function(current, total) {
    var stream = process.stderr;
    if (current < total) {
        var width = 80;
        var widthDone = Math.floor(width * (current / total));
        var out = '';
        for (var i = 0; i < width; i++) {
            out += i <= widthDone ? '=' : '-';
        }

        out += ` ${current} / ${total}`;

        stream.cursorTo(0);
        stream.write(out);
        stream.clearLine(1);
    } else {
        stream.cursorTo(0);
        stream.clearLine(1);
    }
};

module.exports = progress;
