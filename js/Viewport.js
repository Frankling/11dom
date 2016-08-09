/**
 * Created by DELL on 2016/1/8.
 */
var Viewport=function(editor){
    var signals = editor.signals;

    var  container = new UI.Panel();

    container.setId( 'viewport' );

    var renderer = editor.renderer;
    renderer.autoClear=false;
    renderer.setClearColor(0x555555);
    var canvas=renderer.domElement;



    container.dom.appendChild(renderer.domElement);
    var vlogo=new UI.createDiv('vlogo',container);

    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;
    var sceneGlobal = editor.sceneGlobal;

    var lightGlobal = editor.lightGlobal;
    editor.sceneGlobal.add(lightGlobal);
    //var lightBG = editor.lightBG;
    editor.sceneBG.add(editor.lightBG);

    var composer=editor.composer;

    var grid=editor.Grid;
    grid.visible=false;
    editor.scene.add(grid);

    editor.controls = new THREE.OrbitControls(editor.camera,canvas);
  //  editor.controls.enableDamping = true;
  //  editor.controls.dampingFactor  =  1;
    editor.controls.addEventListener('change', function (){
        editor.signals.cameraChanged.dispatch(editor.camera);
      //  editor.controls.update();
    });

    var transformControls=new THREE.MyTransformControls(editor.camera,container.dom);

    transformControls.addEventListener("change",function(){

        if(transformControls.hasIntersect){
            editor.controls.enabled=false;
        }else{
            editor.controls.enabled=true;
        }
        editor.signals.selectTransform.dispatch();
        editor.signals.sceneGraphChanged.dispatch();
    })

    var projector=new THREE.Projector();
    var objects=[];
    var mousePosition=new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    canvas.addEventListener("mousemove",changeMouse,false);
    function changeMouse(event){
        event.preventDefault();
        var intersects=editor.getIntersects(event);
        if (intersects.length > 0 && !transformControls.hasIntersect) {
            var select = intersects[0].object;
            if(select.event){
                var e=  select.event.lib.mouseEvent;
                for(var ei=0;ei< e.children.length;ei++){
                    if(e.children[ei].attribute.eventType=="down"){canvas.style.cursor = "pointer";}
                    else canvas.style.cursor = "default";
                }
            }
            else canvas.style.cursor = "default";
        }
        else canvas.style.cursor = "default";
    }

    container.dom.addEventListener("mousedown",onMouseDown,false);

    window.addEventListener( 'resize', onWindowResize, false );
   // var labelSelected;
    var isLabelSelect;
    var isDoubleClick;
    var oldTime;
    function onMouseDown(event){
      //  event.preventDefault();
        if(oldTime) isDoubleClick= (new Date().getTime()-oldTime)<300;

        var button=event.button;
        var intersects=editor.getIntersects(event);
        if(button==0) {

            if (intersects.length > 0 && !transformControls.hasIntersect) {
                var select=intersects[0].object;

                editor.select(select);
                if(select.event){
                    var e=  select.event.lib.mouseEvent;
                    for(var ei=0;ei< e.children.length;ei++){
                        if(e.children[ei].attribute.eventType=="down"){
                            select.event.dispatch(e.children[ei]);
                        }

                    }

                }
                if(intersects[0].object.hasOwnProperty("cameraPosition")){
                    if(isDoubleClick){
                       // updateLabelCamera(intersects[0].object,isDoubleClick);
                        var labels=editor.labels;
                        if(editor.labels.hasOwnProperty( select.uuid)&&isDoubleClick){
                            labelObject.updateLabelCamera(select);
                        }
                        for(var i in labels){
                            labelObject.updateNowPosition(labels[i]);
                        }
                    }
                    isLabelSelect=true;
                }


            }
        }else if(button==2){
            editor.selectClear();
            $(".selected").removeClass("selected");
            transformControls.hasIntersect=false;
            editor.signals.sceneGraphChanged.dispatch();

        }

        container.dom.addEventListener("mousemove",onMouseMove,false);
        container.dom.addEventListener("mouseup",onMouseUp,false);
        oldTime=new Date().getTime();
    }
/*    editor.signals.addLabel.add(function(label){
       objects.push(label);
    });*/
    function onMouseMove(event){
        event.preventDefault();
        var button=event.button;

        var intersects=editor.getIntersects(event);

        for(var i=0;i<intersects.length;i++){

            if(intersects[i].object instanceof THREE.Mesh){
                var parent=intersects[i].object;
                var point=intersects[i].point;
            }

        }

        var selected=editor.selected;
        var labels=editor.labels;
        var bool;
        //console.log(isLabelSelect);
        if(isLabelSelect){

            for(var i in selected){

                if(point&&labels.hasOwnProperty( i)){

                    if(parent== labels[i].parent){

                        var offset=new THREE.Vector3().copy(labels[i].getWorldPosition()).sub(point);
                        var camera=editor.camera;
                        var distance=point.distanceTo(camera.position);
                        var realy=new THREE.Vector3(camera.position.x/distance/3,camera.position.y/distance/3,camera.position.z/distance/3);
                        labels[i].position.sub(offset);
                        bool=true;
                        editor.signals.sceneGraphChanged.dispatch();
                    }

                }

            }
            if(bool){
                editor.controls.enabled=!bool;

                signals.selectTransform.dispatch();
            }
           // $(".label2d").css("pointer-events","none");
        }

 /*       if(point&&labelSelected){
            editor.controls.enabled=false
            var offset=new THREE.Vector3().copy(labelSelected.getWorldPosition()).sub(point);
            labelSelected.position.sub(offset);
            signals.selectTransform.dispatch();
            signals.sceneGraphChanged.dispatch();
        }*/



       // mousePosition.x = ( (event.offsetX)/ (renderer.domElement.width) ) * 2 - 1;
       // mousePosition.y = - ( event.offsetY/ renderer.domElement.height ) * 2 + 1;
       // raycaster.setFromCamera(mousePosition, editor.camera );

    }
    function onMouseUp(event){
        event.preventDefault();

        editor.controls.enabled=true;
        isLabelSelect=false;
        //$(".label2d").css("pointer-events","visible");

        container.dom.removeEventListener("mousemove",onMouseMove,false);
        container.dom.removeEventListener("mousedown",onMouseUp,false);
    }
    function onWindowResize( event ) {
        editor.signals.windowResize.dispatch();
    }
    function trace(){
        //console.log("trace")
        for(var i in editor.traceCamera){
            //console.log( editor.scene.getObjectByName(i));
            editor.allObject3D.getObjectByUuid(i).position.copy(editor.traceCamera[i]);
            editor.allObject3D.getObjectByUuid(i).position.unproject(editor.camera);
            //if(loop) requestAnimationFrame(trace);
        }
        //editor.signals.sceneGraphChanged.dispatch();
    }
    function render() {
        var labels=editor.labels;
        for(var i in labels){
            labelObject.updateNowPosition(labels[i]);
        }
        if(Object.keys(editor.traceCamera).length) trace();
        sceneHelpers.updateMatrixWorld();
        scene.updateMatrixWorld();

        renderer.clear();

        transformControls.update();
        editor.allObject3D.traverse(function(child){
            if(child instanceof THREE.LightObject){
                var scale = child.position.distanceTo(editor.camera.position) / 1200*20;
                child.children[0].scale.set(scale,scale,scale);
            }
        });
        for(i in editor.helpers){
            editor.helpers[i].update();
        }
        for(var n in editor.labels2){
            updateHotSpotPosition(editor.labels2[n]);
        }


        if( editor.composer.enable()){
            composer.composer.render()
        }else{
            editor.enable2D ?  renderer.render( editor.sceneBG, editor.cameraBG ):  renderer.render(sceneGlobal, editor.camera);
            renderer.render( scene, editor.camera );
        }
        renderer.render( sceneHelpers,editor.camera );

    }
    function addenvMap(material,mappings){
       var images=[];
        var type=mappings;
        var texture=new THREE.CubeTexture();
        var materials=editor.skybox.material.materials;
        /*  if(editor.enable2D){
         for(var i=0;i<editor.rcube.image.length;i++){
         images.push(editor.rcube.image[i]);
         }
         }else{*/
        for(var i=0;i<materials.length;i++){
            images.push(materials[i].map.image);
        }
        //}
        texture.mapping=type;
        material.envMap =texture;
        texture.image=images;
        texture.needsUpdate=true;
        editor.signals.sceneGraphChanged.dispatch();


    }

    signals.envmappingChange.add(function(material,mappings){
        addenvMap(material,mappings);
    });
    Editor.prototype.getIntersects=function(event,obj){
        mousePosition.x = ( (event.offsetX)/ (renderer.domElement.width) ) * 2 - 1;
        mousePosition.y = - ( event.offsetY/ renderer.domElement.height ) * 2 + 1;
        raycaster.setFromCamera(mousePosition, editor.camera );
        var intersects=obj?raycaster.intersectObjects( obj ):raycaster.intersectObjects( objects );
        return intersects;
    };

    /*signals.labelChange.add( function (object ) {
        var labels=editor.labels;
        if($(".labelBody")[0])  var topDiv=parseInt($(".labelBody")[0].style.height);

        for(var i in labels){
            var position=labels[i].getWorldPosition();

            var v=new THREE.Vector3().copy( position);
            projector.projectVector( v, editor.camera);
            var left=( v.x+1)/2*container.dom.offsetWidth;
            var top=( -v.y+1)/2*container.dom.offsetHeight;

            var scale = position.distanceTo(editor.camera.position) / 80;
            labels[i].scale.set(scale,scale,scale);
            var child=document.getElementById(i+"V").children[1];
            var boolLine=child.style.display;
            if(boolLine=="none"){
                document.getElementById(i+"V").style.left= left+5+"px";
                document.getElementById(i+"V").style.top=  top - 10-topDiv/2 + "px";
            }else{
                var height=parseFloat(child.style.height);
                document.getElementById(i+"V").style.left= left + 5 + "px";
                document.getElementById(i+"V").style.top= top - 20 - topDiv - height + "px";

            }

        }

    } );*/
    signals.selectChanged.add( function (object ) {
      if(editor.labels.hasOwnProperty(object.uuid)){
            editor.signals.sceneGraphChanged.dispatch();
            return
        }
        transformControls.attach(editor.selected);
        editor.sceneHelpers.add(transformControls);
        editor.signals.sceneGraphChanged.dispatch();


    } );
    signals.selectClear.add( function ( ) {
        transformControls.detach();
        editor.sceneHelpers.remove(transformControls);

    });
    signals.objectAdded.add( function ( object ) {

        var materialsNeedUpdate = false;

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Light ) materialsNeedUpdate = true;
            if(child instanceof  THREE.Mesh)  objects.push( child );
            if(child instanceof  THREE.Sprite)  objects.push( child );
        } );

        if ( materialsNeedUpdate === true ) editor.updateMaterials();

    } );
    signals.cameraChanged.add( function () {
       /* signals.labelChange.dispatch();*/

        render();

    } );
    signals.windowResize.add( function () {
        editor.camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        editor.camera.updateProjectionMatrix();
        renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
     /*   signals.labelChange.dispatch();*/
        render();

    } );
    signals.sceneGraphChanged.add( function () {

        render();

    } );
    signals.selectTransform.add(function(mode){
       /* signals.labelChange.dispatch();*/

        if(mode!==undefined){
            transformControls.setMode(mode);
        }

        var helper=editor.helpers;
        var boxhelper=editor.boxHelpers
        for(var i in helper){
                helper[i].update();

        }
        for(var i in boxhelper){
            if(boxhelper[i] instanceof  THREE.BoxHelper){
                if(editor.selected[i]!==undefined){
                    boxhelper[i].update(editor.selected[i]);
                    if(editor.selected[i].event) {
                        var child = editor.selected[i].event.lib.moveEvent.children;
                        for (var m = 0; m < child.length; m++) {
                            if (child[m].next) {
                                var obj = child[m].parent.parent;

                                //var rotate_x = child[m].attribute.rotation.x*Math.PI/180-(obj.getWorldRotation().x- obj.rotation.x);
                                //var rotate_y = child[m].attribute.rotation.y*Math.PI/180-(obj.getWorldRotation().y- obj.rotation.y);
                                //var rotate_z = child[m].attribute.rotation.z*Math.PI/180-(obj.getWorldRotation().z- obj.rotation.z);

                                if(editor.transformType == "position") {
                                    if (child[m].attribute.position.x == editor.transformPosition.x
                                        && child[m].attribute.position.y == editor.transformPosition.y
                                        && child[m].attribute.position.z == editor.transformPosition.z) {
                                        obj.event.dispatch(child[m].next);
                                    }
                                }
                                if(editor.transformType == "rotation") {
                                    if (child[m].attribute.rotation.x == editor.transformRotation.x
                                        && child[m].attribute.rotation.y == editor.transformRotation.y
                                        && child[m].attribute.rotation.z == editor.transformRotation.z) {
                                        obj.event.dispatch(child[m].next);
                                    }
                                }
                                if(editor.transformType == "scale") {
                                    if (obj.scale.x == child[m].attribute.scale.x
                                        && obj.scale.y == child[m].attribute.scale.y
                                        && obj.scale.z == child[m].attribute.scale.z) {
                                        obj.event.dispatch(child[m].next);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        transformControls.update();
    });
    signals.objectRemove.add(function(object){
        var objs=[];
        var animations=THREE.AnimationHandler.animations;
        object.traverse( function ( child ) {

            var l=animations.length;
            while(l) {
                l--;
                if(animations[l].root==child){
                    animations.remove(animations[l]);
                }
            }




            if(child instanceof  THREE.Mesh||child instanceof THREE.Sprite){

                 if(editor.labels.hasOwnProperty(child.uuid)){
                     objs.push(child);

                 }
                 /*   for(var i=0;i<child.children.length;i++){
                        var id=child.children[i].uuid;
                        delete editor.labels[id];
                        document.getElementById("viewport").removeChild(document.getElementById(id+"V"));
                        document.getElementById("labelContent").removeChild(document.getElementById(id));
                    }*/

                if(child.geometry){
                    child.geometry.dispose();
                }else if(  child.material){
                    child.material.dispose();
                    if( child.material.texture){
                        child.material.texture.dispose();
                    }
                }
                objects.remove(child);
            }

        } );
        for(var i=0;i<objs.length;i++){
            labelObject.removeLabel(editor,objs[i],container.dom);
        }
        var id = object.uuid;
        $("#"+id).remove();
    });
    editor.signals.addLabel.add(function(label){
        objects.push(label);
    });
    editor.signals.removeLabel.add(function(label){
        objects.remove(label);
    });

    return container;
};