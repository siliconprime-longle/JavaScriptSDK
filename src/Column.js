/*
 Column.js
 */

 CB.Column = function(columnName, dataType, required, unique){
   if(columnName){
     CB._columnNameValidation(columnName);
     this.name = columnName;
     this._type = 'column';
   }

   if(dataType){
     CB._columnDataTypeValidation(dataType);
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
}
