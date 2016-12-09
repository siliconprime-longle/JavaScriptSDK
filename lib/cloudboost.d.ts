interface CloudApp {
	init(serverUrl? :string, applicationId? :string, applicationKey? :string, opts? :any):void,
	onConnect(functionToFire :any):void,
	onDisconnect(functionToFire :any):void,
	connect():void,
	disconnect():void,
}

declare module cloudboost {
	export var CloudApp:CloudApp
	export class Column {
		constructor(columnName? :string, dataType? :string, required? :boolean, unique? :boolean)
		name:string
		dataType:any
		unique:any
		relatedTo:any
		required:any
		editableByMasterKey:any
		isSearchable:any
	}
	export class CloudTable {
		constructor(tableName :string)
		addColumn(column :any)
		getColumn(columnName :any)
		updateColumn(column :any)
		deleteColumn(column :any)
		delete(callback? :any)
		save(callback? :any)
		static getAll(callback? :any)
		static get(table :any, callback? :any)
	}
	export class ACL {
		constructor()
		setPublicWriteAccess(value? :any)
		setPublicReadAccess(value? :any)
		setUserWriteAccess(userId :any, value? :any)
		setUserReadAccess(userId :any, value? :any)
		setRoleWriteAccess(roleId :any, value? :any)
		setRoleReadAccess(roleId :any, value? :any)
	}
}

export = cloudboost
