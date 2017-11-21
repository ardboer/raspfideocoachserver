$addCallback();

var cmd=require('node-cmd');

var getStatus = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
    cmd.get(
                    './getFfmpeg.sh',
                    function(err, data, stderr){
                        if(err) cancel(err);
                        var jData = JSON.parse(data)
                        var result = []
                        jData.map(function(item){
                            if(item.procesname === 'raspivid'){
                                result.push(item)
                            }
                        })
                        resolve(result);
                    })
});

var action = 'status';

if (url === '/stop') {
  action = 'stop'
}
else if(url === '/start'){
  action = 'start'
}
else if(url === '/log'){
  action = 'log'
}
    
if (action === 'stop'){
    getStatus.then(function(data){
                if(data.length > 0){
                    data.map(function(item,index){
                       cmd.run('kill -9 '+item.pid1); 
                       cmd.run('rm recordings/*.h264'); 
                       cmd.run('sudo clear > /dev/tty1'); 
                    });
                    setResult("stopped all recordings")
                }
                else {
                    cancel("no recording active");
                }
                $finishCallback();
            }
        );        
}
else if (action === 'log'){
                        // set backintime seconds and duration
        var durationSeconds = query.durationSeconds || 15
        var user = query.user || 'unknown'
        getStatus.then(function(status){
            console.log(status);
            if(status.length < 1){
                cancel("No active recordings");
                $finishCallback();
            }
            else {
                var log = {
                    camera: 1,
                    timestamp: new Date().getTime(),
                    // activeFilename: status[0].filename,
                    activeFilename: new Date().getTime()
                }
                dpd.log.post(log,function(result,error){
                    if(error) cancel(error);
                    // console.log(error)
                    emit('clipCreated', 'Done')
                    console.log(result)
                    
                    // var cmdx = 'ffmpeg -ss '+secondsToHms(delta)+' -i '+result.activeFilename+' -t '+duration+' public/clips/'+result.id+'.mp4';
                    // var str = "file '$PWD/%s'\\n"
                    // var cmdx = 'ffmpeg -f concat -safe 0 -i <(printf "'+str+'" recordings/*.mkv | sort -r | tail -n +2 | head -n 5 | sort ) public/clips/'+result.id+'.mp4 -vcodec copy'
                    var cmdx = './makeclip.sh '+result.id+" "+durationSeconds;
                    console.log(cmdx);
                    
                    var id = result.id
                    var callback = function(error,stdout, stderr){
                        var exec = require('child_process').exec;
                        var command = 'ffmpeg -itsoffset -1 -i public/clips/'+result.id+'.mp4 -vframes 1 -filter:v scale="280:-1"  public/clips/'+result.id+'.png';
                        var execute = exec(command, {maxBuffer: 1024 * 12000});
                        execute.on('close', function(code) {
                            console.log('closing code: ' + code);
                            dpd.log.put(id, {user:user, ready:true, rendertimestamp: new Date().getTime()},function(result,error){
                            if(result){
                                emit('clipRendered', 'Done');
                            }
                        })
                        });
                        execute.stderr.on('data', function(data) {
                            console.log(data);
                        });
                        execute.stdout.on('data', function(data) {
                            console.log(data);
                        });
                    }
                    var exec = require('child_process').exec;
                    var execute = function(command, callback){
                        var execute = exec(command, {maxBuffer: 1024 * 12000});
                        execute.on('close', function(code) {
                            console.log('closing code: ' + code);
                            callback();
                        });
                        execute.stderr.on('data', function(data) {
                            console.log(data);
                        });
                        execute.stdout.on('data', function(data) {
                            console.log(data);
                        });
                    };
                    execute(cmdx, callback);
                    console.log(result.id)
                    dpd.log.put(result.id, {clipFilename: result.id+'.mp4'},function(result,error){
                        if(error) cancel(error);
                        setResult(result)
                        $finishCallback();
                    })
                })
            }
        });
}
else {
        getStatus.then(function(status){
            console.log(status);
            if(status.length < 1){
                cancel("No active recordings")
            } else {
                setResult(status)
            }
            $finishCallback();
        })

    }


