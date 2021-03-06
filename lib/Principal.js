var logger = require("log4js").getLogger("angoose");

// This class encapsulates authenticated user information. 
// To obtain an instance of this object, you may use `getContext` method
// defined on the Model/Service class or instance:
//
//     MySchema.methods.updateStatus = function(){
//          var user = this.getContext().getPrincipal();
//          console.log("User is ", user.getUsername());     
//     }
//
// 

// ### API References


var  Principal = function(userId, username, roles){
    var user = {
        _id: userId,
        username: username,
        roles:roles
    }
    // ** getUsername() **
    // 
    // get current logged in user's name/login
    this.getUsername = function(){ return user.username};

    // ** getRoles **
    //
    // get current logged in user's roles
    this.getRoles = function(){ return user.roles};
    
    // ** getUserId **
    //
    // get current logged in user's ID
    this.getUserId = function(){ return user.userId};
};

module.exports = Principal;