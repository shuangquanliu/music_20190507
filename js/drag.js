(function(win){
	win.drag = function (navWrap,callback){
			
			var navList = navWrap.children[0];
			
			//基础滑动，橡皮筋（越来越难拖，回弹），加速，即点即停,滚动条，防抖动
			
			//定义元素的初始位置
			var eleY = 0;
			//定义手指初始位置
			var startY = 0;
			
			//防抖动
			var startX = 0;
			var isFirst = true;
			
			//加速
			var s1 = 0;
			var t1 = 0;
			var s2 = 0;
			var t2 = 0;
			var disS = 0;
			var disT = 1; //定义一个非零数字
			
			//tween算法
			var Tween = {
				//匀速linear
				Linear: function(t,b,c,d){ return c*t/d + b; },
				//回弹
				easeOut: function(t,b,c,d,s){
		            if (s == undefined) s = 3;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        }
			}
			
			//定时器
			var timer = null;
			
			//手指按下
			navWrap.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
//				//清除过渡
//				navList.style.transition = 'none';
				//即点即停：清除定时器
				clearInterval(timer)
				
				
				//元素的初始位置
				eleY = transformCss(navList,'translateY');
				//手指初始位置
				startY = touch.clientY;
				startX = touch.clientX;
				
				//加速：元素初始位置与初始时间
				s1 = eleY;
				t1 = new Date().getTime(); //毫秒
				//清除上一次的速度 
				disS = 0;
				
				//防抖动重置
				isFirst = true;
				
				//检测touchstart状态
				if(callback&& typeof callback['start'] === 'function'){
					callback['start']();
				}
				
			});
			//手指移动
			navWrap.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				
				if(!isFirst){
					return;
				};
				
				//手指结束位置
				var endY = touch.clientY;
				var endX = touch.clientX;
				//手指距离差
				var disY = endY - startY;
				var disX = endX - startX;
				
				//范围限定 --- 橡皮筋：越来越难拖效果
				var lastY = disY+eleY;
				if(lastY > 0){
					//比例：逐渐减小
					// scale = 1 - lastY/375
					//scale = 1 - 左边留白/屏幕宽
					var scale = 0.6 - lastY/(document.documentElement.clientHeight*3.5);
//					console.log(scale)
					
					//lastY（左边留白） 整体是增加的，但是每一次增加的幅度在减小
					//lastY = 左边临界值0基础上产生 + 之前左边留白*比例
					lastY = 0 + lastY*scale;
//					console.log('现在的lastY= '+lastY)
							//4.8       4.667      4.53
					//(5,4.933) (10,9.733) (15,14.4) (20,18.93)
				}else if(lastY < document.documentElement.clientHeight-navList.offsetHeight){
					//比例：逐渐减小（正值）					
					//右边留白 = lastY（正值） - 右边临界值（正值）
					var right = Math.abs(lastY)-Math.abs(document.documentElement.clientHeight-navList.offsetHeight)
					//scale = 1 - 右边留白/屏幕宽
					var scale = 0.6 - right/(document.documentElement.clientHeight*3.5);
					
					//右边留白整体是增加的，但是每一次增加的幅度在减小
					//lastY = 右边临界值基础上产生 + 之前左边留白*比例
					lastY = document.documentElement.clientHeight-navList.offsetHeight - right*scale;
				}
				
				//防抖动
				if(Math.abs(disX) > Math.abs(disY)){
					isFirst = false;
					return;
				}
				
				
				//确定元素最终位置
				transformCss(navList,'translateY',lastY);
//				console.log('lastY = '+lastY)
				
				//加速：元素结束位置与结束时间
				s2 = lastY;
				t2 = new Date().getTime();
				//距离差
				disS = s2 - s1;
				//时间差
				disT = t2 - t1;
				
				//检测touchmove状态 + 加速状态
				if(callback&& typeof callback['move'] === 'function'){
					callback['move']();
				}
				
			});
			//加速，回弹
			navWrap.addEventListener('touchend',function(){
				//速度 = 距离差/时间差
				var speed = disS/disT;
//				console.log('speed='+speed)
				
				//目标位置 = touchmove产生的位移值 + 速度产生位移值
				var target = transformCss(navList,'translateY')+speed*100;
//				console.log('translateY = '+transformCss(navList,'translateY'))
//				console.log('target = '+target)

				var type = 'Linear';
				//回弹
				if(target > 0){
					type = 'easeOut'
					target = 0					
				}else if(target < document.documentElement.clientHeight-navList.offsetHeight){
					type = 'easeOut'
					target = document.documentElement.clientHeight-navList.offsetHeight;
				};
				
				//总时间
				var timeAll = 1;
				//加速 ，回弹 ，过渡效果（模拟）
				//模拟过渡效果，使用tween算法
				TweenMove(target,timeAll,type);
				
				
			});
			
			function TweenMove(target,timeAll,type){
				//t:当前次数(起始值是1)
				var t = 0;
				//b:元素的起始位置
				var b = transformCss(navList,'translateY');
//				console.log('b = '+b)
				//c:元素的结束位置与起始位置的距离差
				var c = target - b;
//				console.log('c = '+c)
				//d:总次数 = 总时间/一次的时间
				var d =timeAll/0.02;
				
				//清除定时器，目的：防止重复开启定时器
				clearInterval(timer)
				timer = setInterval(function(){
					t++;
					if(t > d){
						//清除定时器
						clearInterval(timer);
						//检测元素停止的状态
						if(callback&& typeof callback['end'] === 'function'){
							callback['end']();
						}
					}else{
						//加速与回弹
						//元素正常走的语句
						var point = Tween[type](t,b,c,d);
//						console.log('point = '+point)
						transformCss(navList,'translateY',point);
						
						//检测touchmove状态 + 加速状态
						if(callback&& typeof callback['move'] === 'function'){
							callback['move']();
						}
				
					}
					
					
				},20);
					
					
			};
			
		};
		
})(window);
