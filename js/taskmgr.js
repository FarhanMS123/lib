global.cp = require("child_process");
global.net = require("net");
global.util = require("util");
global.vm = require("vm");
global.opt = {
	time:[0,0],
	listen:false,
	port:9999,
	proc:[
		/*	
			proc, proc, proc,...
			proc :
			{
				id:#id,
				type:"type", <= exec, execFile, fork, spawn
				log:[
					[
						"type", <=stdout_
						"data", 
						#time
					]
				],
				run:bool(run),
				clients:[],
				time:[],
				intv:
			}
		*/
	],
	buff2str : true
};

opt.itv = setInterval(function(){opt.time[1] = (new Date()).getTime();}, 1);

global.n = net.createServer();

/*
	vv exec cmd
	vv execFile cmd
	v? fork cmd
	vv spawn cmd
	vv list all
	vv list run
	vv list stop
	vv info #id
	vv info #id --full
	vv kill #id
	vv log #id full
	vv log #id listen --start
	vv log #id listen --stop
	vv msg #id text_support_metacharacter...
	vv write #id text_support_metacharacter...
	vv cmd command
	
	return JSON;
*/
n.listen(opt.port || 9999, function(){ console.log(`listening on ${opt.port || 9999}`) });
n.log = [];
n.on("connection", function(s){
	s.on("data", function(dt){
		n.log.push(["sock_data", {sock:s, data:dt}, opt.time[1]]);
		dt = dt.toString();
		if(dt.slice(-1) == "\n" || dt.slice(-1) == "\r") dt = dt.slice(0, -1);
		if(dt.slice(-1) == "\n" || dt.slice(-1) == "\r") dt = dt.slice(0, -1);
		dt = txt2meta(dt);
		try{
			var cmd = dt.slice(0, (dt.indexOf(" ") > -1 ? dt.indexOf(" ") : dt.length));
			switch(cmd){
				case "exec":
				case "execFile":
				case "fork":
				case "spawn":
					if(dt.indexOf(" ") > -1){
						var i = opt.proc.length;
						if(cmd == "exec"){
							opt.proc[i] = cp.exec(dt.slice(dt.indexOf(" ") + 1));
						}else{
							var arg = splitArgs(dt.slice(dt.indexOf(" ") + 1));
							var arg0 = arg[0], arg1 = JSON.parse(JSON.stringify(arg));
							arg1.shift();
							opt.proc[i] = cp[cmd](arg[0], arg1);
						}
						opt.proc[i].id = i
						opt.proc[i].clients = [];
						opt.proc[i].time = [opt.time[1], 0];
						opt.proc[i].intv = setInterval(function(){
							opt.proc[i].time[1] = opt.time[1];
						}, 1);
						opt.proc[i].type = cmd;
						opt.proc[i].log = [];
						opt.proc[i].run = true;
						log(opt.proc[i], function(type, dt){
							if(type == "exit"){
								opt.proc[i].run = false;
							}
							if(opt.buff2str) dt = dt.toString();
							opt.proc[i].log.push([type, dt, opt.proc[i].time[1]]);
							opt.proc[i].clients.forEach(function(sn){
								if(!sn.destroyed) sn.write(JSON.stringify([type, opt.proc[i].id, dt]));
								if(sn.destroyed) opt.proc[i].clients = kickMid(opt.proc[i].clients, opt.proc[i].clients.indexOf(sn)); 
							});
						});
					}else{
						n.log.push(["sock_data_resp", {sock:s, data:dt, res:"error, cmd should : exec fileorapps.ext"}, opt.time[1]]);
						s.write(`error, cmd should : ${cmd} appsorfile.ext cmd`);
					}
					break;
				case "list":
					var arg1 = dt.slice(dt.indexOf(" ") + 1);
					var p = [], i=undefined;
					switch(arg1){
						case "all":
							for(i=0;i<opt.proc.length;i++){
								p.push({
									id:opt.proc[i].id,
									type:opt.proc[i].type,
									spawnargs:opt.proc[i].spawnargs,
									run:opt.proc[i].run,
									time:opt.proc[i].time
								});
							}
							break;
						case "run":
							for(i=0;i<opt.proc.length;i++){
								if(opt.proc[i].run == true){
									p.push({
										id:opt.proc[i].id,
										type:opt.proc[i].type,
										spawnargs:opt.proc[i].spawnargs,
										run:opt.proc[i].run,
										time:opt.proc[i].time
									});
								}
							}
							break;
						case "stop":
							for(i=0;i<opt.proc.length;i++){
								if(opt.proc[i].run == false){
									p.push({
										id:opt.proc[i].id,
										type:opt.proc[i].type,
										spawnargs:opt.proc[i].spawnargs,
										run:opt.proc[i].run,
										time:opt.proc[i].time
									});
								}
							}
							break;
						default:
							p = "error, cmd should : list (all|run|stop)";
					}
					n.log.push(["sock_data_resp", {sock:s, data:dt, res:(p.constructor == String ? p : JSON.stringify(p))}, opt.time[1]]);
					s.write((p.constructor == String? p : JSON.stringify(p)));
					break;
				case "info":
					var arg1 = splitArgs(dt.slice(dt.indexOf(" ") + 1));
					var id = arg1[0];
					var arg2 = dt.slice(dt.indexOf(" ") + id.length + 2)
					var res="";
					console.log([arg1, id, arg2])
					switch(arg2){
						case "":
							res = JSON.stringify({
								id:opt.proc[id].id,
								type:opt.proc[id].type,
								spawnargs:opt.proc[id].spawnargs,
								run:opt.proc[id].run,
								time:opt.proc[id].time
							});
							break;
						case "--full": //signalCode, exitCode, killed, spawnfile, spawnargs, pid, readable, writeable
							res = JSON.stringify({
								id:opt.proc[id].id,
								type:opt.proc[id].type,
								spawnargs:opt.proc[id].spawnargs,
								run:opt.proc[id].run,
								log:opt.proc[id].log,
								stdout_readable:opt.proc[id].stdout.readable,
								stderr_readable:opt.proc[id].stdout.readable,
								stdin_writable:opt.proc[id].stdin.writeable,
								time:opt.proc[id].time
							});
							break;
						default:
							res = "error, cmd should : info #id [-full]"
					}
					n.log.push(["sock_data_resp", {sock:s, data:dt, res:res}, opt.time[1]]);
					s.write(res);
					break;
				case "kill":
					var arg1 = splitArgs(dt.slice(dt.indexOf(" ") + 1));
					var id = arg1[0];
					opt.proc[id].kill();
					break;
				case "log":
					var arg1 = splitArgs(dt.slice(dt.indexOf(" ") + 1));
					var id = arg1[0], res = "created";
					switch(arg1[1]){
						case "full":
							res = JSON.stringify(opt.proc[id].log);
							break;
						case "listen":
							if(arg1[2] == "--start"){
								var is = false;
								opt.proc[id].clients.forEach(function(sn, ind){
									if(sn == s){
										is = true;
										res = `error, you are listening in this process (#${id})`;
									}
								});
								if(!is){
									opt.proc[id].clients.push(s);
								}
							}else if(arg1[2] == "--stop"){
								opt.proc[id].clients.forEach(function(sn, ind){
									if(sn == s){
										opt.proc[id].clients = kickMid(opt.proc[id].clients, ind);
									}
								});
								res = "deleted";
							}
							break;
						default :
							res = "error, cmd should : log (full | listen (--start|--stop))";
					}
					n.log.push(["sock_data_resp", {sock:s, data:dt, res:res}, opt.time[1]]);
					s.write(res);
					break;
				case "msg":
					var arg1 = splitArgs(dt.slice(dt.indexOf(" ") + 1));
					var id = arg1[0];
					var arg2 = dt.slice(dt.indexOf(" ") + id.length + 2)
					opt.proc[id].send(arg2);
					break;
				case "write":
					var arg1 = splitArgs(dt.slice(dt.indexOf(" ") + 1));
					var id = arg1[0];
					var arg2 = dt.slice(dt.indexOf(" ") + id.length + 2);
					arg2 = txt2meta(arg2);
					opt.proc[id].stdin.write(arg2);
					break;
				case "cmd":
					var res = util.inspect(vm.runInNewContext(dt.slice(dt.indexOf(" ") + 1), global));
					n.log.push(["sock_data_resp", {sock:s, data:dt, res:res}, opt.time[1]]);
					s.write(res);
					break;
				default :
					var res = "cmd not found";
					if(dt == "") res = ""
					n.log.push(["sock_data_resp", {sock:s, data:dt, res:res}, opt.time[1]]);
					s.write(res);
			}
		}catch(e){
			var res = JSON.stringify({type:"error", data:util.inspect(e)});
			n.log.push(["sock_data_resp", {sock:s, data:dt, res:res}, opt.time[1]]);
			s.write(res);
			console.log(`cmd : "${dt}"`)
			console.log(e)
		}
	}).on("error", function(e){
		n.log.push(["error", {sock:s, error:e}, opt.time[1]]);
	});
}).on("close", function(){
	n.log.push(["close", "reconnecting", opt.time[1]]);
	n.listen(opt.port || 9999);
}).on("error", function(e){
	if(n._handle == null) n.listen(opt.port || 9999);
	n.log.push(["error", e, opt.time[1]]);
}).on("listening", function(){
	n.log.push(["listening", "", opt.time[1]]);
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

function kickMid(arr, index){
	var dt = []; var i;
	for(i=0;i<arr.length;i++){
		if(i==index) continue;
		dt.push(arr[i])
	}
	return dt;
}

function splitArgs(arg){
	var full = arg.split(" ");
	var u=-1, x=[], l="", i=undefined;
	for(i=0;i<full.length;i++){
		if(u>-1){
			full[u] += ` ${full[i]}`;
			x.push(i);
		}
		if(u == -1 && (full[i].slice(0,1) == "\"" || full[i].slice(0,1) == "\'")){
			u=i;
			l=full[i].slice(0,1);
			full[i] = full[i].slice(1);
		}
		if(u > -1 && full[i].slice(-1) == l){
			full[u] = full[u].slice(0, -1);
			u=-1;
		}
	}
	var i = undefined;
	for(i=x.length - 1;i>-1;i--){
		full = kickMid(full, x[i]);
	}
	return full;
}

function txt2meta(txt){
	//hello \" \' \r\n \123 \xff \u2f3a
	//\\" \\' \\` \\r\\n \\123 \\xff \\u2f3a
	txt = txt.replace(/\\"/g, "\"").replace(/\\'/g, "\'").replace(/\\`/g, "\`").replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
	var rg = [[/\\([abcdef]|[ABCDEF]|[0-9]){3}/g, 8], [/\\x([abcdef]|[ABCDEF]|[0-9]){2}/g, 16], [/\\u([abcdef]|[ABCDEF]|[0-9]){4}/g, 16]];
	var i;
	for(i=0;i<rg.length;i++){
		if(txt.match(rg[i][0]) != null){
			txt.match(rg[i][0]).forEach(function(s){
				txt = txt.replace(s, String.fromCharCode(parseInt( (/([abcdef]|[ABCDEF]|[0-9])+/).exec(s)[0] , rg[i][1])));
			});
		}
	}
	return txt;
}
