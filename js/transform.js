(function(w){
	w.transformCss = function (node,name,value){
			//首先我们要找一个东西去存储设置的值,以便读取的时候去拿，否则读取的时候没地方去拿上次你设置的值	
			
			if(!node.obj){
				node.obj = {};
			}
			
//			{
//				'translateX':100,
//				'translateY':200,
//				'scale':2
//			}
			
			if(arguments.length > 2){
				//设置元素的属性值
				//设置值的时候先把值在对象里面存一份
				node.obj[name] = value;
				var result = '';
//				'translateX(100px) translateY(200px) scale(2) '
				for(var key in node.obj){
					switch(key){
						case 'translateX':
						case 'translateY':
						case 'translateZ':
						case 'translate':
							result += key+'('+ node.obj[key] +'px) ';
							break;
							
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							result += key+'('+ node.obj[key] +') ';
							break;
							
						case 'rotate':
						case 'rotateX':
						case 'rotateY':
						case 'rotateZ':
						case 'skew':
						case 'skewX':
						case 'skewY':
							result += key+'('+ node.obj[key] +'deg) ';
							break;
					}
					
					
				}
				node.style.transform = result;
			}else{
				//读取元素的属性值
				var result = 0;
				//读取的时候先去判断有没有设置过这个值，如果没有给设置一个默认值
				if(node.obj[name] == undefined){
					if(name == 'scale' || name =='scaleX' || name == 'scaleY'){
						result = 1;
					}else{
						result = 0;
					}
				}else{
					result = node.obj[name];
				}
				return result;
			}
		}

})(window);


