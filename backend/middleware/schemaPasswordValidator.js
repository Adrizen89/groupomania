const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is()
.min(6)
.is()
.max(20)
.has()
.uppercase(1)
.has()
.lowercase(1)
.has()
.digits(2)
.has()
.not()
.spaces();

module.exports = schema;