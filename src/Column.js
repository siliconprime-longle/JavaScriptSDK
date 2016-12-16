import CB from './CB'
/*
 Column.js
 */
class Column{
  constructor(columnName, dataType, required, unique){
     this.document = {};
     if(columnName){
       CB._columnNameValidation(columnName);
       this.document.name = columnName;
       this.document._type = 'column';
     }

     if(dataType){
       CB._columnDataTypeValidation(dataType);
       this.document.dataType = dataType;
     }else{
       this.document.dataType = "Text";
     }

     if(typeof(required) === 'boolean'){
       this.document.required = required;
     }
     else{
       this.document.required = false;
     }

     if(typeof(unique) === 'boolean'){
       this.document.unique = unique;
     }
     else{
       this.document.unique = false;
     }

     if(dataType==="Text"){
       this.document.isSearchable = true;
     }  

     this.document.relatedTo = null;
     this.document.relationType = null;

     this.document.isDeletable = true;
     this.document.isEditable = true;
     this.document.isRenamable = false;
     this.document.editableByMasterKey = false; 
  };
}

Object.defineProperty(Column.prototype,'name',{
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
    }
});

Object.defineProperty(Column.prototype,'dataType',{
    get: function() {
        return this.document.dataType;
    },
    set: function(dataType) {
        this.document.dataType = dataType;
    }
});


Object.defineProperty(Column.prototype,'unique',{
    get: function() {
        return this.document.unique;
    },
    set: function(unique) {
        this.document.unique = unique;
    }
});


Object.defineProperty(Column.prototype,'relatedTo',{
    get: function() {
        return this.document.relatedTo;
    },
    set: function(relatedTo) {
        this.document.relatedTo = relatedTo;
    }
});

Object.defineProperty(Column.prototype,'required',{
    get: function() {
        return this.document.required;
    },
    set: function(required) {
        this.document.required = required;
    }
});

Object.defineProperty(Column.prototype,'editableByMasterKey',{
    get: function() {
        return this.document.editableByMasterKey;
    },
    set: function(editableByMasterKey) {
        this.document.editableByMasterKey = editableByMasterKey;
    }
});

Object.defineProperty(Column.prototype,'isSearchable',{
    get: function() {
        return this.document.isSearchable;
    },
    set: function(isSearchable) {
        this.document.isSearchable = isSearchable;
    }
});

CB.Column = Column


export default CB.Column