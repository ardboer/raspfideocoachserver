dpd.deleteclip.get({clip:this.clipFilename}, function(result,error){
    if(error) console.log(error)
    if(error) cancel(error)
    console.log(this.clipFilename)
})