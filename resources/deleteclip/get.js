$addCallback();
if(!query.clip) cancel('no clip given')
var clip = query.clip;

var cmd=require('node-cmd');

var getStatus = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
    cmd.get('rm -f public/clips/'+clip,
                    function(err, data, stderr){
                        if(err) cancel(err);
                        resolve(data);
                    })
});
getStatus.then(function(status){
    console.log("DELETE ******* :")
    console.log(status)
    setResult(status)
    $finishCallback();
});