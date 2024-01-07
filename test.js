fs = require('fs')

let secretKey = fs.readFileSync('./theBestSecuredPrivateKeyEver', 'utf8');


console.log(secretKey)
