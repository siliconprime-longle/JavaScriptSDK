class CB {
	constructor(){
		this.CB = {}
		this._isNode = false;
		this.Socket = null;
		this.io = null; //socket.io library is saved here.
		this.apiUrl = 'https://api.cloudboost.io'
		if (typeof(process) !== "undefined" &&
		    process.versions &&
		    process.versions.node) {
		    this._isNode = true;
		} else {
		    this._isNode = false;
		}
	}
}

const global_CB = window.CB = Object.assign({},new CB())

export default global_CB