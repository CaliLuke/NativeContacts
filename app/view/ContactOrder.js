/*
 * File: app/view/ContactOrder.js
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

Ext.define('Contact.view.ContactOrder', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.contactorder',
    requires: [
        'Contact.view.ContactList'
    ],

    config: {
        itemId: 'ContactOrder',
        items: [
            {
                xtype: 'contactlist',
                itemId: 'Alphabetical',
                title: 'Alphabetical'
            },
            {
                xtype: 'contactlist',
                itemId: 'ByGroup',
                title: 'By Group'
            }
        ]
    }

});