/***
|''Name''|CouchDBAdaptor| 
|''Description''|adaptor for interacting with CouchDB|
|''Author:''|FND|
|''Version''|0.1.0|
|''Status''|@@experimental@@|
|''Source''|[TBD]|
|''CodeRepository''|[TBD]|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''CoreVersion''|2.5|
|''Keywords''|serverSide CouchDB|
!Code
***/
//{{{
(function($) {

var adaptor = config.adaptors.couchdb = function() {};
adaptor.prototype = new AdaptorBase();

adaptor.serverType = "couchdb";
adaptor.serverLabel = "CouchDB";
adaptor.mimeType = "application/json";

adaptor.prototype.putTiddler = function(tiddler, context, userParams, callback) {
	var fields = tiddler.fields;
	context = this.setContext(context, userParams, callback);
	context.title = tiddler.title;
	context.tiddler = tiddler;
	context.host = context.host || this.fullHostName(fields["server.host"]);
	context.workspace = context.workspace || fields["server.workspace"];
	var payload = {
		type: fields["server.content-type"] || null,
		title: tiddler.title,
		modified: tiddler.modified? tiddler.modified.convertToYYYYMMDDHHMM() : '',
		created: tiddler.created? tiddler.created.convertToYYYYMMDDHHMM() : '',
		creator: tiddler.creator,
		modifier: tiddler.modifier,
		text: tiddler.text,
		tags: tiddler.tags,
		fields: $.extend({}, fields)
	};
	if(tiddler.created) {
		payload.created = tiddler.created;
	}
	if(tiddler.creator) {
		payload.creator = tiddler.creator;
	}
	delete payload.fields.changecount;
	$.each(payload.fields, function(key, value) {
		if(key.indexOf("server.") == 0) {
			delete payload.fields[key];
		}
	});

	var options = {
		url: context.host + "/" + encodeURIComponent(context.workspace),
		type: null,
		contentType: adaptor.mimeType,
		data: $.toJSON(payload),
		success: function(data, status, xhr) {
			context.responseData = data;
			adaptor.putTiddlerCallback(xhr.status, context,
				xhr.responseText, options.url, xhr);
		},
		error: function(xhr, error, exc) {
			adaptor.putTiddlerCallback(xhr.status, context,
				xhr.responseText, options.url, xhr);
		}
	};
	var id = fields["server.id"];
	if(id) {
		options.url += "/" + id;
		options.type = "PUT";
		payload._id = fields["server.id"];
		payload._rev = fields["server.page.revision"];
		options.data = $.toJSON(payload);
	} else {
		options.type = "POST";
	}
	return $.ajax(options);
};

adaptor.putTiddlerCallback = function(status, context, responseText, uri, xhr) {
	context.status = [201, 202].contains(xhr.status);
	context.statusText = xhr.statusText;
	context.httpStatus = xhr.status;
	if(context.responseData) {
		var resp = $.evalJSON(context.responseData);
		var fields = context.tiddler.fields;
		fields["server.id"] = resp.id;
		fields["server.page.revision"] = resp.rev;
	}
	if(context.callback) {
		context.callback(context, context.userParams);
	}
};

// delete an individual tiddler
adaptor.prototype.deleteTiddler = function(tiddler, context, userParams, callback) {
	context = this.setContext(context, userParams, callback);
	context.title = tiddler.title; // XXX: not required!?
	var uriTemplate = "%0/%1/%2?rev=%3";
	context.host = context.host || this.fullHostName(tiddler.fields["server.host"]);
	context.workspace = context.workspace || tiddler.fields["server.workspace"];
	//if(!bag) {
	//	return adaptor.noBagErrorMessage;
	//}
	var uri = uriTemplate.format([context.host, adaptor.normalizeTitle(context.workspace),
		adaptor.normalizeTitle(tiddler.fields["server.id"]),tiddler.fields["server.page.revision"]]);
	var req = httpReq("DELETE", uri, adaptor.deleteTiddlerCallback, context, null,
		null, null, null, null, true);
	return typeof req == "string" ? req : true;
};

adaptor.deleteTiddlerCallback = function(status, context, responseText, uri, xhr) {
	var resp = $.evalJSON(xhr.responseText);
	context.status = resp["ok"] == true;
	context.statusText = xhr.statusText;
	context.httpStatus = xhr.status;
	if(context.callback) {
		context.callback(context, context.userParams);
	}
};

adaptor.normalizeTitle = function(title) {
	return encodeURIComponent(title);
};

// since the document id is currently indepedent of tiddler title, we can simply update the document on renames by saving the new copy
adaptor.prototype.moveTiddler = adaptor.prototype.putTiddler;


// added 20111116, copied from tiddlyweb adapatator
// retrieve a list of tiddlers

// retrieve a list of workspaces
adaptor.prototype.getWorkspaceList = function(context, userParams, callback) {
	context = this.setContext(context, userParams, callback);
	context.workspaces = [];
	var uriTemplate = "%0/_all_dbs"; // XXX: bags?
	var uri = uriTemplate.format([context.host]);
	var req = httpReq("GET", uri, adaptor.getWorkspaceListCallback,
		context, { accept: adaptor.mimeType }, null, null, null, null, true);
	return typeof req == "string" ? req : true;
};

adaptor.getWorkspaceListCallback = function(status, context, responseText, uri, xhr) {
	context.status = status;
	context.statusText = xhr.statusText;
	context.httpStatus = xhr.status;
	if(status) {
		try {
			var workspaces = $.evalJSON(responseText);
		} catch(ex) {
			context.status = false; // XXX: correct?
			context.statusText = exceptionText(ex, adaptor.parsingErrorMessage);
			if(context.callback) {
				context.callback(context, context.userParams);
			}
			return;
		}
		context.workspaces = workspaces.map(function(itm) { return { title: itm }; });
	}
	if(context.callback) {
		context.callback(context, context.userParams);
	}
};



adaptor.prototype.getTiddlerList = function(context, userParams, callback) {
	context = this.setContext(context, userParams, callback);
	var uriTemplate = "%0/%1/_design/tiddlycouch/_view/tiddlers%2";
	var params = context.filters ? "?" + context.filters : "";
	if(context.format) {
		params = context.format + params;
	}
	var uri = uriTemplate.format([context.host,	adaptor.normalizeTitle(context.workspace), params]);
	var req = httpReq("GET", uri, adaptor.getTiddlerListCallback, context, merge({ accept: adaptor.mimeType }, context.headers), null, null, null, null, true);
	return typeof req == "string" ? req : true;
};

adaptor.getTiddlerListCallback = function(status, context, responseText, uri, xhr) {
	context.status = status;
	context.statusText = xhr.statusText;
	context.httpStatus = xhr.status;
	if(status) {
		context.tiddlers = [];
		try {
			var tiddlers = $.evalJSON(responseText).rows; //# NB: not actual tiddler instances
		} catch(ex) {
			context.status = false; // XXX: correct?
			context.statusText = exceptionText(ex, adaptor.parsingErrorMessage);
			if(context.callback) {
				context.callback(context, context.userParams);
			}
			return;
		}
		for(var i = 0; i < tiddlers.length; i++) {
			var tiddler = adaptor.toTiddler(tiddlers[i].value, context.host, context.workspace );
			context.tiddlers.push(tiddler);
		}
	}
	if(context.callback) {
		context.callback(context, context.userParams);
	}
};

// create Tiddler instance from TiddlyWeb tiddler JSON
adaptor.toTiddler = function(json, host, workspace) {
	var created = Date.convertFromYYYYMMDDHHMM(json.created);
	var modified = Date.convertFromYYYYMMDDHHMM(json.modified);
	var fields = json.fields || [];
	fields["server.type"] = adaptor.serverType;
	fields["server.host"] = host;
	fields["server.id"] = json._id;
	if(json.type && json.type != "None") {
		fields["server.content-type"] = json.type;
	}
	fields["server.page.revision"] = json._rev;
	fields["server.workspace"] = workspace;
	var tiddler = new Tiddler(json.title);
	tiddler.assign(tiddler.title, json.text, json.modifier, modified, json.tags,
		created, json.fields, json.creator);
	return tiddler;
};

})(jQuery);
//}}}
