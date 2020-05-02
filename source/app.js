var express 		= require("express"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	bodyParser 		= require("body-parser"),
	User			= require("./models/user"),
	Project			= require("./models/project"),
	Version			= require("./models/version"),
	Comment			= require("./models/comment"),
	localStrategy 	= require("passport-local"),
	localMongoose 	= require("passport-local-mongoose"),
	expressSession	= require("express-session");



mongoose.connect("mongodb://localhost:27017/actionWeb", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
	secret: "Action is the best APP",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==========
// 	ROUTES
//==========

//Home ROUTE

app.get("/", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	res.render("home", {
		userId: req.user._id,
		navVar: navVar
	});
});

//Create ROUTE

app.get("/create", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	res.render("create", {
		navVar: navVar,
		userId: req.user._id
	});
});

app.post("/create", function(req, res){
	var userId = req.user._id;
	var projectName = req.body.title;
	var desc = req.body.desc;
	var bid = req.body.bid;
	Project.create({
		projectName: projectName,
		owner: userId,
		desc: desc,
		bid: bid
	}, function(err, project){
		if(err){
			console.log(err);
		} else {
			project.version.push({
				auther: userId,
				content: "# This is a new Version.(Use tutorial below to edit scripts)"
			}),
			project.currentBid = 0;
			project.save();
			User.findById(userId, function(err, user){
				if(err){
					console.log(err);
				} else {
					user.project.push(project._id);
					user.save();
				}
			})
		}
		res.redirect("/project/" + project._id);
	})
});

// Project ROUTE

app.get("/project/:id", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	Project.findById(req.params.id, function(err, project){
		if(err){
			console.log(err);
		} else {
			Comment.find({project: req.params.id}, function(err, comment){
				if(err){
					console.log(err);
				} else {
					
					res.render("project", {
						userId: req.user._id,
						navVar: navVar,
						project: project,
						comment: comment
					});
				}
			})
			
		}
	})
});

// Comment ROUTE
app.get("/project/:id/comment/new", function(req, res){
	var navVar = req.isAuthenticated();
	res.render("comment", {
		navVar: navVar,
		id: req.params.id,
		userId: req.user._id
	});		
})

app.post("/project/:id/comment/new", function(req, res){
	var userId = req.user._id;
	var content = req.body.content;
	var star = req.body.star;
	User.findById(userId, function(err, user){
		if(err){
			console.log(err);
		} else {
			Comment.create({
				auther: userId,
				project: req.params.id,
				content: content,
				name: user.userName,
				star: star
			}, function(err, comment){
				if(err){
					console.log(err);
				} else {
					Project.findById(req.params.id, function(err, proj){
						if(err){
							console.log(err);
						} else {
							proj.comments.push(comment._id);
							proj.save();
						}
					})
					res.redirect("/project/" + req.params.id);
				}
			})
		}
	})
	
})

// Search ROUTE
app.get("/search/id/:uid/:i", isLoggedIn, function(req, res){

	User.findById(req.params.uid, function(err, user){
		if(err){
			console.log(err);
		} else {
			var navVar = req.isAuthenticated();
			var projectId = user.project;
			function retPro(prjectId, i){
				if(projectId.length === 0){
					res.render("search", {
						navVar: navVar,
						search: 1,
						userId: req.user._id
					})
				} else if (i < projectId.length){
					Project.findById(projectId[i], function(err, proj){
						if(err){
							console.log(err);
						} else {
							res.render("search", {
								navVar: navVar,
								search: 2,
								project: proj,
								userId: req.user._id,
								i: i,
								max: projectId.length
							})
						}
					})
				} else if (i >= projectId.length){
					res.redirect("/search/id/" + req.user._id + "/0");
				}
			}	
			retPro(projectId, req.params.i);
			//res.redirect("/cat/3");
		}
	})
	
});


// Search by keyword(working)
app.get("/search/s/:key", isLoggedIn, function(req, res){
	res.render("search", {keyword: keyword});
});

