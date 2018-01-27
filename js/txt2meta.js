function txt2meta(txt){
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
