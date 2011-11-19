#DO NOT USE IT FOR THE MOMENT,
couchapp generate a bad tiddlycouch.
I'm searching "a unexpected token ,"


unclephil 2011/11/20

#TiddlyCouch : unclephil Version

TiddlyCouch lets you serve a TiddlyWiki from CouchDB and read and write individual tiddlers to the database. Each tiddler is saved as a separate document.
It consists of a couchapp and some TiddlyWiki plugins.

[Original git](https://github.com/saqimtiaz/TiddlyCouch)

[Demo Saq.](http://saq.couchone.com/tiddlydb/_design/tiddlycouch/_list/tiddlywiki/tiddlers)


This is a lightweight version create by Ph Koenig (UnclePhil)

* JEOF (Just EnOugh File) in couchapp
* Some rewrites (the couch one)
* Windows and Linux version of deploy.(cmd|sh)
* Some patching in save tiddler function

[WorkingVersion Unclephil.](http://tc.unclephil.net)

##Solved
* 20111116 import tiddler routine From another tiddlycouch is working
* 20111116 backstage display is now controlled when login/logout

##Knowed Problems:
* Still some border effect in theming with login/logout
* Rss is not working (exist some atom created by Bauwe)

##Working On
** importing from local tiidliwiki file
