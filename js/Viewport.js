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
        editor.controls.update();
    });

    var transformControls=new THREE.MyTransformControls(editor.camera,canvas);

    transformControls.addEventListener("change",function(){

        editor.signals.selectTransform.dispatch();
        editor.signals.sceneGraphChanged.dispatch();
    })

    var projector=new THREE.Projector();
    var objects=[];
    var mousePosition=new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    canvas.addEventListener("mousedown",onMouseDown,false);

    window.addEventListener( 'resize', onWindowResize, false );
   // var labelSelected;
    var isLabelSelect;
    var isDoubleClick;
    var oldTime;
    function onMouseDown(event){
        event.preventDefault();
        if(oldTime) isDoubleClick= (new Date().getTime()-oldTime)<300;


        var button=event.button;
        var intersects=editor.getIntersects(event);
        if(button==0) {

            if (intersects.length > 0 && !transformControls.hasIntersect) {
                editor.select(intersects[0].object);
                if(intersects[0].object.hasOwnProperty("cameraPosition")){
                    if(isDoubleClick){
                        updateLabelCamera(intersects[0].object,isDoubleClick);
                        var labels=editor.labels;
                        for(var i in labels){
                            updateNowPosition(editor,labels[i]);
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
        if(isLabelSelect){
            for(var i in selected){

                if(point&&labels.hasOwnProperty( i)){
                    if(parent== labels[i].parent){
                        var offset=new THREE.Vector3().copy(labels[i].getWorldPosition()).sub(point);
                        var camera=editor.camera;
                        var distance=point.distanceTo(camera.position);
                        var realy=new THREE.Vector3(camera.position.x/distance,camera.position.y/distance,camera.position.z/distance);
                        labels[i].position.sub(offset).add(realy);
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
        container.dom.removeEventListener("mousedown",onMouseDown,false);
        container.dom.removeEventListener("mousemove",onMouseMove,false);
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

            var point=labels[i].getWorldPosition();
            var point2d=new THREE.Vector3().copy(point);
            projector.projectVector(point2d,editor.camera);
           // console.log(labels[i].parent)
            updateLabelPosition(labels[i],container.dom,point,point2d);
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

                }
            }
        }


        transformControls.update();
    });
    signals.objectRemove.add(function(object){
        object.traverse( function ( child ) {
            if(child instanceof  THREE.Mesh||child instanceof  THREE.Sprite){
                 if(editor.labels.hasOwnProperty(child.uuid)){
                     removeLabel(editor,child,container.dom);
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