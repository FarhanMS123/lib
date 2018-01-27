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
