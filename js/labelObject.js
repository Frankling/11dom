/**
 * Created by asforever on 2016/5/4.
 */
var labelObject=function(editor){
    var scope=this;
    var projector=new THREE.Projector();
    var control=editor.controls;
    var camera=editor.camera;
    var viewport=document.getElementById("viewport");
    var labelContent=document.getElementById("labelContent");
    var mul=function(v1,v2){
        var fz=v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;
        var fm=Math.sqrt(v1.x*v1.x+v1.y*v1.y+v1.z*v1.z)*Math.sqrt(v2.x*v2.x+v2.y*v2.y+v2.z*v2.z);
        if(fm==0){fm=1}
        var end=fz/fm;
        return end;
    };
    var updateCV=function(){
        control=editor.controls;
        viewport=document.getElementById("viewport");
        labelContent=document.getElementById("labelContent");
    };
    var GetLength = function(str) {
        var realLength = 0;
        for (var i = 0; i < str.length; i++)
        {
        var charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
        realLength += 1;
        else
        realLength += 2;
        }
        return realLength;
     };
   this.createLabel=function(mesh,point,hasLabel,normal){
        updateCV();
       var labelObject3D;


        var plane=new THREE.Mesh(new THREE.PlaneGeometry(100,100,100),new THREE.MeshBasicMaterial({color:0x123456,side:2,visible:false}));
        var label;
        var line;
        var spriteContent;
        var createSprite=function(){

            var map = new THREE.TextureLoader().load( "image/label.png" );
            var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
            var sprite=new THREE.Sprite(material);


            // sprite.cssType="standard";
            //sprite.enableLine=true;
            // sprite.display="block";
            // sprite.lineHeight=10;

            // sprite.ROrL="R";

            return sprite;
        };
        var createLine=function(){

            var geo=new THREE.Geometry();
            geo.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0.1,0.1,0.1));
            var mat=new THREE.LineBasicMaterial({color:0x00FFFF});
            var line=new THREE.Line(geo,mat);
            return line;
        };
        var createContent=function(){

            var label2d=new UI.Panel();
            label2d.setClass("label2d");
            label2d.dom.style.display="block";
            var labelBody=new UI.createDiv('labelBody',label2d);
            var labelBodyI=new UI.createDiv('',labelBody,"请输入内容","t");
            $(labelBodyI.dom).on("input change",function(){
                this.value=this.value.substring(0,15);
                var id=label2d.dom.id;
                var title=this.value;
                var l = id.length;
                var uuid=id.substring(0,l-1);
                var labels=editor.labels;
                for(var i in labels){
                    if(i==uuid){
                        scope.updateLabelsAtt({
                                obj: labels[i].children[0],
                                title: title
                            }
                        )
                    }
                }

               //var selected=editor.selected;
               //var labels=editor.labels;
               //for(var i in selected){
               //    if(labels.hasOwnProperty( i)){

               //        labelObject.updateLabelsAtt({
               //            obj:labels[i],
               //            title:this.value,
               //        });
               //    }

               //}
            });

            return label2d.dom;

        };
        var createList=function(){
            var list=new UI.Panel();
            list.setClass("listOfObject3D");
            //list.setTextContent(label.uuid);
            list.setId(label.uuid);
            list.dom.style.height="16px";
            var child1=new UI.createDiv("labelListC1",list);
            child1.setTextContent(label.uuid);
          //  var child2=new UI.createDiv("objListEye",list);



            labelContent.appendChild(list.dom);

          /*  child2.onClick(function(){
                var id=this.dom.parentNode.id;
                var div=document.getElementById(id+"V");
                var labels=editor.labels;
                var vie=div.style.display;


                if(vie=="block"){
                    // updateLabelsAtt({obj:labels[id],display:"none"});
                    // console.log(div);
                    // div.style.display="none";
                    this.dom.style.backgroundImage="url('image/eyeOpen.png')";

                }else{
                    // updateLabelsAtt({obj:labels[id],display:"block"});
                    // div.style.display="block";
                    this.dom.style.backgroundImage="url('image/eyeClose.png')";
                }
            });*/

            list.onClick(function(e){

                $(list.dom).addClass("selected");
                editor.select(label);
            });
            list.dom.ondblclick=function(e){

                e.preventDefault();

                scope.updateLabelCamera(editor.labels[this.id].children[0]);
            };
        };
        var moveFun=function(e){

            var intersects=editor.getIntersects(e,[plane]);
            if(intersects.length>0){

                var position=intersects[0].point.sub(labelObject3D.getWorldPosition());
                line.geometry.vertices[1].copy(position);
                line.geometry.verticesNeedUpdate=true;
                editor.signals.sceneGraphChanged.dispatch();
            }
        };
        var upFun=function(e){
            viewport.removeEventListener("mousemove",moveFun,false);
            viewport.removeEventListener("mouseup",upFun,false);

            viewport.appendChild(spriteContent);
            //var p=new THREE.Vector3().copy(line.geometry.vertices[1]).add(labelObject3D.getWorldPosition());
            //var pC= new THREE.Vector3().copy(p);
            //projector.projectVector( pC,camera);
            scope.updateNowPosition(labelObject3D);

            control.enabled=true;
            createList();
            labelObject3D.remove(plane);
            editor.labels[label.uuid]=labelObject3D;
            editor.signals.addLabel.dispatch(label);
            plane.material.dispose();
            plane.geometry.dispose();

        };
       if(hasLabel==undefined){
           labelObject3D=new THREE.Object3D();
           label=createSprite(hasLabel);
           line=createLine(hasLabel);
           labelObject3D.add(label,line,plane);
           mesh.add(labelObject3D);
           labelObject3D.position.copy(point);
       }else{
           labelObject3D=hasLabel.parent;
           label=hasLabel;
           line=hasLabel.parent.children[1];
       }
        label.title="请输入内容";
        label.cameraPosition=undefined;
        label.normal=normal;
        spriteContent=createContent();
        spriteContent.id=label.uuid+"V";


        //  testBox.position.copy(line.geometry.vertices[0]);

        plane.lookAt(normal);
        plane.rotation.y+=90*Math.PI/180;
        plane.position.copy(line.geometry.vertices[0]);

        control.enabled=false

        viewport.addEventListener("mousemove",moveFun,false);
        viewport.addEventListener("mouseup",upFun,false);
       if(hasLabel!==undefined)upFun();

        editor.signals.sceneGraphChanged.dispatch();

    };
   this.removeLabel=function(editor,label,viewport){
        var c=label;
        delete editor.selected[c.uuid];
        delete editor.labels[c.uuid];
        editor.signals.removeLabel.dispatch(c);
        viewport.removeChild(document.getElementById(c.uuid+"V"));
        labelContent.removeChild(document.getElementById(c.uuid));
        editor.removeObject(label.parent);

    };
   this.updateNowPosition=function(objParent){
        // var labels=editor.labels;

        var viewport=document.getElementById("viewport");
        var projector=new THREE.Projector();
        var point=(new THREE.Vector3().copy(objParent.children[1].geometry.vertices[1])).add(objParent.getWorldPosition());
        var point2d=new THREE.Vector3().copy(point);
        projector.projectVector(point2d,editor.camera);
        var obj=objParent.children[0];
        scope.updateLabelPosition(obj,point,point2d);

    };
   this.updateLabelPosition=function(obj,point,point2d){
        scope.updateScale(obj,point);
        var children= document.getElementById(obj.uuid+"V");
        var lineGeo=obj.parent.children[1].geometry;
        var v0=new THREE.Vector3().copy(lineGeo.vertices[0]);
        var v1=new THREE.Vector3().copy(lineGeo.vertices[1]);
        var leftSl=parseInt(children.offsetWidth);
        var leftOffset=0;
        var topOffset=0;
        projector.projectVector(v0,camera);
        projector.projectVector(v1,camera);
       console.log(children.offsetWidth);
        if(v0.x>v1.x) leftOffset=-leftSl;
        if(v0.y<v1.y) topOffset=-40;


        var ca=camera.position;
        var co=control.target;
        var vcc=new THREE.Vector3(ca.x-co.x,ca.y-co.y,ca.z-co.z);
        var normal=new THREE.Vector3().copy(obj.normal);
        // var tempMatrix=new THREE.Matrix4();
        // normal.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(obj.parent.parent.matrixWorld)));

        if(mul(normal,vcc)>0){
            obj.parent.visible=true;
            children.style.display="block";
        }else{
            obj.parent.visible=false;
            children.style.display="none";
        }
        var left = ( point2d.x + 1) / 2 * viewport.offsetWidth;
        var top = ( -point2d.y + 1) / 2 * viewport.offsetHeight;
        children.style.left = left+leftOffset  + "px";
        children.style.top = top+topOffset+ "px";

    };
    this.updateScale=function(obj,point){

        var distance=point.distanceTo(camera.position);
        obj.scale.x=obj.scale.y=obj.scale.z=distance/200;
    }
   this.updateLabelCamera=function(label){

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
   this.updateLabelsAtt=function (parameters){
        var obj=parameters.obj;
       /* var geo=obj.parent.children[1].geometry;
*/
        /*if(parameters.cssType!==undefined){
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
//--

        if(parameters.enableLine===true){
            obj.enableLine=true;

            geo.vertices[1].x=geo.vertices[1].y=geo.vertices[1].z=10;
            geo.verticesNeedUpdate=true;
            obj.lineHeight=10;


        }else if(parameters.enableLine===false){
            obj.enableLine=false;
            geo.vertices[1].x=geo.vertices[1].y=geo.vertices[1].z=0;
            geo.verticesNeedUpdate=true;
            obj.lineHeight=0;

        }
        if(parameters.lineHeight!==undefined&&obj.enableLine===true){
            var multiple=parameters.lineHeight/obj.lineHeight;
            geo.vertices[1]=new THREE.Vector3( geo.vertices[1].x*multiple,geo.vertices[1].y*multiple,geo.vertices[1].z*multiple);
            geo.verticesNeedUpdate=true;
            obj.lineHeight=parameters.lineHeight;
        }


        //end

         */

        if(parameters.normal!==undefined){

            obj.normal=parameters.normal;
        }
        if(parameters.title!==undefined){
            var l=GetLength(parameters.title);
            document.getElementById(obj.uuid+"V").children[0].children[0].style.width=l*7+8+"px";
            obj.title=parameters.title;

            var childT=document.getElementById(obj.uuid+"V").children[0].children[0];
            //
            childT.value=parameters.title;
            // childT.style.width=l*8+"px";

        }
        /*if(!obj.hasOwnProperty("cameraPosition")){
            obj.cameraPosition=undefined;
        }*/
        if(parameters.cameraPosition!==undefined) obj.cameraPosition=parameters.cameraPosition;
      /*  if(parameters.ROrL!==undefined){
            obj.ROrL=(parameters.ROrL);
            updateCanvas(document.getElementById(obj.uuid+"V").children[1],parameters.ROrL)
        }*/
        editor.signals.sceneGraphChanged.dispatch();
    };
}
/*var createLabel=function(editor,viewport,camera,mesh,point,hasLabel,normal){
    var control=editor.controls;
    control.enabled=false;
    var projector=new THREE.Projector();
    var labelObject3D=new THREE.Object3D();
    var plane=new THREE.Mesh(new THREE.PlaneGeometry(100,100,100),new THREE.MeshBasicMaterial({color:0x123456,side:2,visible:false}));

   // var testBox=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({visible:true}));


    var label;
    var line;
    var spriteContent;
    var createSprite=function(hasLabel){

        if(hasLabel!=undefined) return hasLabel;
        var map = new THREE.TextureLoader().load( "image/label.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
        var sprite=new THREE.Sprite(material);

        sprite.normal=normal;
       // sprite.cssType="standard";
        //sprite.enableLine=true;
       // sprite.display="block";
       // sprite.lineHeight=10;
        sprite.title="请输入内容";
       // sprite.cameraPosition=undefined;
       // sprite.ROrL="R";

        return sprite;
    };
    var createLine=function(){
       var geo=new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(0.1,0.1,0.1));
        var mat=new THREE.LineBasicMaterial();
        var line=new THREE.Line(geo,mat);
        return line;
    };
    var createContent=function(){

        var label2d=new UI.Panel();
        label2d.setClass("label2d");
        label2d.dom.style.display="block";
        var labelBody=new UI.createDiv('labelBody',label2d);
        var labelBodyI=new UI.createDiv('',labelBody,"请输入内容","t");

        return label2d.dom;

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
               // updateLabelsAtt({obj:labels[id],display:"none"});
               // console.log(div);
               // div.style.display="none";
                this.dom.style.backgroundImage="url('image/eyeOpen.png')";

            }else{
               // updateLabelsAtt({obj:labels[id],display:"block"});
               // div.style.display="block";
                this.dom.style.backgroundImage="url('image/eyeClose.png')";
            }
        });

        list.onClick(function(){

            $(list.dom).addClass("selected");
            editor.select(label);
        });
        list.dom.ondblclick=function(e){

            e.preventDefault();
           // updateLabelCamera(editor.labels[this.id],true);
        };
    };
    var moveFun=function(e){
        var intersects=editor.getIntersects(e,[plane]);
        if(intersects.length>0){
            console.log(1);
            var position=intersects[0].point.sub(labelObject3D.getWorldPosition());
            line.geometry.vertices[1].copy(position);
            line.geometry.verticesNeedUpdate=true;
            editor.signals.sceneGraphChanged.dispatch();
        }
    };
    var upFun=function(e){
        viewport.removeEventListener("mousemove",moveFun,false);
        viewport.removeEventListener("mouseup",upFun,false);

        viewport.appendChild(spriteContent);
       //var p=new THREE.Vector3().copy(line.geometry.vertices[1]).add(labelObject3D.getWorldPosition());
       //var pC= new THREE.Vector3().copy(p);
       //projector.projectVector( pC,camera);
        updateNowPosition(editor,labelObject3D);

        control.enabled=true;
        createList(editor,label);
        labelObject3D.remove(plane);
        editor.labels[label.uuid]=labelObject3D;
        editor.signals.addLabel.dispatch(label);
        plane.material.dispose();
        plane.geometry.dispose();
    };

    return (function(){
        label=createSprite(hasLabel);
        line=createLine();
        spriteContent=createContent();
        spriteContent.id=label.uuid+"V";

        labelObject3D.add(label,line,plane);

        if(hasLabel==undefined) mesh.add(labelObject3D);
        labelObject3D.position.copy(point);
      //  testBox.position.copy(line.geometry.vertices[0]);
        plane.lookAt(normal);
        plane.rotation.y+=90*Math.PI/180;
        plane.position.copy(line.geometry.vertices[0]);
        viewport.addEventListener("mousemove",moveFun,false);
        viewport.addEventListener("mouseup",upFun,false);

        editor.signals.sceneGraphChanged.dispatch();
      //  var ances=getAnces(editor,label);
      //  var center=editor.getCenter(ances);
      // //projector.projectVector(center,camera);
//
      //  if(center.x>point.x){
      //      updateLabelsAtt({  obj:label,ROrL:"L"})
      //  }
       // createList(editor,label);
       // updateNowPosition(editor,label);
       // editor.signals.addLabel.dispatch(label);
      //  updateScale(editor,label,point);
    })();

};*/
/*var getAnces=function(editor,obj){
    var ances;
    obj.traverseAncestors(function(parent){
        if(parent.parent==editor.scene){
            ances=parent;
            return false;
        }
    });
    return ances;
};*/
/*var removeLabel=function(editor,label,viewport){
    var c=label.children[0]
    delete editor.selected[c.uuid];
    delete editor.labels[c.uuid];
    editor.signals.removeLabel.dispatch(c);
    document.getElementById("viewport").removeChild(document.getElementById(c.uuid+"V"));
    document.getElementById("labelContent").removeChild(document.getElementById(c.uuid));
    editor.removeObject(label);

};*/
/*var updateCanvas=function(canvas,dir){
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
};*/
/*var updateLabelCamera=function(label,bool){

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


};*/
/*var GetLength = function(str) {
    var realLength = 0;
    for (var i = 0; i < str.length; i++)
    {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else
            realLength += 2;
    }
    return realLength;
}*/
/*var updateLabelsAtt=function (parameters){
    var obj=parameters.obj;
    var geo=obj.parent.children[1].geometry;

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
//--

    if(parameters.enableLine===true){
        obj.enableLine=true;

        geo.vertices[1].x=geo.vertices[1].y=geo.vertices[1].z=10;
        geo.verticesNeedUpdate=true;
        obj.lineHeight=10;


    }else if(parameters.enableLine===false){
        obj.enableLine=false;
        geo.vertices[1].x=geo.vertices[1].y=geo.vertices[1].z=0;
        geo.verticesNeedUpdate=true;
        obj.lineHeight=0;

    }
    if(parameters.lineHeight!==undefined&&obj.enableLine===true){
        var multiple=parameters.lineHeight/obj.lineHeight;
        geo.vertices[1]=new THREE.Vector3( geo.vertices[1].x*multiple,geo.vertices[1].y*multiple,geo.vertices[1].z*multiple);
        geo.verticesNeedUpdate=true;
        obj.lineHeight=parameters.lineHeight;
    }


  //end


    if(parameters.title!==undefined){
        obj.title=parameters.title;
        var childT=document.getElementById(obj.uuid+"V").children[0].children[0];
        var l=GetLength(parameters.title);
        childT.value=parameters.title;
        childT.style.width=l*8+"px";

    }
    if(!obj.hasOwnProperty("cameraPosition")){
        obj.cameraPosition=undefined;
    }
    if(parameters.cameraPosition!==undefined)obj.cameraPosition=parameters.cameraPosition;
    if(parameters.ROrL!==undefined){
        obj.ROrL=(parameters.ROrL);
        updateCanvas(document.getElementById(obj.uuid+"V").children[1],parameters.ROrL)
    }
    editor.signals.sceneGraphChanged.dispatch();
};*/
/*var updateNowPosition=function(editor,objParent){
   // var labels=editor.labels;
    var viewport=document.getElementById("viewport");
    var projector=new THREE.Projector();
    var point=(new THREE.Vector3().copy(objParent.children[1].geometry.vertices[1])).add(objParent.getWorldPosition());
    var point2d=new THREE.Vector3().copy(point);
    projector.projectVector(point2d,editor.camera);
    var obj=objParent.children[0];
    updateLabelPosition(obj,viewport,point,point2d)

};*/
/*var updateScale=function(editor,obj,point){
    var labels=editor.labels;
    for(var i in labels){
        var distance=point.distanceTo(editor.camera.position);
        labels[i].scale.x=labels[i].scale.y=labels[i].scale.z=distance/300;
    }
};
var mul=function(v1,v2){
    var fz=v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;
    var fm=Math.sqrt(v1.x*v1.x+v1.y*v1.y+v1.z*v1.z)*Math.sqrt(v2.x*v2.x+v2.y*v2.y+v2.z*v2.z);
    if(fm==0){fm=1}
    var end=fz/fm;
    return end;
};*/

