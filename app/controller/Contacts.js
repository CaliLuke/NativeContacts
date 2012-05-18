/*
 * File: app/controller/Contacts.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Contact.controller.Contacts', {
    extend: 'Ext.app.Controller',
    config: {
        stores: [
            'ContactStore'
        ],

        refs: {
            contactinfo: {
                selector: 'contactinfo',
                xtype: 'contactinfo',
                autoCreate: true
            },
            contactform: {
                selector: 'contactform',
                xtype: 'contactform',
                autoCreate: true
            },
            contactlist: {
                selector: 'contactlist',
                xtype: 'contactlist',
                autoCreate: true
            }
        },

        control: {
            "button#addContactBtn": {
                tap: 'onAddContactBtnTap'
            },
            "button#addGroupBtn": {
                tap: 'onAddGroupBtnTap'
            },
            "button#saveContactBtn": {
                tap: 'onSaveContactBtnTap'
            },
            "button#editContactBtn": {
                tap: 'onEditContactBtnTap'
            },
            "button#cancelBtn": {
                tap: 'onCancelBtnTap'
            },
            "button#infoBackBtn": {
                tap: 'onInfoBackBtnTap'
            },
            "dataview": {
                itemtap: 'onContactListTap'
            },
            "grouplist": {
                itemtap: 'onGroupListItemTap'
            },
            "tabpanel": {
                activate: 'onTabpanelActivate',
                activeitemchange: 'onTabpanelActiveItemChange'
            },
            "contactpic": {
                change: 'onContactPickerChange'
            }
        }
    },

    onAddContactBtnTap: function(button, e, options) {
        var referrer = Ext.Viewport.getActiveItem();
        var form = this.getContactform();
        form.setRecord(null);
        form.reset();
        form.referrer = referrer;
        Ext.Viewport.setActiveItem(form);
    },

    onAddGroupBtnTap: function(button, e, options) {
        Ext.Msg.prompt('Add Group',
        'Enter the group name',
        function (button, name) {
            if (button === 'ok') {
                var cc = Contact.app.getController('Contacts');

                // Only add if it doesn't exist
                if (!cc.findGroup(name)) {
                    var gs = Ext.StoreMgr.lookup('GroupStore');

                    gs.add({name:name});

                    console.log('Saved '+name+' group');
                }
                else {
                    Ext.Msg.alert(name+' group exists', 'Please enter a different name');
                }

            }
        });
    },

    onSaveContactBtnTap: function(button, e, options) {
        var form = this.getContactform();
        var errors = form.getValidationErrors();

        if (errors.length) {
            Ext.Msg.alert('Error', errors.join('<br/>'));
        } else {
            var values = form.getValues();
            var record = form.getRecord();
            if (record) {
                record.setData(values);
                record.commit();
                if (form.referrer.setInfo) {
                    form.referrer.setInfo(record);
                }
            } else {
                Ext.StoreManager.lookup('ContactStore').add(values);
            }
            Ext.Viewport.setActiveItem(form.referrer);
            delete form.referrer;
        }

    },

    onEditContactBtnTap: function(button, e, options) {
        var referrer = Ext.Viewport.getActiveItem();
        var form = this.getContactform();
        var info = this.getContactinfo();
        form.referrer = referrer;
        Ext.Viewport.setActiveItem(form);
        form.setRecord(info.getRecord());
    },

    onCancelBtnTap: function(button, e, options) {
        var form = this.getContactform();
        Ext.Viewport.setActiveItem(form.referrer);
        delete form.referrer;

    },

    onInfoBackBtnTap: function(button, e, options) {
        Ext.Viewport.setActiveItem(0);
    },

    onContactListTap: function(dataview, index, target, record, e, options) {
        var active = dataview.getItemId();

        var items = ['ContactList', 'FavoriteView', 'Alphabetical', 'ByGroup'];

        if (active in this.allowed(items)) {
            var info = this.getContactinfo();
            info.setRecord(record);
            Ext.Viewport.setActiveItem(info);
            console.log('Item tap on '+active);
        }
    },

    onGroupListItemTap: function(dataview, index, target, record, e, options) {
        var oldname = record.data.name;            
        var cc = Contact.app.getController('Contacts');

        console.log('Tapped '+oldname);
        if(oldname != 'Contacts') {    
            Ext.Msg.show({
                title   : 'Edit Group',
                msg     : null,
                buttons : [{
                    itemId : 'delete',
                    text   : 'Delete',
                    ui     : 'decline'
                },{
                    itemId : 'cancel',
                    text   : 'Cancel'
                },{
                    itemId : 'ok',
                    text   : 'Ok',
                    ui     : 'confirm'
                }],
                prompt  : {
                    maxlength : 180,
                    autocapitalize : false, 
                    placeHolder: oldname,
                    value: oldname
                },
                fn: function(button,name) {
                    var gs = Ext.StoreMgr.lookup('GroupStore');
                    var cs = Ext.StoreMgr.lookup('ContactStore');
                    var group = cc.findGroup(oldname);

                    if (button === 'ok') {            
                        if(name && name != oldname) {
                            if (cc.findGroup(oldname)) {

                                group.set('name', name);
                                group.setDirty();
                                gs.sync();

                                console.log('Updated group');

                                cc.updateContactsGroup(oldname, name);
                            }
                        }
                        else {
                            console.log('Same name');   
                        }

                    } else if (button === 'delete') {
                        gs.remove(group);
                        gs.sync();

                        // Put contacts in default Contacts group
                        cc.updateContactsGroup(oldname, 'Contacts');

                        console.log('Deleted '+oldname+' group');
                    } else {
                        console.log('Canceled');
                    }
                }
            });
        } else {Ext.Msg.alert('Default Group', 'The Contacts group cannot be edited or deleted');}
    },

    onTabpanelActivate: function(container, newActiveItem, oldActiveItem, options) {
        var active = container.getActiveItem().getItemId();
        this.modifyContactStore(active);
    },

    onTabpanelActiveItemChange: function(container, value, oldValue, options) {
        var active = value.getItemId();
        this.modifyContactStore(active);
    },

    onContactPickerChange: function(picker, value, options) {
        var currentForm = Ext.Viewport.getActiveItem();
        var record = currentForm.getRecord();
        if (record) {
            Ext.Msg.alert('pic', 'setting pic to ' + value);
            record.set('picture', value);
            record.commit();
            currentForm.setRecord(record);
        }

    },

    updateContactsGroup: function(oldname, newname) {
        var contacts = this.findContactsByGroup(oldname);

        // Update contacts in this group
        if(contacts.getCount() ) {

            contacts.each(function(record) {
                record.set('group', newname);
                record.setDirty();
            });
            contacts.sync();

            console.log('Updated contacts in this group');
        }
    },

    modifyContactStore: function(active) {
        var cs = Ext.StoreMgr.lookup('ContactStore');

        var alphabetical = ['Alphabetical','ContacOrder'];

        if (active in this.allowed(alphabetical)) {
            cs.setGroupField('firstName');
            cs.sort('firstName');
            cs.setGrouper({
                groupFn: function(record) {
                    return record.data.firstName[0];
                }
            });
        }
        else if (active == 'ByGroup') {
            cs.setGroupField('group');
            cs.sort('group');
        }

        if (active == 'FavoriteView') {
            cs.filter('isFavorite', true);
        }
        else {
            cs.clearFilter();
        }

        console.log(active+' is active');
    },

    findGroup: function(name) {
        var gs = Ext.StoreMgr.lookup('GroupStore');
        return gs.findRecord('name', name, 0, true);
    },

    findContactsByGroup: function(group) {
        var cs = Ext.StoreMgr.lookup('ContactStore');
        cs.filter('group', group);
        return cs;


    },

    allowed: function(items) {
        var o = {};
        for(var i=0;i<items.length;i++)
        {
            o[items[i]]='';
        }
        return o;
    }

});