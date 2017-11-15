var moment = require('moment')

if(query.now){
    var now = moment(query.now).locale('nl').fromNow()
}
else {
    var now = 'no result'
}
setResult(now)