/*
var updateLabelPosition=function(obj,viewport,point,point2d){
    var lineGeo=obj.parent.children[1].geometry;
    var ca=editor.camera.position;
    var co=editor.controls.target;
    var vcc=new THREE.Vector3(ca.x-co.x,ca.y-co.y,ca.z-co.z);
    var normal=new THREE.Vector3().copy(obj.normal);
   // var tempMatrix=new THREE.Matrix4();
   // normal.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(obj.parent.parent.matrixWorld)));
    var children= document.getElementById(obj.uuid+"V");
    if(mul(normal,vcc)>0){
        obj.parent.visible=true;
        children.style.display="block";
    }else{
        obj.parent.visible=false;
        children.style.display="none";
    }
    var left = ( point2d.x + 1) / 2 * viewport.offsetWidth;
    var top = ( -point2d.y + 1) / 2 * viewport.offsetHeight;
    children.style.left = left  + "px";
    children.style.top = top+ "px";
  //var ROrL=obj.ROrL;
  //var cssType= obj.cssType;
  //var children= document.getElementById(obj.uuid+"V");
  //var texWidth=parseInt($(children.children[0].children[0]).css("width"));
  //var enableLine= obj.enableLine;
  //var lineHeight= enableLine?obj.lineHeight:0;
  //var cameraPosition= obj.cameraPosition;
  //obj.position.copy(new THREE.Vector3().copy(point).sub(obj.parent.getWorldPosition()));
  //updateScale(editor,obj,point);

  // var ROrLValue=obj.ROrL=="R"?0:-(4*lineHeight+texWidth+30);

  // var left = ( point2d.x + 1) / 2 * viewport.offsetWidth;
  // var top = ( -point2d.y + 1) / 2 * viewport.offsetHeight;


  // var topDiv=20;
  // var levalTop=0;
  // children.children[0].style.marginLeft =2*lineHeight+ROrLValue+"px";
  // if(enableLine){
  //     topDiv+=lineHeight+20;
  //     if(enableLine)$(".label2d canvas").css("display","block");
  // }else{
  //     levalTop=-20;
  // }

  // if(cssType=="standard"){
  //     children.style.left = left  + "px";
  //     children.style.top = top -topDiv+ "px";
  // }else if(cssType=="leval"){

  //     children.style.left = left  + "px";
  //     children.style.top = top -topDiv-83+levalTop+ "px";
  // }



};*/
