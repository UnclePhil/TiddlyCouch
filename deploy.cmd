mkdir ./fixtures

c:\python27\python.exe ./js2tiddler plugins/ServerSideSavingPlugin.js > fixtures/ServerSideSavingPlugin.json
c:\python27\python.exe ./js2tiddler plugins/jquery-json.js > fixtures/jquery-json.json
c:\python27\python.exe ./js2tiddler plugins/jquery-couch.js > fixtures/jquery-couch.json
c:\python27\python.exe ./js2tiddler plugins/CouchDBAdaptor.js > fixtures/CouchDBAdaptor.json
c:\python27\python.exe ./js2tiddler plugins/CouchDBConfig.js > fixtures/CouchDBConfig.json

couchapp pushdocs fixtures %1
couchapp push %1
del fixtures/*