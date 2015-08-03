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

   if(typeof(unique) === 'boolean')
     this.unique = unique;
   else
     this.unique = false;
     this.relatedTo = null;
     this.relationType = null;
     this.isDeletable = true;
     this.isEditable = true;
     this.isRenamable = true;
     this.id = makeId();
}

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
