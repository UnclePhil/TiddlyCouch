mkdir ./fixtures
python ./js2tiddler plugins/ServerSideSavingPlugin.js > fixtures/ServerSideSavingPlugin.json
python ./js2tiddler plugins/jquery-json.js > fixtures/jquery-json.json
python ./js2tiddler plugins/jquery-couch.js > fixtures/jquery-couch.json
python ./js2tiddler plugins/CouchDBAdaptor.js > fixtures/CouchDBAdaptor.json
cython ./js2tiddler plugins/CouchDBConfig.js > fixtures/CouchDBConfig.json
couchapp pushdocs fixtures %1
couchapp push %1
rm -yf fixtures/*