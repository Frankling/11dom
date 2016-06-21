/**
 * Created by asforever on 2016/6/16.
 */
(function(editor){
    var hidenList=function(){
        this.dom = document.createElement("div");
        this.dom.className="hiddenList";

    };
    hidenList.prototype.update=function(){
        var list=document.createElement("div");
        list.className="listOfObject3D";
        list.style.height="16px";
        list.style.marginTop="3px";

        var cloneNode=function(obj,div){
            var lishClone=div.cloneNode();
            lishClone.innerHTML=obj.name;
            return lishClone;
        };
        var l=this.dom.children.length-1;
        while(l>=0){
            this.dom.removeChild(this.dom.children[l]);
            l--;
        }


        var children=editor.scene.children;
        var l=children.length;
        for(var i=0;i<l;i++){
            if(children[i] instanceof THREE.LightObject){
                this.dom.appendChild(cloneNode(children[i],list));
            }


        }
        this.dom.appendChild(cloneNode(editor.camera,list));
        editor.skybox.name="skybox";
        this.dom.appendChild(cloneNode(editor.skybox,list));

    };
    var dom=new hidenList();
    document.getElementById(editor.scene.uuid).appendChild(dom.dom);
    dom.update();
    editor.signals.objectRemove.add(function(){
        dom.update();
    });
    editor.signals.objectAdded.add(function(){
        dom.update();
    });
    editor.hiddenList=dom;
})(editor);
