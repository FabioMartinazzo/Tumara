var headers = require('./node_modules/core/headers')
var accesscontrol = require('./node_modules/core/accesscontrol')
var config = require('./node_modules/core/config')
var model = require('./node_modules/core/model')
var selfws = require('./node_modules/webservice/selfwebservice')
var following = require('./node_modules/core/following')
var rollback = require('./node_modules/core/rollback')
var error = require('./node_modules/error/error')
var privbypass = require('./node_modules/privilege/privbypass')
var logger = require('./node_modules/core/logger')

var Tumara = {
	app : null,
	init : function(app) {
		this.app = app
		error.init()
	},
	setAccessControl : function() {
		accesscontrol.allowself(this.app)
	},
	setHeaders : function() {
		this.app.use(headers.bodyParser.urlencoded( { extended : true } ))
		this.app.use(headers.methodOverride())
		this.app.use(headers.express.static(headers.path.join(__dirname, "public")))
		this.app.use(headers.errorHandler( { dumpExceptions: true, showStack: true } ))
	}
}

module.exports = {
	init : function(callback) {
		config.init(function() { 
			Tumara.init(config.getConfiguration().getApp())
			Tumara.setAccessControl()
			Tumara.setHeaders()
			privbypass.init()

			callback()

			config.getConfiguration().getApp().listen(config.getConfiguration().getPort())
			logger.saveAccessLog(undefined, 'Aplicação rodando.', function(){ })
		})
	},
	getConfig : function() {
		return myConfig
	},
	getModel : function() {
		return model
	},
	handleError : function(errorCode, detail, callback) {
		return callback(require('./node_modules/error/error').dispatch(errorCode, detail, true))
	},
	getSelf : function() {
		return selfws
	},
	encapsuleForFollower : function(obj) {
		following.makeObjFollower(obj, following.getGlobalCurrent())
	},
	getFollower : function(obj) {
		return following.getCurrent(obj)
	},
	setRollback : function(obj, entity, id, usuario, senha) {
		rollback.setRollback(obj, entity, id, usuario, senha)
	}
}
