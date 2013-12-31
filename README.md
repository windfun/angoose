## What is it?
The motive for Angoose project is to do away with the dual model declarations(server and client side) if we are building a rich model based SPA application 
using modern framework such as Angular and node.js.  

Angoose depends on following frameworks and assumes you have basic familarities with these frameworks

* angular
* mongoose
* express

## Get Started


#### 1. npm install angoose

#### 2. configure angoose
Assuming you already have an express server/app file, you just need to add following line to the app.js, after the app.configure() block:

	...
	app.configure(function() {
		app.use(express.favicon());
		app.use(express.bodyParser());
		...
	});

    require("angoose").init(app, {
       modelDir: './models',
       mongo_opts: 'localhost:27017/test'
    });

Here we assume your Mongoose model files are defined under `models` sub directory relative to the server/app script. 

Restart your node app. 

#### 3. Define a Mongoose model if not already done. 

Requirements: 

* Each Mongoose model is in its own file(schema file)
* `module.exports` must set to the model class, i.e., the return value of `mongoose.model()` method

You can use the sample model `SampleUser` which comes with the Angoose installation and will be preloaded for trial purpose.

	var mongoose = require('mongoose');
	var SampleSchema = mongoose.Schema({
	        email:  {type: String, required: true, match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, index:true},
	        firstname: {type: String, required:true },
	        lastname: {type: String, required:true },
	        status: {type: String, enum: ['inactive', 'active', 'disabled', 'archived'], required:true, def:'inactive' },
	        password: { type:String, required:true },
	    },
	    { collection:'SampleUsers',  discriminatorKey: 'type' }
	);
	
	SampleSchema.methods.setPassword= function(newPassword, $callback){
	    // instance method, reset user's password
	    var cryptor = require("crypto"); // require node module crypto
	    this.password = cryptor.encrypt("salt", newPassword);
	    this.save($callback);
	}
	SampleSchema.statics.getSample = function(){
	    // static method
	    return this.findOne({firstname:'Gaelyn'});  // note .exec() will be called by Angoose before return value to client side.
	}
	// notice the exports return, it is a Mongoose Model type
	module.exports = mongoose.model('SampleUser', SampleSchema);   


#### 4. In your client code(HTML), add following after angular script tag:

     <script src="/angoose/angoose-client.js"></script>
     
Note the `/angoose/angoose-client.js` route is wired by Angoose in the backend. You may change it in the conf object passed to the init function by specifying the
`urlPrefix` setting(default to `/angoose`)

#### 5. In your main angular app, add `angoose-client` to your app module dependencies. For example:

    var myapp = angular.module('myapp', ['ngRoute', 'ui.bootstrap', 'angoose.client']);

#### 6. Start using the model in the controller

All the models will be readily available for injection, just delcare them in the controller function:

	angular.module('myapp').controller('UserCtrl', function($scope, SampleUser) {
	
		// calling static method on model class, the return value is an instance of SampleUser. 
		// No callback is required, you can use `{{ sampleUser.firstname }}` in the template and 
		// it will be updated once the call is complete.   
		$scope.sampleUser = SampleUser.findById('xxxx');   //  
		
		// create new instance and validations		
		var newUser = new SampleUser({
			firstname:'xxx',
			lastname:'yyy',
			email:'xxx@asd',
			status:'active'
		});
		newUser.save(function(err, result){
			console.log(err);  // print out: 'email' is invalid
		});

		newUser.email = 'test@google.com';
		// here we are using Q's promise, an alternate to callback function
		newUser.save().done(function(result){
			// result is undefined since Mongoose model.save() does not return 
			console.log(newUser._id);  // print out: _id value
			newUser.remove(); // remove this user from database
		}, function(err){
			// if something went wrong
		});
	});
	
## What Now?
Once you complete the setup, the remain would involve mainly two tasks:

1. Define more models
2. Inject the models into Angular controllers or directives


## Roadmap

* Docs and Tutorials
* Mongoose query API port to client
* Support presentation meta for the model schema for auto form generation
* More front end framework adapters to use with non-angular frameworks 
* Security integration





