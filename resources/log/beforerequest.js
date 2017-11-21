if(ctx.method == 'GET'){
    query.$sort = {timestamp: -1}
    query.timestamp = {$gte: 1507579102787}
}
if(ctx.method == 'PUT'){
    console.log(query)
}
