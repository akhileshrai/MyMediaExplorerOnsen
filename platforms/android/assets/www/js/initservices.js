// This is a JavaScript file
window.fbAsyncInit = function() {
        FB.init({
          appId      : '353205054847621',
          xfbml      : true,
          version    : 'v2.1',
          status     : false
        });

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
 };


//Parse.initialize("ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire", "xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous");
