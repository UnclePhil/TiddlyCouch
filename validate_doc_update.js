function(newDoc, oldDoc, userCtx) {
  function forbidden(message) {    
    throw({forbidden : message});
  };
  // not logged in
  if (!userCtx.name) {
    forbidden("Sorry, you must be logged in to save this tiddler");
  }
  return true;
};