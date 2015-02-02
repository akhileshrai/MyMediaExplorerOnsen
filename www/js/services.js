'use strict';

/* Services */
mediaApp.factory('MediaService', function($resource, $q){
    var music = $resource('https://itunes.apple.com/:action',
        { action: "search", callback: 'JSON_CALLBACK'},
        { 'get':  {method: 'JSONP'} });


    return {
        search: function(query,type,limit) {
            var q = $q.defer();

            music.get({
                term: query, media: type, limit: limit
            }, function(resp) {
                q.resolve(resp);
            }, function(err) {
                q.reject(err);
            })

            return q.promise;
        }
    }
})
// Shared data from settings needed by different controllers
mediaApp.service('SettingsService', function() {
    var _variables = {};

    return {
        get: function(varname) {
            return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
        },
        set: function(varname, value) {
            _variables[varname] = value;
        }
    };
});

mediaApp.factory('ParseService', function($resource){
    // Initialize Parse API and objects.
    //Parse.initialize("14NbAp0dn849XjcDuhxo6MAFNv73CA2DQ2e6OV9E", "JFP3EqjW2S0BUOiunPi344o5IbUDH5G4lBaJYxbS");
    Parse.initialize("ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire", "xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous");

    // Cache current logged in user
    var loggedInUser;

    // Cache list of user's books
    var myBooks = [];

    // Define parse model and collection for Book records
    var Book = Parse.Object.extend("Book");
    var BookCollection = Parse.Collection.extend({ model:Book });

    // Define parse model and collection for BookRequest records
    var BookRequest = Parse.Object.extend("BookRequest");

    /**
     * ParseService Object
     * This is what is used by the controllers to save and retrieve data from Parse.com.
     * Moving all the Parse.com specific stuff into a service allows me to later swap it out 
     * with another back-end service provider without modifying my controller much, if at all.
     */
    var ParseService = {
      name: "Parse",

      // Login a user
      login : function login(username, password, callback) {
          Parse.User.logIn(username, password, {
    	    success: function(user) {
            loggedInUser = user;
    	      callback(user);
    	    },
    	    error: function(user, error) {
    	      alert("Error: " + error.message);
    	    }
        });
      },

      // Login a user using Facebook

      // Get all public books
      getBooks : function getBooks(callback) {
        // Create a new Parse Query to search Book records by visibility
        var query = new Parse.Query(Book);
        query.equalTo("visibility", "public");
        query.notEqualTo("owner", loggedInUser.get('username'));
        query.descending("requestCount");
        // use the find method to retrieve all public books
        query.find({
          success : function(results) {
            callback(results);
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },

      // Get all books belonging to logged in user
      getMyBooks : function getMyBooks(callback) {
        // Create a new Parse Query to search Book records by ownerid
        var query = new Parse.Query(Book);
        query.equalTo("owner", loggedInUser.get('username'));
        // use the find method to retrieve all books
        query.find({
          success : function(results) {
            for (var i=0; i<results.length; i++)
            { 
              myBooks[i]  = results[i].get('name');
            }
            callback(results);
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },

      // Get all requests for current user's books
      getRequests : function getRequests(callback) {
        var query;
        if (myBooks.length == 0) {
          query = new Parse.Query(Book);
          query.equalTo("owner", loggedInUser.get('username'));
          // use the find method to retrieve all books
          query.find({
            success : function(results) {
              for (var i=0; i<results.length; i++)
              { 
                myBooks[i]  = results[i].get('name');
              }
              // Create a new Parse Query to search requests records by ownerid
              query = new Parse.Query(BookRequest);
              query.notEqualTo("borrower", loggedInUser.get('username'));
              query.containedIn("book", myBooks);
              // use the find method to retrieve all requests
              query.find({
                success : function(results) {
                  callback(results);
                },
                error: function(error) {
                  alert("Error: " + error.message);
                }
              });
            },
            error: function(error) {
              alert("Error: " + error.message);
            }
          });
        } else {
          // Create a new Parse Query to search requests records by ownerid
          query = new Parse.Query(BookRequest);
          query.notEqualTo("borrower", loggedInUser.get('username'));
          query.containedIn("book", myBooks);
          // use the find method to retrieve all requests
          query.find({
            success : function(results) {
              callback(results);
            },
            error: function(error) {
              alert("Error: " + error.message);
            }
          });
        }
      },

      // Creates a borrow request for the given book
      borrow : function borrow(book, callback) {
        // Create and save a request
        var object = new BookRequest();
        object.save({book: book.get('name'), borrower:loggedInUser.get('username'), status:"Pending", date_borrowed:null, date_returned:null}, {
          success: function(object) {
            // on success, increment the request count for the book
            book.increment("requestCount");
            book.save({
              success: function(object) {
                callback(object);
              },
              error: function(error) {
                alert("Error: " + error.message);
              }
            });
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },
      
      // Set request status to 'Accepted' and update date borrowed
      accept : function accept(request, callback) {
        request.set("status", "Accepted");
        request.set("date_borrowed", new Date());
        request.save({
          success: function(object) {
            callback(object);
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        })
      },

      // Set request status to 'Rejected' and update date borrowed
      reject : function reject(request, callback) {
        request.set("status", "Rejected");
        request.save({
          success: function(object) {
            callback(object);
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        })
      },

      // Create a new book record
      addBook : function addBook(_name, _status, _visibility, _location, callback) {
        var object = new Book();
        object.save({name:_name, owner:loggedInUser.get('username'), status:_status, visibility:_visibility, location:_location}, {
          success: function(object) {
            callback();
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },

      // Get current logged in user
      getUser : function getUser() {
        if(loggedInUser) {
          return loggedInUser;
        }
      }
    
    };

    // The factory function returns ParseService, which is injected into controllers.
    return ParseService;
});





