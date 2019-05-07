//class操作函数
function addClass(node,className){
    var reg=new RegExp("\\b"+className+"\\b");
    if(!reg.test(node.className)){
        node.className +=(" "+className);
    }
}
function removeClass(node,className){
    var reg=new RegExp("\\b"+className+"\\b");
    var classes = node.className;
    node.className=classes.replace(reg,"");
}
