/**
 * Created by DELL on 2016/1/8.
 */
var Lib= function ( editor ) {
    //选中的物体加fur材质；判断是否mesh或者递归；
    var furload=function(obj){

        if(obj instanceof THREE.Mesh ){

              editor.loadShaders.load("fur",obj,50);
            //editor.removeObject(obj)
        }else{
            for(var j=0;j<obj.children.length;j++){

                furload(obj.children[0]);
            }
        }
    };
    var material={m1:["fur"],m2:["flower"],m3:"",m4:"",m5:"",m6:""};

    var image={i1:0,i2:1,i3:2,i4:3};
    var object={
        o1:["model/obj/port.obj","model/obj/BMW7.mtl"],
        o2: ["model/obj/BMW7.obj","model/obj/BMW7.mtl"],
        o3: ["model/obj/squ.obj","model/obj/BMW7.mtl"],
        o4: ["model/obj/animation.obj","model/obj/BMW7.mtl"]};
    var sky={s1:[],s2:1,s3:2,s4:3};

    var signals=editor.signals;
    var container = new UI.Panel();
    container.setId("lib");

    var visButton = new UI.Panel();
    visButton.setClass( 'visButton' );
    visButton.dom.innerHTML="open";
    container.add( visButton );

    var options = new UI.Panel();
    options.setClass( 'options' );

    container.add( options );
    visButton.onClick(function(){

        if( visButton.dom.innerHTML=="open"){
            visButton.dom.innerHTML="close";
        }else{

            visButton.dom.innerHTML="open";
        }
        $(".options").toggle();
    });


    var libHeader = new UI.Panel();
    libHeader.setClass( 'libHeader' );
    options.add( libHeader );

    var libBody = new UI.Panel();
    libBody.setClass( 'libBody' );
    options.add( libBody);

    var bodyButton =function(name) {
        var a = new UI.Panel();
        a.setClass('bodyButton');
        container.add(a);

        var  h = new UI.Panel();
        h.setClass(' bodyButtonH');
        if(name!=undefined)   var _name = name.split( '/' ).pop().toLowerCase();
        h.setTextContent(_name);
        a.add( h);

        var b = new UI.Panel();
        b.setClass('bodyButtonB');
        a.add(b);

        return a;
    }


    var bodyContent=function(id,obj){
        var a = new UI.Panel();
        a.setClass( 'bodyContent' );
        a.dom.id=id;
        for(var i in obj){
            var b = new bodyButton(obj[i][0]);
            b.Obj=obj[i];
            b.onClick(function(){
                var scope=this;
                if(this.dom.parentNode.id=="materialLib"){
                    switch (this.dom.children[0].innerHTML){
                        case "fur":
                            for(var i in editor.selected){
                                furload(editor.selected[i]);
                            }
                    }

                }else if(this.dom.parentNode.id=="objectLib"){
                    editor.pathImport.loadFile(this.Obj[0],this.Obj[1]);
                }else if(this.dom.parentNode.id=="skyLib"){

                }

            });
            a.add(b);
        }
        return a;
    };

    libBody.add( new bodyContent("materialLib",material) );
    libBody.add( new bodyContent("imageLib",image) );
    libBody.add( new bodyContent("objectLib",object) );
    libBody.add( new bodyContent("skyLib",sky) );

    var searchText = new UI.Panel();
    searchText.setTextContent("搜索");
    searchText.setClass( 'searchText' );
    libHeader.add( searchText );

    var searchBar= new UI.Input();
    searchBar.setValue(" ");
    searchBar.setClass( 'searchBar' );
    searchBar.dom.onchange=function(){
        var a=document.getElementsByClassName("bodyButtonH");
        var value=this.value;
        for(var i=0;i< a.length;i++){

            if(a[i].innerHTML.indexOf(value)!=-1&&value!=""){
                a[i].parentNode.style.display="block";
            }else{
                if(value=="") {
                    a[i].parentNode.style.display="block";
                }else{
                    a[i].parentNode.style.display="none";
                }

            }
        }
    };
    libHeader.add( searchBar );

    var libName= new UI.Panel();
    libName.setClass( 'libName' );
    libHeader.add( libName );

    var libType=function(text,id){
        var all= new UI.Panel();
        all.setClass( 'libType' );
        all.setTextContent(text);

        all.onClick(function(){
            var cn=libBody.dom.childNodes;
            for(var i=0;i<cn.length;i++){
                if(id==undefined){
                    cn[i].style.display="block";
                }else{
                    cn[i].style.display="none";
                }
            }
            if(id!==undefined) document.getElementById(id).style.display="block";
        });
        return all;
    }
    libName.add( new libType("全部") );
    libName.add( new libType("材质盒","materialLib") );
    libName.add( new libType("贴图盒","imageLib") );
    libName.add( new libType("物体盒","objectLib") );
    libName.add( new libType("天空盒","skyLib") );


    $(".panel-close,.title").bind("click",function(){

        var _div=$(".side_panel");
        options.dom.style.left = 50 + "px";
        var viewport=document.getElementById("viewport");
        viewport.style.left=50+"px";
        for(var i=0; i<_div.length;i++){
            if($(".side_panel").eq(i).css("display")=="block"){

                viewport.style.left=(350)+"px";
                options.dom.style.left =50 + "px";
                break;
            }
        }
        editor.signals.windowResize.dispatch();
    });

    return container;

};