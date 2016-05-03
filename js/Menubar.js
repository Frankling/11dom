/**
 * Created by DELL on 2016/1/8.
 */
var Menubar = function ( editor ) {
    var container = new UI.Panel().setId('menuBar');
    container.add(new Menubar.object(editor));
    container.add(new Menubar.light(editor));
    container.add(new Menubar.scenarios(editor));
    container.add(new Menubar.Vr(editor));

    container.add(new Menubar.interface(editor));
    return container;
};