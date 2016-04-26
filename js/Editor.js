/**
 * Created by DELL on 2016/1/8.
 */
var Editor = function () {
    var SIGNALS=signals;
    this.signals={
        objectAdded: new SIGNALS.Signal(),
        objectRemove: new SIGNALS.Signal(),
        helperAdded:new SIGNALS.Signal(),
        sceneGraphChanged: new SIGNALS.Signal(),
        selectChanged:new SIGNALS.Signal(),
        selectTransform:new SIGNALS.Signal(),
        cameraChanged:new SIGNALS.Signal(),
        windowResize:new SIGNALS.Signal(),
        selectClear:new SIGNALS.Signal(),
        labelChange:new SIGNALS.Signal(),
        envmappingChange:new SIGNALS.Signal(),
        initTHREE:{
            initGlobalLight:new SIGNALS.Signal(),
            initGlobalControls:new SIGNALS.Signal(),
            initComposer:new SIGNALS.Signal(),
            initBackground:new SIGNALS.Signal(),
            initTraceCamera:new SIGNALS.Signal()
        }

    };

    this.renderer=new THREE.WebGLRenderer({antialias: true,alpha:true});

    this.scene=new THREE.Scene();
    this.sceneHelpers=new THREE.Scene();
    this.sceneBG = new THREE.Scene();
    this.sceneGlobal = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2("#123456", 0);
    this.sceneGlobal.fog = new THREE.FogExp2("#123456", 0);

    this.Grid=new THREE.GridHelper(100,10);

    this.camera = new THREE.PerspectiveCamera( 45, 2, 1, 100000 );
    this.camera.position.set(0, 0, 1000 );
    this.camera.lookAt( new THREE.Vector3(0,0,0) );
    this.camera.name = 'Camera';
    this.cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
    this.cameraBG.position.z = 50;
    //envmap.image

    this.lightBG = new THREE.AmbientLight(0xffffff);
    this.lightBG.position.set(0,0,0);

    this.lightGlobal = new THREE.AmbientLight(0xffffff);
    this.lightGlobal.position.set(0,0,0);


    this.composer = new composer(this);
    this.materialsri=[];
    this.skybox = {};

    this.labels={};
    this.planbox = {};
    this.planbox.image = "";

    this.controls = null;
    this.int = new Object();

    this.enable2D = true;

    this.keyCode={};
    this.loader=new Loader(this);
    this.pathImport=new pathImport(this);
    this.loadShaders=new loadShaders(this);
    this.selected={};
    this.geometries = {};
    this.materials = {};
    this.helpers={};
    this.boxHelpers={};
    this.allObject3D=new THREE.Object3D();
    this.scene.uuid=this.allObject3D.uuid;
 //   this.alladdenvMap=[];
    this.requestLoop = false;
    this.traceCamera={};



};
Editor.prototype = {

    getSelectedPosition:function(selected){
        var vector=new THREE.Vector3();
        var n=0;
        for(var i in selected){
            var vector1= selected[i].getWorldPosition();
          //  var vector1= editor.getWorldPosition(selected[i]);
            vector.x+=vector1.x;
            vector.y+=vector1.y;
            vector.z+=vector1.z;
            n++
        }

        vector.x/=n;
        vector.y/=n;
        vector.z/=n;
        return vector;
    },
    getSelectedRotation:function(selected){
        var _Euler=new THREE.Euler();
        var n=0;
        for(var i in selected){

            var _Euler1=selected[i].getWorldRotation();
            _Euler._x+=_Euler1._x;
            _Euler._y+=_Euler1._y;
            _Euler._z+=_Euler1._z;

            n++
        }

        _Euler._x/=n;
        _Euler._y/=n;
        _Euler._z/=n;
        return _Euler;
    },
    getWorldPosition:function(object){
        var minX,minY,minZ,maxX,maxY,maxZ;
        var vector=new THREE.Vector3();

        object.traverse( function ( node ) {
            if(node instanceof THREE.Mesh){

                var geometry = node.geometry;
                if ( geometry !== undefined ) {
                if ( geometry instanceof THREE.Geometry ) {
                    var vertices = geometry.vertices;

                    for ( var i = 0, il = vertices.length; i < il; i ++ ) {
                        var vX=parseInt(vertices[i].x+parseInt(node.matrixWorld.elements[12]));
                        var vY=parseInt(vertices[i].y+parseInt(node.matrixWorld.elements[13]));
                        var vZ=parseInt(vertices[i].z+parseInt(node.matrixWorld.elements[14]));

                        if(minX==undefined){minX=vX;}
                        minX=Math.min(minX, vX);

                        if(minY==undefined){minY=vY;}
                        minY=Math.min(minY, vY);

                        if(minZ==undefined){minZ=vZ;}
                        minZ=Math.min(minZ,vZ);

                        if(maxX==undefined){maxX=vX;}
                        maxX=Math.max(maxX, vX);

                        if(maxY==undefined){maxY=vY;}
                        maxY=Math.max(maxY, vY);

                        if(maxZ==undefined){maxZ=vZ;}
                        maxZ=Math.max(maxZ, vZ);

                    }

                }
            }else if(node instanceof THREE.Sprite){
                    minX=maxX=object.position.x;
                    minY=maxY=object.position.y;
                    minZ=maxZ=object.position.z;

                }
            }
        } );

        vector.x=(minX+maxX)/2;
        vector.y=(minY+maxY)/2;
        vector.z=(minZ+maxZ)/2;
        return vector;

    },
    updateMaterials: function (){
        editor.scene.traverse(function(child){
            if(child instanceof THREE.Mesh){
                child.material.needsUpdate = true;
            }
        })
    },
    setScene: function ( scene ,parent) {

        var len = scene.children.length;
        while ( --len) {
            if(scene.children[ len].children.length==0){
                scene.children.pop();
            }else{
                this.allObject3D.children.push( scene.children[ len ] );
                this.addObject( scene.children[ len ],parent );
            }


        }
        if(this.allObject3D.length>0){

            this.centerObject(this.allObject3D);
        }

       // this.signals.sceneGraphChanged.active = true;
        this.signals.sceneGraphChanged.dispatch();

    },
    fromJSON: function ( json ,parent) {

        var loader = new THREE.ObjectLoader();


        if ( json.scene === undefined ) {

            this.setScene( loader.parse( json ),parent );
            return;

        }


        this.setScene( loader.parse( json.scene ) ,parent);

    },
    selectClear:function(){
        for(i in this.boxHelpers){
            this.sceneHelpers.remove(this.boxHelpers[i]);

        }

        this.boxHelpers={};
        this.selected={};
        this.signals.selectClear.dispatch();
    },
    select: function ( object ) {

       if(object.parent instanceof THREE.LightObject)  var object=object.parent;

        var uuid=object.uuid;
        var needAddHelper=false;

        if(!this.keyCode["ctrl"]){
           this.selectClear();
        }
        if(   this.boxHelpers[uuid]==undefined){
            this.selected[uuid]=object;
            if(object.type!="LightObject"){
                this.boxHelpers[uuid] = new  THREE.BoxHelper(object);
                this.sceneHelpers.add(this.boxHelpers[uuid]);
                this.boxHelpers[uuid].update(object);
            }
        }

        $(".selected").removeClass("selected");
        $("#"+uuid).addClass("selected");

        this.signals.selectChanged.dispatch(object);

    },
    addHelper: function () {



        return function ( object ) {

            var helper;
            if ( object instanceof THREE.Camera ) {

                helper = new THREE.CameraHelper( object, 10 );

            } else if ( object instanceof THREE.PointLight ) {

                helper = new THREE.PointLightHelper( object, 10 );

            } else if ( object instanceof THREE.DirectionalLight ) {

                helper = new THREE.DirectionalLightHelper( object, 20 );

            } else if ( object instanceof THREE.SpotLight ) {

                helper = new THREE.SpotLightHelper( object, 10 );

            } else if ( object instanceof THREE.HemisphereLight ) {

                helper = new THREE.HemisphereLightHelper( object, 10 );

            } else if ( object instanceof THREE.SkinnedMesh ) {

                helper = new THREE.SkeletonHelper( object );

            } else {

                return;
            }

            this.sceneHelpers.add( helper );

            this.helpers[ object.parent.uuid ] = helper;

        };

    }(),
    removeHelper: function ( object ) {

        if ( this.helpers[ object.uuid] !== undefined ) {
            var helper = this.helpers[ object.uuid ];
            helper.parent.remove( helper );
            delete this.helpers[ object.uuid ];
            //this.signals.helperRemoved.dispatch( helper );
        }
        for(var i in this.helpers) {
            if (this.helpers[i] instanceof THREE.TransformControls) {
                this.helpers[i].parent.remove(this.helpers[i]);
                delete this.helpers[i];
            }
        }
    },
    addObject: function ( object ,parent ) {

        var scope = this;
        var arry=[];
        object.traverse( function ( child) {
            if(child.uuid==undefined){
                arry.push(child);
            }
            if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
            if ( child.material !== undefined ) scope.addMaterial( child.material );

                scope.addHelper(child)
        } );
        for(var i=0;i<arry.length;i++){
            object.remove(arry[i]);
        }
        parent.add( object );
        this.signals.objectAdded.dispatch( object,parent);
        this.signals.sceneGraphChanged.dispatch();


    },
    removeObject:function(object){
        if(object==undefined){
            return;
        }
        var scope = this;
        try{
            object.traverse(function(child){
                scope.removeHelper(child);
            });
        }catch(e){
        }
        object.parent.remove( object );
        if(object.type=="LightObject") {
            delete editor.traceCamera[object.uuid];
        }
        editor.selectClear();
        this.signals.objectRemove.dispatch( object );
        this.signals.sceneGraphChanged.dispatch();
    },
    addGeometry: function ( geometry ) {

        this.geometries[ geometry.uuid ] = geometry;

    },
    addMaterial: function ( material ) {

        this.materials[ material.uuid ] = material;

    },
    dissectionObject:function(object){
     //   var scope=this;
     //   var _object=new THREE.Object3D();
     //   _object.name=object.name;
//
     //   var mesh=[];
     //   var meshName;
     //   var _uuid=_object.uuid;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material=new THREE.MeshStandardMaterial({
                        roughness:0.6,
                        metalness:0.2
                    });
                  // if (child.name !== "") {
                  //     meshName = child.name;
                  // }

                  // var length;
                  // if(child.geometry.faces){
                  //     length=child.geometry.faces.length;
                  // }else{
                  //     length=1;
                  // }

                  // if (length !== 0) {
                  //     child.name=meshName;
                  //    // mesh.push(child);
                  // }
                }
            });
         // for(var i=0;i<mesh.length;i++){
         //   //  var group=new THREE.Group();
         //   //  group.name=mesh[i].name;
         //   //  group.add(mesh[i]);
         //     _object.add(mesh[i]);
         // }



        return object;
    },
   centerObject:function(object){
       var maxX,maxY,maxZ,minX,minY,minZ;

       object.traverse(function (child) {

           if (child instanceof THREE.Mesh) {
               var center=child.geometry.center();
               var x=child.geometry.boundingBox.max.x-center.x;
               var y=child.geometry.boundingBox.max.y-center.y;
               var z=child.geometry.boundingBox.max.z-center.z;


               maxX= maxX==undefined ? x:Math.max(maxX,x);
               maxY= maxY==undefined ? y:Math.max(maxY,y);
               maxZ= maxZ==undefined ? z:Math.max(maxZ,z);

               var x=child.geometry.boundingBox.min.x-center.x;
               var y=child.geometry.boundingBox.min.y-center.y;
               var z=child.geometry.boundingBox.min.z-center.z;


               minX= minX==undefined ? x:Math.min(minX,x);
               minY= minY==undefined ? y:Math.min(minY,y);
               minZ= minZ==undefined ? z:Math.min(minZ,z);

              child.position.x=-center.x;
              child.position.y=-center.y;
              child.position.z=-center.z;


           }
       });
        var targetX=(maxX+minX)/2;
        var targetY=(maxY+minY)/2;
        var targetZ=(maxZ+minZ)/2;
        var object_size=Math.max(maxX-minX,0,maxZ-minZ);
        this.camera.position.x=0;
        this.camera.position.y=object_size;
        this.camera.position.z=object_size*2.4;
        if(this.controls.target) this.controls.target.set(targetX, targetY, targetZ);
        this.controls.update();


    },


    resetAxis:function(){
        var position;
        var max=new THREE.Vector3();
        var min=new THREE.Vector3();
        var n=true;
        var s=this.selected;
        for(var i in this.selected){
            if(this.selected[i].type=="LightObject"){
                return
            }
            var c=s[i].children;
            var l=c.length;
            var oldPosition=s[i].getWorldPosition();
            s[i].traverse(function(child){
                if(child instanceof THREE.Mesh){
                    var other=child.geometry.boundingBox;
                    position=child.getWorldPosition();
                    if(n){
                        max.copy( position.add(new THREE.Vector3(other.max.x,other.max.y,other.max.z)));
                        min.copy( position.add(new THREE.Vector3(other.min.x,other.min.y,other.min.z)));
                        n=false;
                    }
                    max.set(Math.max( max.x,position.x+other.max.x),Math.max(max.y,position.y+other.max.y),Math.max(max.z,position.z+other.max.z));
                    min.set(Math.min( min.x,position.x+other.min.x),Math.min(min.y,position.y+other.min.y),Math.min(min.z,position.z+other.min.z));

                }
          });
            if(l>0){
                var center=new THREE.Vector3((max.x+min.x)/2,(max.y+min.y)/2,(max.z+min.z)/2);
                s[i].position.copy( new THREE.Vector3().copy(center).sub(s[i].parent.getWorldPosition()));
                center.sub(oldPosition);
                for( var j=0;j<l;j++){
                    c[j].position.sub(center);
                }
            }

        }

        editor.signals.selectTransform.dispatch();
        editor.signals.sceneGraphChanged.dispatch();
    },
    getCSS: function(obj,prop){

        if (obj.currentStyle) //IE
        {
            return obj.currentStyle[prop];
        }
        else if (window.getComputedStyle) //��IE
        {
            propprop = prop.replace (/([A-Z])/g, "-$1");
            propprop = prop.toLowerCase ();
            return document.defaultView.getComputedStyle(obj,null)[propprop];
        }
        return null;

    },
    refreshUI:function(obj,parent){
        var div=document.getElementById(parent.uuid);
        div.obj=parent;
        div.id=parent.uuid;
        var c= obj;
        if(c.length>0){
            for(var i=0;i<c.length;i++){
                var id=c[i].uuid;
                var type=c[i].type;
                var childUI= new UI.Panel().setId(id);
                childUI.dom.obj=c[i];
                childUI.setClass("listOfObject3D");
                childUI.dom.style.display="block";

                var li=new UI.Panel();
                li.setClass("objListHead");
                li.dom.type="noMove";
                childUI.dom.appendChild(li.dom);

                var li0=new UI.Panel();
                li0.setClass("objListCustom");
                li0.dom.type="noMove";
                li.dom.appendChild(li0.dom);

                var li1=new UI.Panel();
                li1.setClass("objListName");
                li1.dom.type="noMove";
                if(c[i].uuid!=undefined){
                    li1.setTextContent(c[i].name);
                }else{
                    li1.setTextContent("未定义");
                }
                li.dom.appendChild(li1.dom);

                var li2=new UI.Panel();
                li2.dom.type="noMove";
                li2.setClass("objListEye");
                li.dom.appendChild(li2.dom);

                childUI.dom.appendChild(li.dom);
                div.appendChild(childUI.dom);
                childUI.onClick(function(event){
                    event.stopPropagation();

                    editor.select(this.dom.obj);

                    for(var w=0;w<this.dom.children.length;w++){
                        var children=this.dom.children[w];
                        if(children.className=="listOfObject3D"){
                            var _display=children.style.display;
                            if(_display=="block"){
                                children.style.display="none";
                            }else{
                                children.style.display="block";
                            }
                        }

                    }
                });

                this.refreshUI(c[i].children,c[i]);
            }
        }

    },
    divToMove:function(div){

        var oldDownTarget;
        var downTarget;
        var moveTime=0;
        var eyeBool;

        var listContentDown=function(e){
            e.stopPropagation();
            e.preventDefault();
            if(div==event.target){
                return;
            }
            oldDownTarget=e.target;
            eyeBool=false;
            var getDownTarget=function( t){
                if(t.type=="noMove"){
                    if(t.className=="objListEye"){
                        eyeBool=true;
                    }
                    var nt= t.parentNode;
                    getDownTarget(nt);
                }else{
                    downTarget= t;
                }
            };
            //downTarget=getDownTarget(oldDownTarget);
            getDownTarget(oldDownTarget);
            window.addEventListener("mousemove",listContentMove,false);
            window.addEventListener("mouseup",listContentUp,false);
        };
        var listContentMove=function(e){
            e.stopPropagation();
            e.preventDefault();
            moveTime+=1;
            if( moveTime>3) {
                downTarget.style.pointerEvents = "none";
                downTarget.style.position = " fixed";
                downTarget.style.left = event.clientX + "px";
                downTarget.style.top = event.clientY + "px";
            }
        };
        var listContentUp=function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (moveTime > 3) {
                eyeBool=false;
                var addChildObj;
                var addParentObj;
                var upTarget = event.target;
                var getUpTarget=function( t) {
                    if (t.type == "noMove") {
                        var nt = t.parentNode;
                        getUpTarget(nt);
                    } else {
                        upTarget = t;
                    }
                };
                getUpTarget(upTarget);
                editor.allObject3D.traverse(function (child) {

                    if (downTarget.id == child.uuid) {
                        addChildObj = child;
                    }
                    if (child.type == "Object3D" || child.type == "Group") {

                        if (upTarget.id == child.uuid) {
                            addParentObj=child;

                            upTarget.appendChild(downTarget);
                            var vis = upTarget.children[2];
                            if (vis) {
                                downTarget.style.display = vis.style.display;
                            }
                        }
                    }

                });
                if(addChildObj&&addParentObj) {

                    addParentObj.add(addChildObj);
                }

            }
            if(eyeBool){

                editor.allObject3D.traverse(function (child) {
                    if (downTarget.id == child.uuid) {
                        var typeVis=child.visible;

                        if(typeVis){

                            event.target.style.backgroundImage="url('image/eyeOpen.png')";

                        }else{
                            event.target.style.backgroundImage="url('image/eyeClose.png')";
                        }
                        child.visible=!typeVis;
                    }

                });
            }
            downTarget.style.pointerEvents="auto";
            downTarget.style.position = " static";
            window.removeEventListener("mousemove", listContentMove, false);
            window.removeEventListener("mouseup", listContentUp, false);
            moveTime=0;
            editor.signals.sceneGraphChanged.dispatch();
        };
        div.addEventListener("mousedown",listContentDown,false)
    },

    //特效开关
    onToggleShaders: function (type) {
        this.composer.composer= new THREE.EffectComposer(this.renderer, this.composer.renderTarget);
        this.composer.renderPass.clear = false;
        editor.enable2D ? this.composer.composer.addPass(this.composer.renderPassBG):
            this.composer.composer.addPass(this.composer.renderPass1);
        this.composer.composer.addPass(this.composer.renderPass);
        //复古
        if (type.Restoring[1]) this.composer.composer.addPass(this.composer.Restoring[0]);
        //白慕
        if (type.WhiteCurtain[1]) this.composer.composer.addPass(this.composer.WhiteCurtain[0]);
        //黑夜
        if (type.DarkNight[1]) this.composer.composer.addPass(this.composer.DarkNight[0]);
        //像素
        if (type.Pixel[1]) this.composer.composer.addPass(this.composer.Pixel[0]);
        //发光
        if (type.Luminous[1]) this.composer.composer.addPass(this.composer.Luminous[0]);

        this.composer.composer.addPass(this.composer.ShaderPass);
        this.composer.ShaderPass.renderToScreen = true;
        editor.signals.sceneGraphChanged.dispatch()
    },
    //相机切换
    CameraControls: function (ControlsNumder) {
        if (ControlsNumder == 1) {
            this.controls.dispose();
            this.controls = new THREE.OrbitControls(editor.camera,document.getElementById("viewport"));
            editor.camera.fov = 45;
            editor.camera.position.set(0, 0, 1000 );
            editor.camera.lookAt( new THREE.Vector3(0,0,0) );
            editor.camera.updateProjectionMatrix();
            this.controls.addEventListener('change',function(){
                editor.signals.labelChange.dispatch();
                editor.signals.sceneGraphChanged.dispatch();
            });
        }
        else if (ControlsNumder == 2) {
            this.controls.dispose();
            this.controls = new THREE.Firstperson(editor.camera,document.getElementById("viewport"));
            editor.camera.updateProjectionMatrix();
            this.scene.add(this.controls.getObject());
        }
        else {
            this.controls.dispose();
            this.controls = new THREE.FlyControls(this.camera,document.getElementById("viewport"));
            editor.camera.fov = 45;
            editor.camera.position.set(0, 0, 1000 );
            editor.camera.lookAt( new THREE.Vector3(0,0,0) );
            editor.camera.updateProjectionMatrix();
            this.controls.movementSpeed = 1000;
            this.controls.rollSpeed = Math.PI / 24;
            this.controls.autoForward = false;
            this.controls.dragToLook = false;
        }
    },
    //渲染循环
    RenderLoop:function(){

        if(editor.requestLoop){
            requestAnimationFrame(editor.RenderLoop);
        }
        editor.signals.sceneGraphChanged.dispatch();
        editor.controls.update(0.1);
    },
    //相机控制
    CameraControlsGloba:function (Number,Camera){
        if( Camera == "OrbitLimit" ){
            //this.controls.minPolarAngle = Number * Math.PI / 200;
            this.controls.maxPolarAngle =Math.PI -(Number * Math.PI / 200);
        }


    },



    //上传天空盒图片
    UploadSkybox:function(SkyBoxUp,i,event)   {
        var fileName = event.target.files[0].name;
        var extension = fileName.split('.').pop().toLowerCase();
        if ((extension == 'jpg' || extension == 'png') && extension) {
            var reader = new FileReader();
            reader.addEventListener('load', function (event) {
                var contents = reader.result;
                SkyBoxUp.dom.style.backgroundImage = "url("+ contents +")";
                SkyBoxUp.dom.style.backgroundSize = "120px 120px";
                editor.materialsri[i] = contents;
            }, false);
            reader.readAsDataURL(event.target.files[0]);
        }
    },

    //天空盒子更新
    CreatSkybox:function(image){
        for(var i=0;i<this.materialsri.length;i++){

            this.skybox.material.materials[i].map.image.src =this.materialsri[i];
            this.skybox.material.materials[i].map.needsUpdate =true;
            this.skybox.material.materials[i].opacity = 1;
        }

        editor.allObject3D.traverse(function(child){
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    if(child.material.envMap){
                        if (child.material.envMap.mapping == 302 || child.material.envMap.mapping == 304) {
                            editor.signals.envmappingChange.dispatch(child.material, 302);
                        }
                        if (child.material.envMap.mapping == 301 || child.material.envMap.mapping == 305) {
                            editor.signals.envmappingChange.dispatch(child.material, 301);
                        }
                    }
                    child.material.needsUpdate = true;
                    editor.signals.sceneGraphChanged.dispatch();
                }
            }
        });

        editor.signals.sceneGraphChanged.dispatch();
    }

};
