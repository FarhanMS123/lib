global.cp = require("child_process");
global.net = require("net");

function listen(){
	s.listen({}); //using listen
}

global.proc = cp.spawn("node", ["your file.js"]); //spawning

global.s = net.createServer(); //listen here
s.on("error", function(e){
	console.log(json.stringify(["server_error", e]));
	if(s._handle == null) listen();
}).on("close", function(){
	s.members = [];
	console.log(json.stringify(["server_close", e]));
	listen();
}).on("connection", function(c){
	s.members.push(c);
}).on("listening", function(){
	s.members = [];
	console.log(json.stringify(["server_listen", ""]));
});

log(proc, function(name, desc){
	console.log(json.stringify([name, desc]));
	s.members.forEach(function(c){
		if(c._handle !== null) c.write(json.stringify([name, desc]));
	});
});

function log(p, f){
	p.on("close", function(code, signal){
		f("close", {code, signal});
	}).on("disconnect", function(){
		f("close", "");
	}).on("error", function(error){
		f("error", error);
	}).on("exit", function(code, signal){
		f("exit", {code, signal});
	});
	p.stdout.on("stdout_close", function(){
		f("stdout_close", "");
	}).on("data", function(data){
		f("stdout_data", data);
	}).on("end", function(){
		f("stdout_end", "");
	}).on("error", function(error){
		f("stdout_error", error);
	}).on("readable", function(){
		f("stdout_readable", "");
	});
	p.stderr.on("stderr_close", function(){
		f("stderr_close", "");
	}).on("data", function(data){
		f("stderr_data", data);
	}).on("end", function(){
		f("stderr_end", "");
	}).on("error", function(error){
		f("stderr_error", error);
	}).on("readable", function(){
		f("stderr_readable", "");
	});
	p.stdin.on("close", function(){
		f("stdin_close", "");
	}).on("drain", function(){
		f("stdin_drain", "");
	}).on("error", function(error){
		f("stdin_error", error);
	}).on("finish", function(){
		f("stdin_finish", "");
	}).on("unpipe", function(src){
		f("stdin_unpipe", src);
	});
}
