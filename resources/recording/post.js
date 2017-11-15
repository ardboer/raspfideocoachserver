$addCallback();

var cmd = require('node-cmd');

var logSession = function(datetime){
    console.log("log session"+datetime)
    dpd.recsessions.post({datetime:datetime,
                       description: query.description || "none",
                       title: query.title || "none"
    },function(result,error){
        console.log("ERRRRRRORRRRR:")
        console.log(error)
        console.log("RESULTTTTTTTT:")
        console.log(result)
    });
}

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

if (url === '/start') {
  action = 'start'
}
else {
    cancel("no action given")
}

if(action === 'start'){
    getStatus.then(function(data){
                if(data.length > 0){
                    cancel("already recording. pid: "+data[0].pid1)
                }
                else {
                    // remove all old clips
                    console.log('123')
                    var exec = require('child_process').exec;
                    var command = 'rm recordings/*.h264';
                    var execute = exec(command, {maxBuffer: 1024 * 12000});
                    var now = new Date().getTime();
                    console.log('456')
                    var ip = body.params.ip || 'http://192.168.178.25/live';
                    // var cmdx = 'nohup ffmpeg -i '+ip+' -vcodec copy recordings/'+now+'.mkv &';
                    // var cmdx = 'ffmpeg -i '+ip+' -c copy -f segment -segment_time 1 -reset_timestamps 1 recordings/clip%03d.mp4'
                    var cmdx = 'raspivid -fps 25 -g 25 -b 3000000 -sg 1000 -t 0 -o recordings/clip%03d.h264'
                    console.log(cmdx)
                    cmd.run(cmdx);
                    logSession(now)
                    setResult("started recording");
                }
                $finishCallback();
            }
        ).catch(function (err) {
            console.log("CATCH ERROR")
            console.log(err)
        });
}