/**
 * Created by admin on 2016/4/14.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Firstperson = function ( camera , domElement ) {

    //移动速度
    this.fast = 0.1;
    //旋转速度
    var xunfast = 0.001;
    //身高
    this.height = 10;
    this.domElement = ( domElement !== undefined ) ? domElement : document;
    var domElementT = this.domElement;
    this.enabled = true;
    this.startPosition = new THREE.Vector3(0,0,0);

    var scope = this;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var velocity = new THREE.Vector3();
    var PI_2 = Math.PI / 2;

    camera.rotation.set( 0, 0, 0 );
    camera.position.set(0, 0, 0 );
    this.cameraClon = camera;
    this.cameraClon.position.y = this.height;


    var onMouseDown = function ( event ) {

        var onMouseMove = function ( event ) {

            if ( scope.enabled === false ) return;
            var movementX = (event.movementX || event.mozMovementX || event.webkitMovementX || 0);
            var movementY = (event.movementY || event.mozMovementY || event.webkitMovementY || 0);

            editor.controls.cameraClon.rotation.y -= movementX * xunfast;
            editor.controls.cameraClon.rotation.x -= movementY * xunfast;
            //editor.controls.cameraClon.rotation.y = Math.max( - PI_2, Math.min( PI_2, editor.controls.cameraClon.rotation.y ) );
            //editor.controls.cameraClon.rotation.x = Math.max( - PI_2, Math.min( PI_2, editor.controls.cameraClon.rotation.x ) );
        };

        var onMouseUp = function ( event ){
            document.removeEventListener( 'mousemove', onMouseMove, false );
        };

        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
    };

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {
            case 87: // w
                moveForward = true;
                break;
            case 65: // a
                moveLeft = true;
                break;
            case 83: // s
                moveBackward = true;
                break;
            case 68: // d
                moveRight = true;
                break;
        }
    };
    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {
            case 87: // w
                moveForward = false;
                break;
            case 65: // a
                moveLeft = false;
                break;
            case 83: // s
                moveBackward = false;
                break;
            case 68: // d
                moveRight = false;
                break;
        }
    };

    this.dispose = function() {

        this.domElement.removeEventListener( 'mousedown', onMouseDown, false );
        window.removeEventListener( 'keydown', onKeyDown, false );
        window.removeEventListener( 'keyup', onKeyUp, false );

    };

    this.getObject = function () {
        return editor.controls.cameraClon;
    };

    this.update = function(){

        velocity.x = 0;
        velocity.z = 0;
        velocity.y = 0;

        if ( moveForward ) velocity.z -= 400.0 * this.fast;
        if ( moveBackward ) velocity.z += 400.0 * this.fast;

        if ( moveLeft ) velocity.x -= 400.0 * this.fast;
        if ( moveRight ) velocity.x += 400.0 * this.fast;

        this.getObject().translateX( velocity.x * this.fast );
        this.getObject().translateY( velocity.y * this.fast );
        this.getObject().translateZ( velocity.z * this.fast );

        if ( this.getObject().position.y != this.height ) {
            velocity.y = 0;
            this.getObject().position.y = this.height;
        }
    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated
        var direction = new THREE.Vector3( 0, 0, - 1 );
        var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

        return function( v ) {
            rotation.set( editor.controls.cameraClon.rotation.x, editor.controls.cameraClon.rotation.y, 0 );
            v.copy( direction ).applyEuler( rotation );
            return v;
        };
    }();

    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    window.addEventListener( 'keydown', onKeyDown, true );
    window.addEventListener( 'keyup', onKeyUp, false );

};
