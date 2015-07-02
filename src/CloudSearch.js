CB.CloudSearch = function(collectionNames) {
    this.collectionNames = collectionNames;
    this.query={};
    this.from = 0; //this is skip in usual terms.
    this.size = 10; //this is take in usual terms.
    this.sort = [];
};

CB.CloudSearch.prototype.setSkip = function(data) {
    this.from = data;

    return this;
};

CB.CloudSearch.prototype.setLimit = function(data) {
    this.size = data;
    return this;
};

CB.CloudSearch.prototype.orderByAsc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var obj = {};
    obj[columnName] = {};
    obj[columnName]['order'] = 'asc';
    this.sort.push(obj);

    return this;
};

CB.CloudSearch.prototype.orderByDesc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var obj = {};
    obj[columnName] = {};
    obj[columnName]['order'] = 'desc';
    this.sort.push(obj);

    return this;
};



CB.CloudSearch.prototype._makeFilteredQuery = function() {

    if (!this.query)
        this.query = {};

    if (!this.query.filtered) {
        var prevQuery = this.query;
        this.query = {};
        this.query.filtered = {};
        this.query.filtered.query = prevQuery;
        this.query.filtered.filter = {};
    }

    this._isFilteredQuery = true;
};

CB.CloudSearch.prototype._getFilterItem = function() {

    for (var key in this.query.filtered.filter) {
        //if you have objects in this object then,
        return this.query.filtered.filter;
    }

    //else
    return null;
};

CB.CloudSearch.prototype._deleteFilterItems = function() {
    this.query.filtered.filter = {};
};

CB.CloudSearch.prototype._createBoolFilter = function() {
    if (!this.query.filtered.filter.bool)
        this.query.filtered.filter.bool = {};
    if (!this.query.filtered.filter.bool.must)
        this.query.filtered.filter.bool.must = [];
    if (!this.query.filtered.filter.bool.should)
        this.query.filtered.filter.bool.should = [];

    if (!this.query.filtered.filter.bool.must_not)
        this.query.filtered.filter.bool.must_not = [];

};

CB.CloudSearch.prototype._createBoolQuery = function() {
    if (!this.query.filtered) {
        if (!this.query.bool)
            this.query.bool = {};

        if (!this.query.bool.must)
            this.query.bool.must = [];

        if (!this.query.bool.must_not)
            this.query.bool.must_not = [];

        if (!this.query.bool.should)
            this.query.bool.should = [];

    } else {
        if (!this.query.filtered.query.bool)
            this.query.filtered.query.bool = {};

        if (!this.query.filtered.query.bool.must)
            this.query.filtered.query.bool.must = [];

        if (!this.query.filtered.query.bool.must_not)
            this.query.filtered.query.bool.must_not = [];

        if (!this.query.filtered.query.bool.should)
            this.query.filtered.query.bool.should = [];
    }



};

CB.CloudSearch.prototype._appendPrevFilterToBool = function() {
    var prevTerm = this._getFilterItem();
    this._deleteFilterItems();
    this._createBoolFilter();
    this.query.filtered.filter.bool.must.push(prevTerm);
};

CB.CloudSearch.prototype._pushInMustFilter = function(obj) {
    this._makeFilteredQuery();


    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.must) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.must.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a exists, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.must.push(obj);

    } else {
        this.query.filtered.filter = obj;
    }
};

CB.CloudSearch.prototype._pushInShouldFilter = function(obj) {
    this._makeFilteredQuery();


    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.should) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.should.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a exists, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.should.push(obj);

    } else {
        this._createBoolFilter();
        this.query.filtered.filter.bool.must_not.push(obj);
    }
};

CB.CloudSearch.prototype._pushInShouldQuery = function(obj) {
    this._makeFilteredQuery();


    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.should) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.should.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a exists, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.should.push(obj);

    } else {
        this._createBoolFilter();
        this.query.filtered.filter.bool.must_not.push(obj);
    }
};


CB.CloudSearch.prototype._pushInMustNotFilter = function(obj) {
    this._makeFilteredQuery();
    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.must_not) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.must_not.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a term, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.must_not.push(obj);

    } else {
        this._createBoolFilter();
        this.query.filtered.filter.bool.must_not.push(obj);
    }
};

CB.CloudSearch.prototype.searchOn = function(columns, query, precision) {

    if (this._isFilteredQuery) {
        if (columns instanceof Array) {
            //if columns is an array.
            this.query.query.multi_match = {};
            this.query.query.multi_match.query = query;
            this.query.query.multi_match.fields = columns;
            if (precision) {
                this.query.query.multi_match.operator = precision;
            }

        } else {
            this.query.query.match = {};
            this.query.query.match[columns] = query;
            if (precision) {
                this.query.query.match.operator = precision;
            }
        }
    } else {
        if (columns instanceof Array) {
            //if columns is an array.
            this.query.multi_match = {};
            this.query.multi_match.query = query;
            this.query.multi_match.fields = columns;
            if (precision) {
                this.query.multi_match.operator = precision;
            }

        } else {
            this.query.match = {};
            this.query.match[columns] = query;
            if (precision) {
                this.query.match.operator = precision;
            }
        }
    }

    return this;
};


