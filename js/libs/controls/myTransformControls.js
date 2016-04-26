/**
 * Created by DELL on 2016/2/2.
 */
( function () {
    var MyGizmoMaterial = function (parameters) {

        THREE.MeshBasicMaterial.call(this);

        this.depthTest = false;
        this.depthWrite = false;
        this.side = THREE.DoubleSide;
        this.transparent = true;

        this.setValues(parameters);

        this.oldColor = this.color.clone();
        this.oldOpacity = this.opacity;

        this.highlight = function (highlighted) {

            if (highlighted) {

                this.color.setRGB(1, 1, 0);
                this.opacity = 1;

            } else {

                this.color.copy(this.oldColor);
                this.opacity = this.oldOpacity;

            }

        };

    };

    MyGizmoMaterial.prototype = Object.create(THREE.MeshBasicMaterial.prototype);
    MyGizmoMaterial.prototype.constructor = MyGizmoMaterial;

    var MyGizmoLineMaterial = function (parameters) {

        THREE.LineBasicMaterial.call(this);

        this.depthTest = false;
        this.depthWrite = false;
        this.transparent = true;
        this.linewidth = 1;

        this.setValues(parameters);

        this.oldColor = this.color.clone();
        this.oldOpacity = this.opacity;

        this.highlight = function (highlighted) {

            if (highlighted) {

                this.color.setRGB(1, 1, 0);
                this.opacity = 1;

            } else {

                this.color.copy(this.oldColor);
                this.opacity = this.oldOpacity;

            }

        };

    };

    MyGizmoLineMaterial.prototype = Object.create(THREE.LineBasicMaterial.prototype);
    MyGizmoLineMaterial.prototype.constructor = MyGizmoLineMaterial;

    var MyPickerMaterial = new MyGizmoMaterial({visible: false, transparent: false});

    THREE.MyTransformGizmo = function () {
        var scope = this;
        this.init = function () {

            THREE.Object3D.call(this);

            this.handles = new THREE.Object3D();
            this.pickers = new THREE.Object3D();
            this.planes = new THREE.Object3D();

            this.add(this.handles);
            this.add(this.pickers);
            this.add(this.planes);
            //// PLANES

            var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);
            var planeMaterial = new THREE.MeshBasicMaterial({visible: false, side: THREE.DoubleSide});


            var planes = {
                "XY": new THREE.Mesh(planeGeometry, planeMaterial),
                "YZ": new THREE.Mesh(planeGeometry, planeMaterial),
                "XZ": new THREE.Mesh(planeGeometry, planeMaterial),
                "XYZE": new THREE.Mesh(planeGeometry, planeMaterial)
            };

            this.activePlane = planes["XYZE"];

            planes["YZ"].rotation.set(0, Math.PI / 2, 0);
            planes["XZ"].rotation.set(-Math.PI / 2, 0, 0);

            for (var i in planes) {

                planes[i].name = i;
                this.planes.add(planes[i]);
                this.planes[i] = planes[i];

            }

            //// HANDLES AND PICKERS
            var setupGizmos = function (gizmoMap, parent) {

                for (var name in gizmoMap) {

                    for (i = gizmoMap[name].length; i--;) {

                        var object = gizmoMap[name][i][0];
                        var position = gizmoMap[name][i][1];
                        var rotation = gizmoMap[name][i][2];

                        object.name = name;

                        if (position) object.position.set(position[0], position[1], position[2]);
                        if (rotation) object.rotation.set(rotation[0], rotation[1], rotation[2]);

                        parent.add(object);

                    }

                }

            };

            setupGizmos(this.handleGizmos, this.handles);
            setupGizmos(this.pickerGizmos, this.pickers);

            // reset Transformations

            this.traverse(function (child) {

                if (child instanceof THREE.Mesh) {

                    child.updateMatrix();

                    var tempGeometry = child.geometry.clone();
                    tempGeometry.applyMatrix(child.matrix);
                    child.geometry = tempGeometry;

                    child.position.set(0, 0, 0);
                    child.rotation.set(0, 0, 0);
                    child.scale.set(1, 1, 1);

                }

            });

        };

        this.highlight = function (axis) {

            this.traverse(function (child) {

                if (child.material && child.material.highlight) {

                    if (child.name === axis) {

                        child.material.highlight(true);

                    } else {

                        child.material.highlight(false);

                    }

                }

            });

        };

    };
    THREE.MyTransformGizmo.prototype = Object.create(THREE.Object3D.prototype);
    THREE.MyTransformGizmo.prototype.constructor = THREE.MyTransformGizmo;
    THREE.MyTransformGizmo.prototype.update = function (rotation, eye) {

        var vec1 = new THREE.Vector3(0, 0, 0);
        var vec2 = new THREE.Vector3(0, 1, 0);
        var lookAtMatrix = new THREE.Matrix4();

        this.traverse(function (child) {

            if (child.name.search("E") !== -1) {

                child.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(eye, vec1, vec2));

            } else if (child.name.search("X") !== -1 || child.name.search("Y") !== -1 || child.name.search("Z") !== -1) {

                child.quaternion.setFromEuler(rotation);

            }

        });

    };
    THREE.MyTransformGizmoTranslate = function () {

        THREE.MyTransformGizmo.call(this);

        var arrowGeometry = new THREE.Geometry();
        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.2, 12, 1, false));
        mesh.position.y = 0.5;
        mesh.updateMatrix();


        arrowGeometry.merge(mesh.geometry, mesh.matrix);

        var lineXGeometry = new THREE.BufferGeometry();
        lineXGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 1, 0, 0], 3));

        var lineYGeometry = new THREE.BufferGeometry();
        lineYGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 0, 1, 0], 3));

        var lineZGeometry = new THREE.BufferGeometry();
        lineZGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 0, 0, 1], 3));

        this.handleGizmos = {

            X: [
                [new THREE.Mesh(arrowGeometry, new MyGizmoMaterial({color: 0xff0000})), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
                [new THREE.Line(lineXGeometry, new MyGizmoLineMaterial({color: 0xff0000}))]
            ],

            Y: [
                [new THREE.Mesh(arrowGeometry, new MyGizmoMaterial({color: 0x00ff00})), [0, 0.5, 0]],
                [new THREE.Line(lineYGeometry, new MyGizmoLineMaterial({color: 0x00ff00}))]
            ],

            Z: [
                [new THREE.Mesh(arrowGeometry, new MyGizmoMaterial({color: 0x0000ff})), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
                [new THREE.Line(lineZGeometry, new MyGizmoLineMaterial({color: 0x0000ff}))]
            ],

            XYZ: [
                [new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new MyGizmoMaterial({
                    color: 0xffffff,
                    opacity: 0.25
                })), [0, 0, 0], [0, 0, 0]]
            ],

            XY: [
                [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new MyGizmoMaterial({
                    color: 0xffff00,
                    opacity: 0.25
                })), [0.15, 0.15, 0]]
            ],

            YZ: [
                [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new MyGizmoMaterial({
                    color: 0x00ffff,
                    opacity: 0.25
                })), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
            ],

            XZ: [
                [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new MyGizmoMaterial({
                    color: 0xff00ff,
                    opacity: 0.25
                })), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
            ]

        };
        this.pickerGizmos = {

            X: [
                [new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0, 1, 4, 1, false), MyPickerMaterial), [0.6, 0, 0], [0, 0, -Math.PI / 2]]
            ],

            Y: [
                [new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0, 1, 4, 1, false), MyPickerMaterial), [0, 0.6, 0]]
            ],

            Z: [
                [new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0, 1, 4, 1, false), MyPickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]
            ],

            XYZ: [
                [new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), MyPickerMaterial)]
            ],

            XY: [
                [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.3, 0.3), MyPickerMaterial), [0.15, 0.15, 0]]
            ],

            YZ: [
                [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.3, 0.3), MyPickerMaterial), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
            ],

            XZ: [
                [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.3, 0.3), MyPickerMaterial), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
            ]

        };


        this.setActivePlane = function (axis, eye) {

            var tempMatrix = new THREE.Matrix4();
            eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

            if (axis === "X") {

                this.activePlane = this.planes["XY"];

                if (Math.abs(eye.y) > Math.abs(eye.z)) this.activePlane = this.planes["XZ"];

            }

            if (axis === "Y") {

                this.activePlane = this.planes["XY"];

                if (Math.abs(eye.x) > Math.abs(eye.z)) this.activePlane = this.planes["YZ"];

            }

            if (axis === "Z") {

                this.activePlane = this.planes["XZ"];

                if (Math.abs(eye.x) > Math.abs(eye.y)) this.activePlane = this.planes["YZ"];

            }

            if (axis === "XYZ") this.activePlane = this.planes["XYZE"];

            if (axis === "XY") this.activePlane = this.planes["XY"];

            if (axis === "YZ") this.activePlane = this.planes["YZ"];

            if (axis === "XZ") this.activePlane = this.planes["XZ"];

        };

        this.init();

    };
    THREE.MyTransformGizmoTranslate.prototype = Object.create(THREE.MyTransformGizmo.prototype);
    THREE.MyTransformGizmoTranslate.prototype.constructor = THREE.MyTransformGizmoTranslate;

    THREE.MyTransformGizmoRotate = function () {

        THREE.MyTransformGizmo.call( this );

        var CircleGeometry = function ( radius, facing, arc ) {

            var geometry = new THREE.BufferGeometry();
            var vertices = [];
            arc = arc ? arc : 1;

            for ( var i = 0; i <= 64 * arc; ++ i ) {

                if ( facing === 'x' ) vertices.push( 0, Math.cos( i / 32 * Math.PI ) * radius, Math.sin( i / 32 * Math.PI ) * radius );
                if ( facing === 'y' ) vertices.push( Math.cos( i / 32 * Math.PI ) * radius, 0, Math.sin( i / 32 * Math.PI ) * radius );
                if ( facing === 'z' ) vertices.push( Math.sin( i / 32 * Math.PI ) * radius, Math.cos( i / 32 * Math.PI ) * radius, 0 );

            }

            geometry.addAttribute( 'position', new THREE.Float32Attribute( vertices, 3 ) );
            return geometry;

        };

        this.handleGizmos = {

            X: [
                [ new THREE.Line( new CircleGeometry( 1, 'x', 0.5 ), new MyGizmoLineMaterial( { color: 0xff0000 } ) ) ]
            ],

            Y: [
                [ new THREE.Line( new CircleGeometry( 1, 'y', 0.5 ), new MyGizmoLineMaterial( { color: 0x00ff00 } ) ) ]
            ],

            Z: [
                [ new THREE.Line( new CircleGeometry( 1, 'z', 0.5 ), new MyGizmoLineMaterial( { color: 0x0000ff } ) ) ]
            ],

            E: [
                [ new THREE.Line( new CircleGeometry( 1.25, 'z', 1 ), new MyGizmoLineMaterial( { color: 0xcccc00 } ) ) ]
            ],

            XYZE: [
                [ new THREE.Line( new CircleGeometry( 1, 'z', 1 ), new MyGizmoLineMaterial( { color: 0x787878 } ) ) ]
            ]

        };

        this.pickerGizmos = {

            X: [
                [ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.02, 4, 12, Math.PI ), MyPickerMaterial ), [ 0, 0, 0 ], [ 0, - Math.PI / 2, - Math.PI / 2 ] ]
            ],

            Y: [
                [ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.02, 4, 12, Math.PI ), MyPickerMaterial ), [ 0, 0, 0 ], [ Math.PI / 2, 0, 0 ] ]
            ],

            Z: [
                [ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.02, 4, 12, Math.PI ), MyPickerMaterial ), [ 0, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
            ],

            E: [
                [ new THREE.Mesh( new THREE.TorusGeometry( 1.25, 0.02, 2, 24 ), MyPickerMaterial ) ]
            ],

            XYZE: [
                [ new THREE.Mesh( new THREE.Geometry() ) ]// TODO
            ]

        };

        this.setActivePlane = function ( axis ) {

            if ( axis === "E" ) this.activePlane = this.planes[ "XYZE" ];

            if ( axis === "X" ) this.activePlane = this.planes[ "YZ" ];

            if ( axis === "Y" ) this.activePlane = this.planes[ "XZ" ];

            if ( axis === "Z" ) this.activePlane = this.planes[ "XY" ];

        };

        this.update = function ( rotation, eye2 ) {

            THREE.MyTransformGizmo.prototype.update.apply( this, arguments );

            var group = {

                handles: this[ "handles" ],
                pickers: this[ "pickers" ],

            };

            var tempMatrix = new THREE.Matrix4();
            var worldRotation = new THREE.Euler( 0, 0, 1 );
            var tempQuaternion = new THREE.Quaternion();
            var unitX = new THREE.Vector3( 1, 0, 0 );
            var unitY = new THREE.Vector3( 0, 1, 0 );
            var unitZ = new THREE.Vector3( 0, 0, 1 );
            var quaternionX = new THREE.Quaternion();
            var quaternionY = new THREE.Quaternion();
            var quaternionZ = new THREE.Quaternion();
            var eye = eye2.clone();

            worldRotation.copy( this.planes[ "XY" ].rotation );
            tempQuaternion.setFromEuler( worldRotation );

            tempMatrix.makeRotationFromQuaternion( tempQuaternion ).getInverse( tempMatrix );
            eye.applyMatrix4( tempMatrix );

            this.traverse( function( child ) {

                tempQuaternion.setFromEuler( worldRotation );

                if ( child.name === "X" ) {

                    quaternionX.setFromAxisAngle( unitX, Math.atan2( - eye.y, eye.z ) );
                    tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
                    child.quaternion.copy( tempQuaternion );

                }

                if ( child.name === "Y" ) {

                    quaternionY.setFromAxisAngle( unitY, Math.atan2( eye.x, eye.z ) );
                    tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
                    child.quaternion.copy( tempQuaternion );

                }

                if ( child.name === "Z" ) {

                    quaternionZ.setFromAxisAngle( unitZ, Math.atan2( eye.y, eye.x ) );
                    tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );
                    child.quaternion.copy( tempQuaternion );

                }

            } );

        };

        this.init();

    };
    THREE.MyTransformGizmoRotate.prototype = Object.create( THREE.MyTransformGizmo.prototype );
    THREE.MyTransformGizmoRotate.prototype.constructor = THREE.MyTransformGizmoRotate;

    THREE.MyTransformGizmoScale = function () {

        THREE.MyTransformGizmo.call( this );

        var arrowGeometry = new THREE.Geometry();
        var mesh = new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ) );
        mesh.position.y = 0.5;
        mesh.updateMatrix();

        arrowGeometry.merge( mesh.geometry, mesh.matrix );

        var lineXGeometry = new THREE.BufferGeometry();
        lineXGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

        var lineYGeometry = new THREE.BufferGeometry();
        lineYGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

        var lineZGeometry = new THREE.BufferGeometry();
        lineZGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

        this.handleGizmos = {

            X: [
                [ new THREE.Mesh( arrowGeometry, new MyGizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
                [ new THREE.Line( lineXGeometry, new MyGizmoLineMaterial( { color: 0xff0000 } ) ) ]
            ],

            Y: [
                [ new THREE.Mesh( arrowGeometry, new MyGizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
                [ new THREE.Line( lineYGeometry, new MyGizmoLineMaterial( { color: 0x00ff00 } ) ) ]
            ],

            Z: [
                [ new THREE.Mesh( arrowGeometry, new MyGizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
                [ new THREE.Line( lineZGeometry, new MyGizmoLineMaterial( { color: 0x0000ff } ) ) ]
            ],

            XYZ: [
                [ new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ), new MyGizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
            ]

        };

        this.pickerGizmos = {

            X: [
                [ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), MyPickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
            ],

            Y: [
                [ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), MyPickerMaterial ), [ 0, 0.6, 0 ] ]
            ],

            Z: [
                [ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), MyPickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
            ],

            XYZ: [
                [ new THREE.Mesh( new THREE.BoxGeometry( 0.4, 0.4, 0.4 ), MyPickerMaterial ) ]
            ]

        };

        this.setActivePlane = function ( axis, eye ) {

            var tempMatrix = new THREE.Matrix4();
            eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

            if ( axis === "X" ) {

                this.activePlane = this.planes[ "XY" ];
                if ( Math.abs( eye.y ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "XZ" ];

            }

            if ( axis === "Y" ) {

                this.activePlane = this.planes[ "XY" ];
                if ( Math.abs( eye.x ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "YZ" ];

            }

            if ( axis === "Z" ) {

                this.activePlane = this.planes[ "XZ" ];
                if ( Math.abs( eye.x ) > Math.abs( eye.y ) ) this.activePlane = this.planes[ "YZ" ];

            }

            if ( axis === "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

        };

        this.init();

    };

    THREE.MyTransformGizmoScale.prototype = Object.create( THREE.MyTransformGizmo.prototype );
    THREE.MyTransformGizmoScale.prototype.constructor = THREE.MyTransformGizmoScale;


    THREE.MyTransformControls = function (camera, domElement) {

        THREE.Object3D.call(this);
        domElement = ( domElement !== undefined ) ? domElement : document;
        this.hasIntersect=false;
        this.translationSnap = null;
        this.rotationSnap = null;
        this.object = undefined;
        var scope = this;
        var _dragging = false;
        this.axis = null;
        this.space = "world";

        var _mode = "translate";
        var ray = new THREE.Raycaster();
        var pointerVector = new THREE.Vector2();
        this.oldScale ={};
        this.oldPosition = {};
        this.oldRotationMatrix ={};
        this.worldRotationMatrix ={};
        this.parentRotationMatrix={};
        this.parentScale = {};
        this.tempQuaternion ={};
        var tempVector =new THREE.Vector3();




        var point = new THREE.Vector3();
        var rotation = new THREE.Vector3();
        var offset = new THREE.Vector3();
        var offsetRotation = new THREE.Vector3();

        var tempMatrix = new THREE.Matrix4();



        var unitX = new THREE.Vector3( 1, 0, 0 );
        var unitY = new THREE.Vector3( 0, 1, 0 );
        var unitZ = new THREE.Vector3( 0, 0, 1 );

        var quaternionXYZ = new THREE.Quaternion();
        var quaternionX = new THREE.Quaternion();
        var quaternionY = new THREE.Quaternion();
        var quaternionZ = new THREE.Quaternion();
        var quaternionE = new THREE.Quaternion();

        var worldPosition = new THREE.Vector3();
        var worldRotationSelected = new THREE.Euler();
        var MatrixSelected=new THREE.Matrix4();
        var eye = new THREE.Vector3();
        var camPosition = new THREE.Vector3();
        var scale = 1;
        this.size = 1;

        var changeEvent = {type: "change"};
        var mouseDownEvent = {type: "mouseDown"};
        var mouseUpEvent = {type: "mouseUp", mode: _mode};
        var objectChangeEvent = {type: "objectChange"};

        var _gizmo = {
            "translate": new THREE.MyTransformGizmoTranslate(),
            "rotate": new THREE.MyTransformGizmoRotate(),
            "scale": new THREE.MyTransformGizmoScale()
        };

        for (var type in _gizmo) {
            var gizmoObj = _gizmo[type];
            gizmoObj.visible = ( type === _mode );
            this.add(gizmoObj);
        }

        this.attach = function (object) {

            this.object = object;
            this.visible = true;
            this.update();

        };

        this.detach = function () {

            this.object = undefined;
            this.visible = false;
            //this.axis = null;

        };
        this.update = function () {

            if (scope.object === undefined) return;
            for (var i in scope.object) {

              scope.object[i].updateMatrixWorld();
            }

            worldPosition.copy(editor.getSelectedPosition(scope.object));
            worldRotationSelected.copy(editor.getSelectedRotation(scope.object) );
            MatrixSelected.makeRotationFromEuler(worldRotationSelected);
            camera.updateMatrixWorld();
            camPosition.setFromMatrixPosition(camera.matrixWorld);

            scale = worldPosition.distanceTo(camPosition) / 20 * scope.size;
            this.position.copy(worldPosition);
            this.scale.set(scale, scale, scale);
            eye.copy(camPosition).sub(worldPosition).normalize();

            if (scope.space === "world") {

                _gizmo[_mode].update(new THREE.Euler(), eye);

            }else if ( scope.space === "local" ) {

                _gizmo[ _mode ].update( worldRotationSelected, eye );

            }

            _gizmo[_mode].highlight(scope.axis);
            /* worldPosition.copy(editor.getWorldPosition(scope.object));
             worldRotationSelected.setFromRotationMatrix( tempMatrix.extractRotation( scope.object.matrixWorld ) );

             camera.updateMatrixWorld();
             camPosition.setFromMatrixPosition( camera.matrixWorld );
             camRotation.setFromRotationMatrix( tempMatrix.extractRotation( camera.matrixWorld ) );

             scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;
             this.position.copy( worldPosition );
             this.scale.set( scale, scale, scale );

             eye.copy( camPosition ).sub( worldPosition ).normalize();

             if ( scope.space === "local" ) {

             _gizmo[ _mode ].update( worldRotationSelected, eye );

             } else if ( scope.space === "world" ) {

             _gizmo[ _mode ].update( new THREE.Euler(), eye );

             }

             _gizmo[ _mode ].highlight( scope.axis );*/

        };
        domElement.addEventListener("mousemove", onPointerHover, false);
        domElement.addEventListener("touchmove", onPointerHover, false);

        domElement.addEventListener("mousedown", onPointerDown, false);
        domElement.addEventListener("touchstart", onPointerDown, false);

        domElement.addEventListener("mousemove", onPointerMove, false);
        domElement.addEventListener("touchmove", onPointerMove, false);

        domElement.addEventListener("mouseup", onPointerUp, false);
        domElement.addEventListener("mouseout", onPointerUp, false);
        domElement.addEventListener("touchend", onPointerUp, false);
        domElement.addEventListener("touchcancel", onPointerUp, false);
        domElement.addEventListener("touchleave", onPointerUp, false);
        this.dispose = function () {

            domElement.removeEventListener("mousedown", onPointerDown);
            domElement.removeEventListener("touchstart", onPointerDown);

            domElement.removeEventListener("mousemove", onPointerHover);
            domElement.removeEventListener("touchmove", onPointerHover);

            domElement.removeEventListener("mousemove", onPointerMove);
            domElement.removeEventListener("touchmove", onPointerMove);

            domElement.removeEventListener("mouseup", onPointerUp);
            domElement.removeEventListener("mouseout", onPointerUp);
            domElement.removeEventListener("touchend", onPointerUp);
            domElement.removeEventListener("touchcancel", onPointerUp);
            domElement.removeEventListener("touchleave", onPointerUp);

        };

        this.setMode = function (mode) {

            _mode = mode ? mode : _mode;

            if (_mode === "scale"){
                scope.space = "local";
            }else{
                scope.space = "world";
            }

            for (var type in _gizmo) _gizmo[type].visible = ( type === _mode );

            this.update();
            scope.dispatchEvent(changeEvent);

        };
        function onPointerHover(event) {

            if (scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 )) return;

            var pointer = event.changedTouches ? event.changedTouches[0] : event;

            var intersect = intersectObjects(pointer, _gizmo[_mode].pickers.children);

            var axis = null;

            if (intersect) {

                axis = intersect.object.name;

                event.preventDefault();

            }

            if (scope.axis !== axis) {

                scope.axis = axis;

                scope.update();
                scope.dispatchEvent(changeEvent);

            }

        }

        function onPointerDown(event) {

            if (scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 )) return;

            var pointer = event.changedTouches ? event.changedTouches[0] : event;

            if (pointer.button === 0 || pointer.button === undefined) {

                var intersect = intersectObjects(pointer, _gizmo[_mode].pickers.children);

                if (intersect) {

                    event.preventDefault();
                    event.stopPropagation();

                    scope.dispatchEvent(mouseDownEvent);

                    scope.axis = intersect.object.name;
                    nicai=scope;
                    scope.update();

                    eye.copy(camPosition).sub(worldPosition).normalize();

                    _gizmo[_mode].setActivePlane(scope.axis, eye);

                    var planeIntersect = intersectObjects(pointer, [_gizmo[_mode].activePlane]);

                    if (planeIntersect) {
                        for (var i in scope.object) {
                            scope.oldPosition[i] = new THREE.Vector3();
                            scope.oldPosition[i].copy(scope.object[i].position);
                            scope.oldRotationMatrix[i] = new THREE.Matrix4();
                            scope.oldRotationMatrix[i].extractRotation( scope.object[i].matrix );
                            scope.worldRotationMatrix[i] = new THREE.Matrix4();
                            scope.worldRotationMatrix[i].extractRotation( scope.object[i].matrixWorld );

                            scope.parentRotationMatrix[i] = new THREE.Matrix4();
                            scope.parentRotationMatrix[i].extractRotation( scope.object[i].parent.matrixWorld );
                            scope.oldScale[i] = new THREE.Vector3();
                            scope.oldScale[i].copy( scope.object[i].scale );
                            scope.parentScale[i]=new THREE.Vector3();
                            scope.parentScale[i].setFromMatrixScale( tempMatrix.getInverse( scope.object[i].parent.matrixWorld ) );
                        }
                      //  MatrixSelected=editor.getSelectedMatrix4(scope.object);

                        offset.copy(planeIntersect.point);
                        scope.hasIntersect=true;

                    }

                }

            }

            _dragging = true;

        }

        function onPointerMove(event) {

            if (scope.object === undefined || scope.axis === null || _dragging === false || ( event.button !== undefined && event.button !== 0 )) return;

            var pointer = event.changedTouches ? event.changedTouches[0] : event;

            var planeIntersect = intersectObjects(pointer, [_gizmo[_mode].activePlane]);

            if (planeIntersect === false) return;

            event.preventDefault();
            event.stopPropagation();

            point.copy(planeIntersect.point);

            if (_mode === "translate") {

                point.sub(offset);
              //  point.multiply( parentScale );


                if (scope.space === "world" || scope.axis.search("XYZ") !== -1) {

                    if (scope.axis.search("X") === -1) point.x = 0;
                    if (scope.axis.search("Y") === -1) point.y = 0;
                    if (scope.axis.search("Z") === -1) point.z = 0;




                    for (var i in scope.object) {
                        point.multiply( scope.parentScale[i] );
                        point.applyMatrix4( tempMatrix.getInverse( scope.parentRotationMatrix[i] ) );

                        scope.object[i].position.copy(scope.oldPosition[i]);
                        scope.object[i].position.add(point);
                    }


                }

                /*  if ( scope.translationSnap !== null ) {

                 if ( scope.space === "local" ) {

                 // scope.object.position.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

                 }

                 if ( scope.axis.search( "X" ) !== - 1 ) scope.object.position.x = Math.round( scope.object.position.x / scope.translationSnap ) * scope.translationSnap;
                 if ( scope.axis.search( "Y" ) !== - 1 ) scope.object.position.y = Math.round( scope.object.position.y / scope.translationSnap ) * scope.translationSnap;
                 if ( scope.axis.search( "Z" ) !== - 1 ) scope.object.position.z = Math.round( scope.object.position.z / scope.translationSnap ) * scope.translationSnap;

                 if ( scope.space === "local" ) {

                 //  scope.object.position.applyMatrix4( worldRotationMatrix );

                 }

                 }*/

            }else if ( _mode === "rotate" ) {

                point.sub( worldPosition );
                //point.multiply( parentScale );
                tempVector.copy( offset ).sub( worldPosition );
               // tempVector.multiply( parentScale );

                if ( scope.axis === "E" ) {

                 //  point.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );
                 //  tempVector.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );

                 //  rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
                 //  offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

                 //  tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

                 //  quaternionE.setFromAxisAngle( eye, rotation.z - offsetRotation.z );
                 //  quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

                 //  tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionE );
                 //  tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

                 //  scope.object.quaternion.copy( tempQuaternion );

                } else if ( scope.axis === "XYZE" ) {

                  // quaternionE.setFromEuler( point.clone().cross( tempVector ).normalize() ); // rotation axis

                  // tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );
                  // quaternionX.setFromAxisAngle( quaternionE, - point.clone().angleTo( tempVector ) );
                  // quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

                  // tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
                  // tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

                  // scope.object.quaternion.copy( tempQuaternion );

                } else if ( scope.space === "local" ) {

                //   point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

                //   tempVector.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

                //   rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
                //   offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

                //   quaternionXYZ.setFromRotationMatrix( oldRotationMatrix );

                 // if ( scope.rotationSnap !== null ) {
//
                 //     quaternionX.setFromAxisAngle( unitX, Math.round( ( rotation.x - offsetRotation.x ) / scope.rotationSnap ) * scope.rotationSnap );
                 //     quaternionY.setFromAxisAngle( unitY, Math.round( ( rotation.y - offsetRotation.y ) / scope.rotationSnap ) * scope.rotationSnap );
                 //     quaternionZ.setFromAxisAngle( unitZ, Math.round( ( rotation.z - offsetRotation.z ) / scope.rotationSnap ) * scope.rotationSnap );
//
                 // } else {
//
                 //     quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
                 //     quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
                 //     quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );
//
                 // }
                    //quaternionXYZ.setFromRotationMatrix( worldRotationMatrix[i] );

                //   if ( scope.axis === "X" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionX );
                //   if ( scope.axis === "Y" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionY );
                //   if ( scope.axis === "Z" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionZ );

                //   scope.object.quaternion.copy( quaternionXYZ );

                } else if ( scope.space === "world" ) {


                    rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
                    offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

                    for(var i in scope.object){

                        scope.tempQuaternion[i]=new THREE.Quaternion();
                        scope.tempQuaternion[i].setFromRotationMatrix( tempMatrix.getInverse( scope.parentRotationMatrix[i] ) );
                    }


                   if ( scope.rotationSnap !== null ) {

                    quaternionX.setFromAxisAngle( unitX, Math.round( ( rotation.x - offsetRotation.x ) / scope.rotationSnap ) * scope.rotationSnap );
                    quaternionY.setFromAxisAngle( unitY, Math.round( ( rotation.y - offsetRotation.y ) / scope.rotationSnap ) * scope.rotationSnap );
                    quaternionZ.setFromAxisAngle( unitZ, Math.round( ( rotation.z - offsetRotation.z ) / scope.rotationSnap ) * scope.rotationSnap );

                   } else {

                       quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
                       quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
                       quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

                   }


                    for(var i in scope.object){
                        quaternionXYZ.setFromRotationMatrix( scope.worldRotationMatrix[i] );

                   if ( scope.axis === "X" ) scope.tempQuaternion[i].multiplyQuaternions( scope.tempQuaternion[i], quaternionX );
                   if ( scope.axis === "Y" ) scope.tempQuaternion[i].multiplyQuaternions( scope.tempQuaternion[i], quaternionY );
                   if ( scope.axis === "Z" ) scope.tempQuaternion[i].multiplyQuaternions( scope.tempQuaternion[i], quaternionZ );

                        scope.tempQuaternion[i].multiplyQuaternions( scope.tempQuaternion[i], quaternionXYZ );
                        scope.object[i].quaternion.copy(  scope.tempQuaternion[i] );

                     //   var matrix=new THREE.Matrix4();
                      // var Euler=new THREE.Euler();
                      // var vector2=new THREE.Vector3();
                      // Euler.setFromRotationMatrix(scope.object[i].matrixWorld);
                      // vector2.setFromMatrixScale(scope.object[i].matrixWorld);

                      // console.log(vector2)
                      // vector2.applyEuler(Euler);
                      // vector2.sub(scope.object[i].parent.scale)
                      // scope.object[i].scale.copy(vector2)





                    }

                }

            }else if ( _mode === "scale" ) {

                point.sub( offset );
                //point.multiply( parentScale );
               // nicai=editor.getSelectedMatrix4(scope.object);

              //  point.applyMatrix4(tempMatrix.getInverse(editor.getSelectedMatrix4(scope.object)) )
                if ( scope.space === "local" ) {
                     for(var i in scope.object){
                         if ( scope.axis === "XYZ" ) {

                             scale = 1 + ( ( point.y ) / 50 );

                             scope.object[i].scale.x = scope.oldScale[i].x * scale;
                             scope.object[i].scale.y = scope.oldScale[i].y * scale;
                             scope.object[i].scale.z = scope.oldScale[i].z * scale;

                         } else {

                             point.applyMatrix4( tempMatrix.getInverse(MatrixSelected ) );
                           // scope.object[i].traverse(function(child){
                           //     if(child instanceof THREE.Group){
                                   	if ( scope.axis === "X" )  scope.object[i].scale.x = scope.oldScale[i].x * ( 1 + point.x / 50 );
                                   	if ( scope.axis === "Y" )  scope.object[i].scale.y = scope.oldScale[i].y * ( 1 + point.y / 50 );
                                   	if ( scope.axis === "Z" )  scope.object[i].scale.z = scope.oldScale[i].z * ( 1 + point.z / 50 );
                           //      }
                           //  })


                         }
                     }
                }

            }

            scope.update();
            scope.dispatchEvent(changeEvent);
            scope.dispatchEvent(objectChangeEvent);

        }

        function onPointerUp(event) {

            if (event.button !== undefined && event.button !== 0) return;

            if (_dragging && ( scope.axis !== null )) {

                mouseUpEvent.mode = _mode;
                scope.dispatchEvent(mouseUpEvent)

            }

            _dragging = false;
            scope.hasIntersect=false;
            onPointerHover(event);

        }

        function intersectObjects(pointer, objects) {

            var rect = domElement.getBoundingClientRect();
            var x = ( pointer.clientX - rect.left ) / rect.width;
            var y = ( pointer.clientY - rect.top ) / rect.height;

            pointerVector.set(( x * 2 ) - 1, -( y * 2 ) + 1);
            ray.setFromCamera(pointerVector, camera);

            var intersections = ray.intersectObjects(objects, true);
            return intersections[0] ? intersections[0] : false;

        }
    }
    THREE.MyTransformControls.prototype = Object.create(THREE.Object3D.prototype);
    THREE.MyTransformControls.prototype.constructor = THREE.MyTransformControls;

}());