/**
 * Created by asforever on 2016/5/4.
 */
var createLabel=function(editor,viewport,camera,mesh,point,hasLabel){
    var projector=new THREE.Projector();
    var label;
    var label2d;
    var createSprite=function(hasLabel){

        if(hasLabel!=undefined) return hasLabel;
        var map = new THREE.TextureLoader().load( "image/label.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
        var sprite=new THREE.Sprite(material);
        sprite.cssType="standard";
        sprite.enableLine=false;
        sprite.lineHeight=50;
        sprite.title="";
        sprite.cameraPosition=undefined;

        return sprite;
    };

    var createList=function(editor,label){
        var list=new UI.Panel();
        list.setClass("listOfObject3D");
        list.setTextContent(label.uuid);
        list.setId(label.uuid);
        list.dom.style.height="16px";
        document.getElementById("labelContent").appendChild(list.dom);
        list.onClick(function(){

            $(list.dom).addClass("selected");
            editor.select(label);
        });
        list.dom.ondblclick=function(e){

            e.preventDefault();
            updateLabelCamera(editor.labels[this.id],true);


        };
    };
    var drawLine=function(){
        var lineDiv=document.createElement("canvas");
        lineDiv.className="label2dCanvas";
        lineDiv.style.display="none";
        lineDiv.style.height="50px";
        lineDiv.style.width="100px";
        var lineContext = lineDiv.getContext( '2d' );
        lineContext.strokeStyle = "blue";
        lineContext.lineWidth = 3;
        lineContext.beginPath();
        lineContext.moveTo(0,150);
        lineContext.lineTo(300,0);
        lineContext.stroke();
        return lineDiv;
    };

    var create2DLabel=function(){
        var label2d=new UI.Panel();
        label2d.setClass("label2d");
        var labelBody=new UI.createDiv('labelBody',label2d);
        var labelBodyI=new UI.createDiv('',labelBody,"请输入内容","t");
        label2d.dom.appendChild( new drawLine());
        return label2d;
    }
    var merge=function(){
        label2d=create2DLabel();
        label=createSprite(hasLabel);

        var distance=point.distanceTo(camera.position);
        var realy=new THREE.Vector3(camera.position.x/distance,camera.position.y/distance,camera.position.z/distance);
        if(hasLabel==undefined)label.position.copy(new THREE.Vector3().copy(point).add(realy).sub(mesh.getWorldPosition()));
        label2d.setId(label.uuid+"V");
       //var position=sprite.getWorldPosition();

        projector.projectVector(point,camera);
        var left = ( point.x + 1) / 2 * viewport.offsetWidth;
        var top = ( -point.y + 1) / 2 * viewport.offsetHeight;
        label2d.dom.style.top=top+"px";
        label2d.dom.style.left=left+"px";


    };
    merge();

    return (function(){
        if(hasLabel==undefined) mesh.add(label);
        viewport.appendChild(label2d.dom);
        editor.labels[label.uuid]=label;
        createList(editor,label);
        editor.signals.addLabel.dispatch(label);
    })();

};
var removeLabel=function(editor,label,viewport){
    delete editor.selected[label.uuid];
    delete editor.labels[label.uuid];
    editor.signals.removeLabel.dispatch(label);
    document.getElementById("viewport").removeChild(document.getElementById(label.uuid+"V"));
    document.getElementById("labelContent").removeChild(document.getElementById(label.uuid));
    editor.removeObject(label);

};
var updateLabelCamera=function(label,bool){

    if(editor.labels.hasOwnProperty(  label.uuid)){

            if(label.cameraPosition){
                editor.camera.position.x=  label.cameraPosition.PX;
                editor.camera.position.y=  label.cameraPosition.PY;
                editor.camera.position.z=  label.cameraPosition.PZ;
                editor.controls.target.x=  label.cameraPosition.TX;
                editor.controls.target.y=  label.cameraPosition.TY;
                editor.controls.target.z=  label.cameraPosition.TZ;
                editor.controls.update();

            }

        }


};
var updateLabelsAtt=function (parameters){
    var obj=parameters.obj;
    if(parameters.cssType!==undefined){
        if(parameters.cssType=="standard"){
            $(".label2d > div").css("height",17+"px");
        }else if(parameters.cssType=="leval"){
            $(".label2d > div").css("height",100+"px");
        }
        obj.cssType=parameters.cssType;

    }
    if(parameters.enableLine!==undefined)obj.enableLine=parameters.enableLine;
    if(parameters.lineHeight!==undefined){
        obj.lineHeight=parameters.lineHeight;
        $(".label2d canvas").css("height",parameters.lineHeight+"px");
        $(".label2d canvas").css("width",2*parameters.lineHeight+"px");
    }
    if(parameters.title!==undefined){
        obj.title=parameters.title;
        document.getElementById(obj.uuid+"V").children[0].children[0].value=parameters.title;
    }
    if(parameters.cameraPosition!==undefined)obj.cameraPosition=parameters.cameraPosition;
};
var updateNowPosition=function(editor,obj){
   // var labels=editor.labels;
    var viewport=document.getElementById("viewport");
    var projector=new THREE.Projector();
   // for(var i in labels){
        var point=obj.getWorldPosition();
        var point2d=new THREE.Vector3().copy(point);
        projector.projectVector(point2d,editor.camera);

        updateLabelPosition(obj,viewport,point,point2d)
    //}
};
var updateLabelPosition=function(obj,viewport,point,point2d){

    var cssType= obj.cssType;
    var children= document.getElementById(obj.uuid+"V");
    var enableLine= obj.enableLine;
    var lineHeight= obj.lineHeight;
    var cameraPosition= obj.cameraPosition;
    obj.position.copy(new THREE.Vector3().copy(point).sub(obj.parent.getWorldPosition()));

    var left = ( point2d.x + 1) / 2 * viewport.offsetWidth;
    var top = ( -point2d.y + 1) / 2 * viewport.offsetHeight;


    var topDiv=20;
    var levalTop=0;
    if(enableLine){

        topDiv+=lineHeight+20;
        children.children[0].style.marginLeft = 2*lineHeight+"px";
        if(enableLine)$(".label2d canvas").css("display","block");


    }else{
        children.children[0].style.marginLeft = 0+"px";
        levalTop=-20;
    }

    if(cssType=="standard"){
        children.style.left = left + 5 + "px";
        children.style.top = top -topDiv+ "px";
    }else if(cssType=="leval"){

        children.style.left = left + 5 + "px";
        children.style.top = top -topDiv-83+levalTop+ "px";
    }



};