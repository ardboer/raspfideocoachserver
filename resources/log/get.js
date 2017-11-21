try {
    this.thumbnail = this.clipFilename.split('.')[0] + ".png"
} catch (e) {
    
}
var filename = this.activeFilename.split("/")[1]
dpd.recsessions.get({logs:{$all:[this.id]}},function(result,error){
    if(error) cancel(error)
    this.recsession = result
});

dpd.moment.get({now:this.timestamp},function(result,error){
    this.moment = result
})