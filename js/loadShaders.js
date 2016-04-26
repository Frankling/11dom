/**
 * Created by asforever on 2016/3/19.
 */
var loadShaders=function(){
    this.load= function(type,obj,drawTime){
        switch (type){
            case "fur":
                var child=obj;
                var parent=child.parent;
                var colorLoad=function(texture){
                };
                var colorMap =new THREE.TextureLoader().load( "image/shaders/11133-v4.jpg",colorLoad);
                colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
                var generateTexture=function () {

                    var canvas = document.createElement( 'canvas' );
                    canvas.width = 256;
                    canvas.height = 256;

                    var context = canvas.getContext( '2d' );

                    for ( var i = 0; i < 2000; ++i ) {

                        // r = hair 1/0
                        // g = length
                        // b = darkness
                        context.fillStyle = "rgba(255," + Math.floor( Math.random() * 255 ) + ","+ Math.floor( Math.random() * 255 ) +",1)";
                        context.fillRect( ( Math.random() * canvas.width ), ( Math.random() * canvas.height ), 15, 15 );
                    }
                    return canvas;

                };
                var texture = new THREE.Texture( generateTexture() );
                texture.needsUpdate = true;
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                var geometry=child.geometry;
                //var object=new THREE.Object3D();
                //object.uuid=child.uuid;
                //object.name=child.name;
                var v=new THREE.Vector3()
                for (var i=0;i<drawTime;i++){
                    var mat=new THREE.FurMaterial({texture:texture, colorMap:colorMap, offset:i/50, globalTime:0.5, gravity:v});
                    var mesh=new THREE.Mesh(geometry.clone(),mat);
                    //mesh.name=child.name+"fur";
                    //mesh.position.copy( child.position);
                    //mesh.rotation.copy(child.rotation);
                    //mesh.scale.copy(child.scale);

                    child.add(mesh);
                }
                //editor.removeObject(child);
                //editor.addObject(object,parent);
                child.material=mat;
                break
        }

    }
}