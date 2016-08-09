/**
 * Created by asforever on 2016/6/16.
 */
var eventSystem={

};

eventSystem.event=function(obj){
    this.parent=obj;
    this.lib={
        mouseEvent:{type:"mouseEvent",children:[],parent:obj},
        moveEvent:{type:"moveEvent",children:[],parent:obj},
        materialEvent:{type:"materialEvent",children:[],parent:obj}
    };
};
eventSystem.ui=function(obj){

};

eventSystem.event.prototype={
    addAttribute:function(type,attribute){
        var parent= this.lib[type];

        var child={
            attribute:attribute,
            parent:parent,
            last:null,
            next:null
        };
        parent.children.push(child);
    },

    dispatch:function(event){
        var scope=this;

        var ms = 200;
        var frame=0;
        if(event.parent.type=="moveEvent"){

            /*new TWEEN.Tween( event.parent.parent.position ).to( {
             x: event.attribute.position.x,
             y: event.attribute.position.y,
             z: event.attribute.position.z }, 2000 )
             .easing( TWEEN.Easing.Elastic.Out).start()
             .onUpdate(function(){
             TWEEN.update();
             editor.signals.sceneGraphChanged.dispatch();
             });
             TWEEN.update();*/

            var obj = event.parent.parent;

            var diff_move_x = event.attribute.position.x - event.parent.parent.position.x;
            var diff_move_y = event.attribute.position.y - event.parent.parent.position.y;
            var diff_move_z = event.attribute.position.z - event.parent.parent.position.z;

            var diff_rotate_x = (event.attribute.rotation.x*Math.PI/180-(obj.getWorldRotation().x- obj.rotation.x))- event.parent.parent.rotation.x;
            var diff_rotate_y = (event.attribute.rotation.y*Math.PI/180-(obj.getWorldRotation().y- obj.rotation.y))- event.parent.parent.rotation.y;
            var diff_rotate_z = (event.attribute.rotation.z*Math.PI/180-(obj.getWorldRotation().z- obj.rotation.z))- event.parent.parent.rotation.z;

            var diff_scale_x = event.attribute.scale.x - event.parent.parent.scale.x;
            var diff_scale_y = event.attribute.scale.y - event.parent.parent.scale.y;
            var diff_scale_z = event.attribute.scale.z - event.parent.parent.scale.z;

            var unitMove=new THREE.Vector3(diff_move_x/ms,diff_move_y/ms,diff_move_z/ms);
            var unitScale=new THREE.Vector3(diff_scale_x/ms,diff_scale_y/ms,diff_scale_z/ms);
            function move(){
                frame++;
                event.parent.parent.position.add(unitMove);

                event.parent.parent.rotation.x += diff_rotate_x/ms;
                event.parent.parent.rotation.y += diff_rotate_y/ms;
                event.parent.parent.rotation.z += diff_rotate_z/ms;

                event.parent.parent.scale.add(unitScale);
                editor.signals.sceneGraphChanged.dispatch();
                if(frame<ms){
                    requestAnimationFrame(move);
                }
                else{
                    NextEvent();
                }
            }
            move();
        }
        else {NextEvent();}

        if(event.parent.type=="materialEvent"){
            event.parent.parent.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.color!==undefined&&child.material.color.getHex()!==parseInt(event.attribute.color.substr( 1 ), 16 )){
                            child.material.color.setHex(parseInt(event.attribute.color.substr( 1 ), 16 ));
                        }
                    }
                }
            });
            editor.signals.sceneGraphChanged.dispatch();
            NextEvent();
        }
        function NextEvent() {
            if (event.next) {
                requestAnimationFrame(function () {
                    scope.dispatch(event.next)
                }.bind(this));
            }
        }
    }
};
eventSystem.ui.prototype={
    createEditor:function(type,attribute){

    }

}

