/* 
 * 定义模型
 */
const mongoose = require("mongoose");
const UserSchema = require("../schemas/user");
const User = mongoose.model("User", UserSchema);

module.exports = User;