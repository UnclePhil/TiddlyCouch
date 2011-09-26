function(newDoc, oldDoc, userCtx) {

  function forbidden(message) {    
    throw({forbidden : message});
  };

  function unauthorized(message) {
    throw({unauthorized : message});
  };

  function require(beTrue, message) {
    if (!beTrue) forbidden(message);
  };

  // not logged in
  if (!userCtx.name) {
    forbidden("Sorry, you must be logged in to save this tiddler");
  }
  
  return true;
};