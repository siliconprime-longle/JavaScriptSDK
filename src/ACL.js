console.log('in acl');

CB.ACL = function() { //constructor for ACL class
    this['read'] = {"allow":{"user":['all'],"role":[]},"deny":{"user":[],"role":[]}}; //by default allow read access to "all"
    this['write'] = {"allow":{"user":['all'],"role":[]},"deny":{"user":[],"role":[]}}; //by default allow write access to "all"
};
CB.ACL.prototype.setPublicWriteAccess = function(value) { //for setting the public write access
    if (value) { //If asked to allow public write access
        this['write']['allow']['user'] = ['all'];
    } else {
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1); //remove the "all" value from the "write" array of "this" object
        }
    }
};
CB.ACL.prototype.setPublicReadAccess = function(value) { //for setting the public read access

    if (value) { //If asked to allow public read access
        this['read']['allow']['user'] = ['all'];
    } else {
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1); //remove the "all" value from the "read" array of "this" object
        }
    }
};
CB.ACL.prototype.setUserWriteAccess = function(userId, value) { //for setting the user write access

    if (value) { //If asked to allow user write access
        //remove public write access.
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }
        if (this['write']['allow']['user'].indexOf(userId) === -1) {
            this['write']['allow']['user'].push(userId);
        }
    } else {
        var index = this['write']['allow']['user'].indexOf(userId);
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1); //remove the "userId" value from the "write" array of "this" object
        }
        this['write']['deny']['user'].push(userId);
    }
};
CB.ACL.prototype.setUserReadAccess = function(userId, value) { //for setting the user read access

    if (value) { //If asked to allow user read access
        //remove public write access.
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        if (this['read']['allow']['user'].indexOf(userId) === -1) {
            this['read']['allow']['user'].push(userId);
        }
    } else {
        var index = this['read']['allow']['user'].indexOf(userId);
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1); //remove the "userId" value from the "read" array of "this" object
        }
        this['read']['deny']['user'].push(userId);
    }
};
CB.ACL.prototype.setRoleWriteAccess = function(roleId, value) {

    if (value) {
        //remove public write access.
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }
        if (this['write']['allow']['role'].indexOf(roleId) === -1) {
            this['write']['allow']['role'].push(roleId);
        }
    } else {
        var index = this['write']['allow']['role'].indexOf(roleId);
        if (index > -1) {
            this['write']['allow']['role'].splice(index, 1);
        }
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }

        this['write']['deny']['role'].push(roleId);
    }
};
CB.ACL.prototype.setRoleReadAccess = function(roleId, value) {

    if (value) {
        //remove public write access.
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        if (this['read']['allow']['role'].indexOf(roleId) === -1) {
            this['read']['allow']['role'].push(roleId);
        }
    } else {
        var index = this['read']['allow']['role'].indexOf(roleId);
        if (index > -1) {
            this['read']['allow']['role'].splice(index, 1);
        }
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        this['read']['deny']['role'].push(roleId);
    }
};
