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
		var dt = []; var u;
		for(u=0;u<full.length;u++){
			if(u==x[i]) continue;
			dt.push(full[u])
		}
		full = dt;
	}
	return full;
}