//pad route

app.get("/pad/:pid",  function(req, res){
	var navVar = req.isAuthenticated();
	var projectId = req.params.pid;
	
	Project.findById(projectId, function(err, proj){
		if(err){
			console.log(err);
		} else {
			var Ver = proj.version;
			var l = Ver.length;
			var curVer = Ver[l - 1];
			var pass = curVer.content;
			res.render("pad", {
				projectId: projectId,
				pass: pass
			});
		}
	})
});

app.post("/pad/:pid", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	var projectId = req.params.pid;
	var sub = req.body.content;
	Project.findById(projectId, function(err, project){
		project.version.push({
			auther: req.user._id,
			content: sub
		});
		project.save();
	})
	res.redirect("/project/" + req.params.pid);
})

// vc route
app.get("/vc/:pid", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	var projectId = req.params.pid;
	Project.findById(projectId, function(err, proj){
		if(err){
			console.log(err);
		} else {
			var ver = proj.version;
			var version = proj.version[ver.length - 1];
			res.render("vc", {
				version: version,
				navVar: navVar,
				userId: req.user._id,
				projectId: proj._id
			})
		}
	})
})

app.get("/vc/id/2", isLoggedIn, function(req, res){
	res.render("vc2",{projectId: 1});
})

app.get("/vc/id/3", isLoggedIn, function(req, res){
	res.render("vc3",{projectId: 1});
})

app.get("/vc/id/4", isLoggedIn, function(req, res){
	res.render("vc4",{projectId: 1});
})

app.post("/vc/:pid", isLoggedIn, function(req, res){
	var content = req.body.content;
	Project.findById(req.params.pid, function(err, proj){
		if(err){
			console.log(err);
		} else {
			proj.version.push({
				auther: req.user._id,
				content: content
			});
			proj.save();
			res.redirect("/cat/4")
		}
	})
})

// crowdfund route

app.get("/crowdfund/:pid", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	Project.findById(req.params.pid, function(err, proj){
		if(err){
			console.log(err);
		} else {
			var bid = proj.bid;
			var curBid = proj.currentBid;
			var str = Number((bid / curBid) * 100).toFixed(2)
			res.render("crowdfund", {
				navVar: navVar,
				userId: req.user._id,
				project: proj,
				projectId: proj._id,
				bid: bid,
				curBid: curBid,
				str: str
			})
		}
	})
})

// pay route
app.get("/pay/:pid", function(req, res){
	var projectId = req.params.pid;
	var userId = req.user._id;
	res.render("pay", {
		projectId: projectId,
		userId: userId
	})
})

app.post("/pay/:pid", function(req, res){
	var addBid = req.body.bid;
	Project.findById(req.params.pid, function(err, proj){
		if(err){
			console.log(err);
		} else {
			proj.currentBid += addBid;
			proj.save();
			res.redirect("/crowdfund/" + req.params.pid);
		}
	})
})

// cat route
app.post("/cat", isLoggedIn, function(req, res){
	var navVar = req.isAuthenticated();
	
	if(req.body.gjb == "lion"){
		res.render("catlion", {
			navVar: navVar,
			userId: req.user._id
		});
	} else if (req.body.gjb == "toy"){
		res.render("cattoy", {
			navVar: navVar,
			userId: req.user._id
		});
	} else {
		res.render("catdef", {
			navVar: navVar,
			userId: req.user._id
		});
	}
})


// Auth routes

app.get("/signup", function(req, res){
	res.render("signup");
});

//Sign Up and then Login
app.post("/signup", function(req, res){
	User.register(new User({username: req.body.username, 
							desc: req.body.desc}),
				  req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('signup');
		}
		//Auth method is LOCAL
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		})
	})
});

//Login routes
app.get("/login", function(req, res){
	res.render("login");
});

//login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function(req, res){
	console.log("A user successfully login.");
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

//MIDDLEWARE FUNCTION for check if logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("Action is running on port 3000!");
});