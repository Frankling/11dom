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

    container.dom.appendChild(renderer.domElement);
    var scene = editor.scene;
    var sceneHelpers = editor.sceneHelpers;
    var sceneGlobal = editor.sceneGlobal;

    editor.camera.position.z=1000;




    var lightGlobal = editor.lightGlobal;
    editor.sceneGlobal.add(lightGlobal);
    //var lightBG = editor.lightBG;
    editor.sceneBG.add(editor.lightBG);

    var composer=editor.composer;

    var grid=editor.Grid;
    grid.visible=false;
    editor.scene.add(grid);

    editor.controls = new THREE.OrbitControls(editor.camera,container.dom);
  //  editor.controls.enableDamping = true;
  //  editor.controls.dampingFactor  =  1;
    editor.controls.addEventListener('change', function (){
        editor.signals.cameraChanged.dispatch(editor.camera);
        editor.controls.update();
    });

    var transformControls=new THREE.MyTransformControls(editor.camera,container.dom);

    transformControls.addEventListener("change",function(){

        editor.signals.selectTransform.dispatch();
        editor.signals.sceneGraphChanged.dispatch();
    })

    var projector=new THREE.Projector();
    var objects=[];
    var mousePosition=new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    container.dom.addEventListener("mousedown",onMouseDown,false);

    window.addEventListener( 'resize', onWindowResize, false );
    function onMouseDown(event){
        event.preventDefault();
        var button=event.button;
        var intersects=editor.getIntersects(event);
        if(button==0) {

            if (intersects.length > 0 && !transformControls.hasIntersect) {

                //transformControls.hasIntersect=false;
                editor.select(intersects[0].object);
            }
        }else if(button==2){
            editor.selectClear();
            $(".selected").removeClass("selected");
            // transformControls.hasIntersect=false;
            editor.signals.sceneGraphChanged.dispatch();

        }


        event.target.addEventListener("mousemove",onMouseMove,false);
        event.target.addEventListener("mouseup",onMouseUp,false);
    }
    function onMouseMove(event){
        event.preventDefault();
        mousePosition.x = ( (event.offsetX)/ (renderer.domElement.width) ) * 2 - 1;
        mousePosition.y = - ( event.offsetY/ renderer.domElement.height ) * 2 + 1;
        raycaster.setFromCamera(mousePosition, editor.camera );

    }
    function onMouseUp(event){
        event.preventDefault();
        event.target.removeEventListener("mousedown",onMouseDown,false);
        event.target.removeEventListener("mousemove",onMouseMove,false);
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
        var images=editor.enable2D?editor.planbox.material.map.image:[];
        var type=mappings==301?305:304
        var number=editor.enable2D?type:mappings;
        var texture=editor.enable2D?new THREE.Texture(): new THREE.CubeTexture();
        var materials=editor.skybox.material.materials;
        if(images instanceof Array){
            for(var i=0;i<materials.length;i++){
                images.push(materials[i].map.image);
            }
        }
        texture.mapping=number;
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

    signals.labelChange.add( function (object ) {
        var labels=editor.labels;
        for(var i in labels){
            var position=labels[i].getWorldPosition();

            var v=new THREE.Vector3().copy( position);
            projector.projectVector( v, editor.camera);
            var left=( v.x+1)/2*container.dom.offsetWidth;
            var top=( -v.y+1)/2*container.dom.offsetHeight;

            var scale = position.distanceTo(editor.camera.position) / 180;
            labels[i].scale.set(scale,scale,scale);

            document.getElementById(i).style.left= left+5+"px";
            document.getElementById(i).style.top= top-90+"px";
        }

    } );
    signals.selectChanged.add( function (object ) {

        transformControls.attach(editor.selected);
        editor.sceneHelpers.add(transformControls);
        editor.signals.sceneGraphChanged.dispatch();


    } );
    signals.selectClear.add( function ( ) {
        transformControls.detach();
        editor.sceneHelpers.remove(transformControls);

    })
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
        signals.labelChange.dispatch();

        render();

    } );
    signals.windowResize.add( function () {
        editor.camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        editor.camera.updateProjectionMatrix();
        renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
        signals.labelChange.dispatch();
        render();

    } );
    signals.sceneGraphChanged.add( function () {

        render();

    } );
    signals.selectTransform.add(function(mode){
        signals.labelChange.dispatch();
        if(mode!==undefined){
            transformControls.setMode(mode);
        }

        var helper=editor.helpers;
        var boxhelper=editor.boxHelpers
        for(i in helper){
                helper[i].update();

        }
        for(i in boxhelper){
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

                    for(var i=0;i<child.children.length;i++){
                        var id=child.children[i].uuid;
                        delete editor.labels[id];
                        document.getElementById("viewport").removeChild(document.getElementById(id));
                    }

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
    return container;
}