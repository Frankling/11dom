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
        sprite.display="block";
        sprite.lineHeight=50;
        sprite.title="";
        sprite.cameraPosition=undefined;
        sprite.ROrL="R";

        return sprite;
    };

    var createList=function(editor,label){
        var list=new UI.Panel();
        list.setClass("listOfObject3D");
        //list.setTextContent(label.uuid);
        list.setId(label.uuid);
        list.dom.style.height="16px";


        var child1=new UI.createDiv("labelListC1",list);
        child1.setTextContent(label.uuid);
        var child2=new UI.createDiv("objListEye",list);



        document.getElementById("labelContent").appendChild(list.dom);

        child2.onClick(function(){
            var id=this.dom.parentNode.id;
            var div=document.getElementById(id+"V");
            var labels=editor.labels;
            var vie=div.style.display;


            if(vie=="block"){
                updateLabelsAtt({obj:labels[id],display:"none"});
                console.log(div);
                div.style.display="none";
                this.dom.style.backgroundImage="url('image/eyeOpen.png')";

            }else{
                updateLabelsAtt({obj:labels[id],display:"block"});
                div.style.display="block";
                this.dom.style.backgroundImage="url('image/eyeClose.png')";
            }
        });

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
        lineDiv.height="50";
        lineDiv.width="100";
        var lineContext = lineDiv.getContext( '2d' );
        lineContext.strokeStyle = "#000000";
        lineContext.lineWidth = 1;
        lineContext.beginPath();
        lineContext.moveTo(50,50);
        lineContext.lineTo(100,0);
        lineContext.stroke();
        return lineDiv;
    };



    var create2DLabel=function(){
        var label2d=new UI.Panel();
        label2d.setClass("label2d");
        label2d.dom.style.display="block";
        var labelBody=new UI.createDiv('labelBody',label2d);
        var labelBodyI=new UI.createDiv('',labelBody,"请输入内容","t");
        label2d.dom.appendChild( new drawLine());


        return label2d;
    }
    var merge=function(){
        label2d=create2DLabel();
        label=createSprite(hasLabel);

        var distance=point.distanceTo(camera.position);
        var realy=new THREE.Vector3(camera.position.x/distance/3,camera.position.y/distance/3,camera.position.z/distance/3);
        if(hasLabel==undefined)label.position.copy(new THREE.Vector3().copy(point).add(realy).sub(mesh.getWorldPosition()));
        label2d.setId(label.uuid+"V");
        label2d.onClick(function(){
            var id=this.dom.id;
            editor.select(label);
        });

        $(label2d.dom.children[0].children[0]).on("input change",function(){

            var value=this.value;
            var id=label2d.dom.id;
            var l=id.length-1;
            var str=id.substring(0,l);
            console.log(id)
            updateLabelsAtt({
                obj:editor.labels[str],
                title:value
            });
        });

     // projector.projectVector(point,camera);
     // var left = ( point.x + 1) / 2 * viewport.offsetWidth;
     // var top = ( -point.y + 1) / 2 * viewport.offsetHeight;
     // label2d.dom.style.top=top+"px";
     // label2d.dom.style.left=left+"px";


    };
    merge();

    return (function(){
        if(hasLabel==undefined) mesh.add(label);

        viewport.appendChild(label2d.dom);
        editor.labels[label.uuid]=label;
        var ances=getAnces(editor,label);
        var center=editor.getCenter(ances);
       //projector.projectVector(center,camera);

        if(center.x>point.x){
            updateLabelsAtt({  obj:label,ROrL:"L"})
        }
        createList(editor,label);
        updateNowPosition(editor,label);
        editor.signals.addLabel.dispatch(label);
      //  updateScale(editor,label,point);
    })();

};
var getAnces=function(editor,obj){
    var ances;
    obj.traverseAncestors(function(parent){
        if(parent.parent==editor.scene){
            ances=parent;
            return false;
        }
    });
    return ances;
};
var removeLabel=function(editor,label,viewport){
    delete editor.selected[label.uuid];
    delete editor.labels[label.uuid];
    editor.signals.removeLabel.dispatch(label);
    document.getElementById("viewport").removeChild(document.getElementById(label.uuid+"V"));
    document.getElementById("labelContent").removeChild(document.getElementById(label.uuid));
    editor.removeObject(label);

};
var updateCanvas=function(canvas,dir){
    var lineContext=canvas.getContext("2d");
    lineContext.strokeStyle = "#000000";
    lineContext.clearRect(0,0,300,300);
    lineContext.lineWidth = 1;
    lineContext.beginPath();
    if(dir="L"){
        lineContext.moveTo(0,0);
        lineContext.lineTo(50,50);
    }else{
        lineContext.moveTo(50,50);
        lineContext.lineTo(100,0);
    }

    lineContext.stroke();
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

    if(parameters.display!==undefined) {
        obj.display=parameters.display;
        var div=document.getElementById(obj.uuid+"V");
        if(parameters.display=="block"){
            div.style.display="block";

        }else{
            div.style.display="none";
            document.getElementById(obj.uuid).children[1].style.backgroundImage="url('image/eyeOpen.png')";
        }
    }

    if(parameters.enableLine!==undefined)obj.enableLine=parameters.enableLine;
    if(parameters.lineHeight!==undefined){
        obj.lineHeight=parameters.lineHeight;
        $(".label2d canvas").css("height",parameters.lineHeight+"px");
        $(".label2d canvas").css("width",4*parameters.lineHeight+"px");
        $(".label2d canvas").css("margin-left",-2*parameters.lineHeight+"px");
    }
    if(parameters.title!==undefined){
        obj.title=parameters.title;
        document.getElementById(obj.uuid+"V").children[0].children[0].value=parameters.title;
    }
    if(!obj.hasOwnProperty("cameraPosition")){
        obj.cameraPosition=undefined;
    }
    if(parameters.cameraPosition!==undefined)obj.cameraPosition=parameters.cameraPosition;
    if(parameters.ROrL!==undefined){
        obj.ROrL=(parameters.ROrL);
        updateCanvas(document.getElementById(obj.uuid+"V").children[1],parameters.ROrL)
    }
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
var updateScale=function(editor,obj,point){
    var labels=editor.labels;
    for(var i in labels){
        var distance=point.distanceTo(editor.camera.position);
        labels[i].scale.x=labels[i].scale.y=labels[i].scale.z=distance/100;
    }
};
var updateLabelPosition=function(obj,viewport,point,point2d){

    var ROrL=obj.ROrL;
    var cssType= obj.cssType;
    var children= document.getElementById(obj.uuid+"V");
    var enableLine= obj.enableLine;
    var lineHeight= enableLine?obj.lineHeight:0;
    var cameraPosition= obj.cameraPosition;
    obj.position.copy(new THREE.Vector3().copy(point).sub(obj.parent.getWorldPosition()));
    updateScale(editor,obj,point);

    var ROrLValue=obj.ROrL=="R"?0:-(4*lineHeight+210);

    var left = ( point2d.x + 1) / 2 * viewport.offsetWidth;
    var top = ( -point2d.y + 1) / 2 * viewport.offsetHeight;


    var topDiv=20;
    var levalTop=0;
    children.children[0].style.marginLeft =2*lineHeight+ROrLValue+"px";
    if(enableLine){
        topDiv+=lineHeight+20;
        if(enableLine)$(".label2d canvas").css("display","block");
    }else{
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