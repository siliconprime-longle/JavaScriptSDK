/*
 Access Control List (ACL)
 */

CB.ACL = function() { //constructor for ACL class
    this['read'] = ['all']; //by default allow read access to "all"
    this['write'] = ['all']; //by default allow write access to "all"
};
CB.ACL.prototype.setPublicWriteAccess = function(value) { //for setting the public write access
    if (!this['write']) {
        this['write'] = ['all']; //if the "write" property does not exist, create one with default value
    }
    if (value) { //If asked to allow public write access
        this['write'] = ['all'];
    } else {
        var index = this['write'].indexOf('all');
        if (index > -1) {
            this['write'].splice(index, 1); //remove the "all" value from the "write" array of "this" object
        }
    }
};
CB.ACL.prototype.setPublicReadAccess = function(value) { //for setting the public read access
    if (!this['read']) {
        this['read'] = ['all']; //if the "read" property does not exist, create one with default value
    }
    if (value) { //If asked to allow public read access
        this['read'] = ['all'];
    } else {
        var index = this['read'].indexOf('all');
        if (index > -1) {
            this['read'].splice(index, 1); //remove the "all" value from the "read" array of "this" object
        }
    }
};
CB.ACL.prototype.setUserWriteAccess = function(userId, value) { //for setting the user write access
    if (!this['write']) {
        this['write'] = ['all']; //if the "write" property does not exist, create one with default value
    }
    if (value) { //If asked to allow user write access
        //remove public write access.
        var index = this['write'].indexOf('all');
        if (index > -1) {
            this['write'].splice(index, 1);
        }
        if (this['write'].indexOf(userId) === -1) {
            this['write'].push(userId);
        }
    } else {
        var index = this['write'].indexOf(userId);
        if (index > -1) {
            this['write'].splice(index, 1); //remove the "userId" value from the "write" array of "this" object
        }
    }
};
CB.ACL.prototype.setUserReadAccess = function(userId, value) { //for setting the user read access
    if (!this['read']) {
        this['read'] = ['all']; //if the "read" property does not exist, create one with default value
    }
    if (value) { //If asked to allow user read access
        //remove public write access.
        var index = this['read'].indexOf('all');
        if (index > -1) {
            this['read'].splice(index, 1);
        }
        if (this['read'].indexOf(userId) === -1) {
            this['read'].push(userId);
        }
    } else {
        var index = this['read'].indexOf(userId);
        if (index > -1) {
            this['read'].splice(index, 1); //remove the "userId" value from the "read" array of "this" object
        }
    }
};
CB.ACL.prototype.setRoleWriteAccess = function(roleId, value) {
    if (!this['write']) {
        this['write'] = ['all'];
    }
    if (value) {
        //remove public write access.
        var index = this['write'].indexOf('all');
        if (index > -1) {
            this['write'].splice(index, 1);
        }
        if (this['write'].indexOf(roleId) === -1) {
            this['write'].push(roleId);
        }
    } else {
        var index = this['write'].indexOf(roleId);
        if (index > -1) {
            this['write'].splice(index, 1);
        }
    }
};
CB.ACL.prototype.setRoleReadAccess = function(roleId, value) {
    if (!this['read']) {
        this['read'] = ['all'];
    }
    if (value) {
        //remove public write access.
        var index = this['read'].indexOf('all');
        if (index > -1) {
            this['read'].splice(index, 1);
        }
        if (this['read'].indexOf(roleId) === -1) {
            this['read'].push(roleId);
        }
    } else {
        var index = this['read'].indexOf(roleId);
        if (index > -1) {
            this['read'].splice(index, 1);
        }
    }
};