CB.CloudSearch.prototype.search = function(callback) {

    CB._validate();

    var collectionName = null;

    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    if (this.collectionNames instanceof Array) {
        collectionName = this.collectionNames.join(',');
    } else {
        collectionName = this.collectionNames;
    }
    var params=JSON.stringify({
        collectionName: collectionName,
        query: this.query,
        sort: this.sort,
        limit: this.size,
        skip: this.from,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/search" ;

    CB._request('POST',url,params).then(function(response){
        var object = CB._deserialize(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if(!callback) {
        return def;
    }
};

CB.CloudSearch.prototype.notEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    //data can bean array too!
    var term = {};
    if (data instanceof Array) {
        term.terms = {};
        term.terms[columnName] = data;
    } else {
        term.term = {};
        term.term[columnName] = data;
    }

    this._pushInMustNotFilter(term);

    return this;


};

CB.CloudSearch.prototype.equalTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var term = {};
    if (data instanceof Array) {
        term.terms = {};
        term.terms[columnName] = data;
    } else {
        term.term = {};
        term.term[columnName] = data;
    }

    this._pushInMustFilter(term);

    return this;
};

CB.CloudSearch.prototype.exists = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.exists = {};
    obj.exists.field = columnName;


    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.doesNotExist = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.missing = {};
    obj.missing.field = columnName;

    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.greaterThanOrEqual = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['gte'] = data;
    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.greaterThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['gt'] = data;

    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.lessThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['lt'] = data;

    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.lessthanOrEqual = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['lte'] = data;
    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.or = function(searchObj1, searchObj2) {

    var collectionNames = [];

    if (searchObj1.collectionNames instanceof Array) {
        collectionNames.append(searchObj1.collectionNames);
    } else {
        collectionNames.push(searchObj1.collectionNames);
    }

    if (searchObj2.collectionNames instanceof Array) {
        //check for duplicates.
        for (var i = 0; i < searchObj2.collectionNames; i++) {
            if (collectionNames.indexOf(searchObj2.collectionNames[i]) < 0)
                collectionNames.push(searchObj2.collectionNames[i]);
        }
    } else {
        if (collectionNames.indexOf(searchObj2.collectionNames) < 0)
            collectionNames.push(searchObj2.collectionNames);
    }

    var obj3 = new CB.CloudSearch(collectionNames);
    //merge both of the objects.

    var q1 = null;
    var q2 = null;
    var f1 = null;
    var f2 = null;

    if (searchObj1.query.filtered && searchObj1.query.filtered.query) {
        q1 = searchObj1.query.filtered.query;
    } else if (searchObj1.query && !searchObj1.query.filtered) {
        q1 = searchObj1.query;
    }

    if (searchObj2.query.filtered && searchObj2.query.filtered.query) {
        q2 = searchObj2.query.filtered.query;
    } else if (searchObj2.query && !searchObj2.query.filtered) {
        q2 = searchObj2.query;
    }

    if (searchObj1.query.filtered && searchObj1.query.filtered.filter)
        f1 = searchObj1.query.filtered.filter;

    /* if (searchObj1.query.filteredQuery && searchObj1.query.filteredQuery.filter)
     f1 = searchObj1.query.filteredQuery.filter;*/

    if (searchObj2.query.filtered && searchObj2.query.filtered.filter)
        f2 = searchObj2.query.filtered.filter;

    if (f1 || f2) { //if any of the filters exist, then...
        obj3._makeFilteredQuery();
        if (f1 && !f2)
            obj3.query.filtered.filter = f1;
        else if (f2 && !f1)
            obj3.query.filtered.filter = f2;
        else {
            //if both exists.
            obj3._pushInShouldFilter(f1);
            obj3._pushInShouldFilter(f2);
        }

    }
    if(obj3.query.filtered) {
        if(Object.keys(q1).length>0 || Object.keys(q2).length>0) {
            if(Object.keys(q1).length>0 && !Object.keys(q2).length>0){
                obj3.query.filtered.query=q1;
            }else if(!Object.keys(q1).length>0 && !Object.keys(q2).length>0){
                obj3.query.filtered.query=q2;
            }else{
                obj3.query.filtered.query.bool={"should":[],"must":[],"must_not":[]};
                obj3.query.filtered.query.bool.should.push(q1);
                obj3.query.filtered.query.bool.should.push(q2);

            }
        }

    }

    return obj3;

};
