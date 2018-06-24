Vue.directive("html2", function(el, bind){
	var dom = new DOMParser().parseFromString(bind.value, "text/html");
	el.innerHTML = bind.value;
	var scr = dom.querySelectorAll("script");
	for(var i=0;i<scr.length;i++){
		if(scr[i].attributes.src){
			var xhttpData = new XMLHttpRequest()
			xhttpData.onreadystatechange = function(){
				if(xhttpData.status == 200 && httpData.readyState == 4){
					eval(xhttpData.response);
				}
			}
			xhttpData.open("GET", scr[i].attributes.src.value, true);
			xhttpData.send();
		}
		if(scr[i].innerHTML){
			eval(scr[i].innerHTML);
		}
	}
	console.log(bind.value);
});