/**
 * Created by asforever on 2016/3/21.
 */
THREE.FurMaterial = function ( parameters ) {

    THREE.ShaderMaterial.call( this );
    this.transparent=true;
    this.type="FurMaterial";
    if ( parameters !== undefined ) {
        if ( parameters.attributes !== undefined ) {
            console.error( 'THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.' );
        }

        var uniform={
            color:{ type: "c", value: new THREE.Color( 0xffffff ) },
            hairMap:    { type: "t", value:  parameters.texture },
            colorMap:    { type: "t", value: parameters.colorMap },
            offset:	{ type: "f", value:   parameters.offset},
            globalTime:	{ type: "f",value:parameters.globalTime},
            gravity: 	{ type: "v3", value:  parameters.gravity}

        }
        var v  =xmlDoc.getElementById( "fur").children[0].textContent;
        var f=xmlDoc.getElementById( "fur").children[1].textContent;
        this.setValues( {uniforms:uniform,vertexShader:v,fragmentShader:f});

    }

};

THREE.FurMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.FurMaterial.prototype.constructor = THREE.FurMaterial;
THREE.FurMaterial.prototype.animate=function(){
    var x=0;
    var scope=this;
    var start=function(){
        x++;
        scope.uniforms.gravity.value.z=Math.sin(x/10);
        editor.signals.sceneGraphChanged.dispatch();
      //scope.uniforms.globalTime=Math.random();
        requestAnimationFrame(start);
    }
    start();
};