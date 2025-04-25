const mongoose = require("mongoose");
const passpostLocalMongoose = require("passport-local-mongoose");


// We dont need to specifically define username and password as passport-local-mongoose automatically creates it in database itself also applies hashing and salting to username and password
const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true
    }

})

userSchema.plugin(passpostLocalMongoose);

module.exports = mongoose.model("User",userSchema);
