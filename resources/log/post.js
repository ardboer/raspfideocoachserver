var logId = this.id;

var filename = this.activeFilename.split("/")[1];

dpd.recsessions.get({filename:filename},function(result,error){
    if(error) cancel(error)
    var id = result[0].id
    console.log('********************************')
    console.log(id)
    dpd.recsessions.put(id, {
        logs:{$push : logId},
    },function(result,error){
         if(error) {
             console.log(error)
             cancel(error)
         }
    });
})