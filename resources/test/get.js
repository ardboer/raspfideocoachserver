var cmd = require('node-cmd');
var exec = require('child_process').exec;
                    var exec = require('child_process').exec;
                    var command = 'rm recordings/*.mkv';
                    var execute = exec(command, {maxBuffer: 1024 * 12000});
                    var now = new Date().getTime();
emit('renderDone', 'Done');
setResult(now.toString())