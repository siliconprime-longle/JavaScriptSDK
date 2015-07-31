/*
 Column.js
 */

 CB.Column = function(columnName, dataType, required, unique){
   if(columnName){
     columnNameValidation(columnName);
     this.name = columnName;
   }

   if(dataType){
     columnDataTypeValidation(dataType);
     this.dataType = dataType;
   }else{
     this.dataType = "Text";
   }

   if(typeof(required) === 'boolean')
     this.required = required;
   else
     this.required = false;

   if(typeof(required) === 'boolean')
     this.required = unique;
   else
     this.unique = false;

     this.isDeletable = true;
     this.isEditable = true;
     this.isRenamable = true;
     this.relatedTo = null;
     this.relationType = null;
     this.id = makeId();
}

Object.defineProperty(CB.Column.prototype, 'dataType', {
    get: function() {
        return this.dataType;
    },
    set: function(dataType){
      if(dataType){
        columnDataTypeValidation(dataType);
        this.dataType = dataType;
      }
    }
});

Object.defineProperty(CB.Column.prototype, 'relatedTo', {
    set: function(relatedTo){
      if(relatedTo){
        columnRelationValidation(relatedTo);
        this.relatedTo = relatedTo;
      }
    }
});

Object.defineProperty(CB.Column.prototype, 'relatedTo', {
    set: function(relatedTo){
      if(relatedTo){
        columnRelationValidation(relatedTo);
        this.relatedTo = relatedTo;
      }
    }
});

Object.defineProperty(CB.Column.prototype, 'relationType', {
    set: function(relationType){
      if(relationType){
        columnRelationValidation(relatedTo);
        this.relatedTo = relatedTo;
      }
    }
});

Object.defineProperty(CB.Column.prototype, 'required', {
    set: function(required){
      if(typeof(required) === 'boolean')
        this.required = required;
      else
        throw "incorrect value for required property, enter true/false";
    }
});

Object.defineProperty(CB.Column.prototype, 'unique', {
    set: function(unique){
      if(typeof(unique) === 'boolean')
        this.unique = unique;
      else
        throw "incorrect value for unique property, enter true/false";
    }
});

function columnNameValidation(columnName){
  if(!columnName) //if table name is empty
    throw "table name cannot be empty";

  if(!isNaN(columnName[0]))
    throw "table name should not start with a number";

  if(!columnName.match(/^\S+$/))
    throw "table name should not contain spaces";

  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  if(pattern.test(columnName))
    throw "table not shoul not contain special characters";
}

function columnDataTypeValidation(dataType){
  dataTypeList = ['Text', 'Email', 'URL', 'Number', 'Boolean', 'DateTime', 'GeoPoint', 'File', 'List', 'Relation', 'Object'];
  var index = dataTypeList.indexOf(dataType);
  if(index < 0)
    throw "invalid data type";
}
