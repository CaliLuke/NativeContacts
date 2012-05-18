/*
 * File: app/view/Main.js
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

Ext.define('Contact.view.Main', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Contact.view.ContactOrder',
        'Contact.view.FavoriteView',
        'Contact.view.GroupList'
    ],

    config: {
        tabBar: {
            border: '',
            docked: 'top',
            layout: {
                pack: 'center',
                type: 'hbox'
            }
        },
        items: [
            {
                xtype: 'contactorder',
                title: 'Contacts'
            },
            {
                xtype: 'favoriteview',
                title: 'Favorites'
            },
            {
                xtype: 'grouplist',
                preventSelectionOnDisclose: false,
                title: 'Groups'
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                itemId: 'MainToolbar',
                items: [
                    {
                        xtype: 'button',
                        cls: 'square',
                        itemId: 'addContactBtn',
                        ui: 'action',
                        iconCls: 'add',
                        iconMask: true,
                        text: 'Add Contact'
                    },
                    {
                        xtype: 'button',
                        cls: 'square',
                        itemId: 'addGroupBtn',
                        ui: 'action',
                        iconCls: 'add',
                        iconMask: true,
                        text: 'Add Group'
                    }
                ]
            }
        ]
    }

});