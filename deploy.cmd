
c:\python27\python.exe ./js2tiddler plugins/ServerSideSavingPlugin.js > fixtures/ServerSideSavingPlugin.json
c:\python27\python.exe ./js2tiddler plugins/jquery-json.js > fixtures/jquery-json.json
c:\python27\python.exe ./js2tiddler plugins/CouchdbAdaptor.js > fixtures/CouchDBAdaptor.json
c:\python27\python.exe ./js2tiddler plugins/CouchdbConfig.js > fixtures/CouchDBConfig.json

couchapp pushdocs fixtures %1
couchapp push %1
