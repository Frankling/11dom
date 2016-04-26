/**
 * Created by asforever on 2016/3/8.
 */


//存储，IE6~7 cookie 其他浏览器HTML5本地存储
document.getElementById("show2").onchange=function(){
    var arrDisplay =nicai1;
    console.log( arrDisplay)

    if (window.localStorage) {
        window.localStorage.setItem("menuTitle", arrDisplay);
    } else {
        Cookie.write("menuTitle", arrDisplay);
    }
}


