var bizagiUtil = require('bz-util');
var REQUIRED = bizagiUtil.REQUIRED;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var LOGGER = bizagiUtil.LOG;
var config = bizagiUtil.config; 
/**
 * @author Miguel Mayori
 */ 

function invoke(globals, actionName, data, authenticationType, LOG, callback) {
    var Client = REQUIRED('node-rest-client').Client;
    
    var clientRest = new Client();
    
    var owner = data.inputs.input.owner;
    var repo = data.inputs.input.repo;
    var title = data.inputs.input.title;
    var body = data.inputs.input.body;
    
    
    var TOKEN = globals.authdata.TOKEN;
    
    var args = {
        headers: {
            'User-Agent': owner,
            'Content-Type': 'application/json',
            'Authorization': 'token ' + TOKEN
        },
        data: {
            title: title,
            body: body
        }
    };      
    clientRest.post('https://api.github.com/repos/' + owner + '/' + repo + '/issues',
    args, function (data, response) {
        if (!(data instanceof Uint8Array) && data.id) {
            var success = RESPONSE(data, null, 200);
            callback(success);
        } else if (data.message) {
            var errorData = {error: data.message, message: data.message, code: 400};
            var error = RESPONSE(null, errorData, errorData.code, errorData.error);
            callback(error);
        } else {
            var str = String.fromCharCode.apply(null, data);
            var errorData1 = {error: str, message: str, code: 400};
            var error1 = RESPONSE(null, errorData1, 400, errorData1.error);
            callback(error1);
        }
    });
}

exports.invoke = invoke;
