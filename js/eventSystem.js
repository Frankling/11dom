/**
 * Created by asforever on 2016/6/16.
 */
var eventSystem={

};

eventSystem.event=function(obj){
    this.parent=obj;
    this.lib={
        mouseEvent:{type:"mouseEvent",children:[]},
        moveEvent:{type:"moveEvent",children:[]},
        materialEvent:{type:"materialEvent",children:[]}
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

    }
};
eventSystem.ui.prototype={
    createEditor:function(type,attribute){

    }

}

