var applicationConfig = {
    clientID: '947846e9-bea5-403d-a8f4-aa30f54ee587',
    graphScopes: ["user.read"]
};

var id_token_global = null
var access_token_global = null

var userAgentApplication = new Msal.UserAgentApplication(applicationConfig.clientID, null, function (errorDes, token, error, tokenType, instance) {
    // this callback is called after loginRedirect OR acquireTokenRedirect. It's not used with loginPopup,  acquireTokenPopup.
    if (error) {
        console.log(error + ": " + errorDes);
    }
    else
        console.log("Token type = " + tokenType);

})

function sign_in() {
    userAgentApplication.loginPopup(["user.read"]).then(function (id_token) {
        var user = userAgentApplication.getUser();
        
        if (user) {
            console.log("signed in sucessfully");
            console.log(id_token);
            id_token_global = id_token;
            updatePage();
            // get an access token
            userAgentApplication.acquireTokenSilent(["user.read"]).then(function (access_token) {
                console.log("Success acquiring access token");
                console.log(access_token);
                access_token_global = access_token;
                updatePage();
            }, function (error) {
                // interaction required
                if (error.indexOf("interaction_required" != -1)) {
                    userAgentApplication.acquireTokenPopup(["user.read"]).then(function (access_token) {
                        console.log("Success acquiring access token");
                        console.log(access_token);
                        access_token_global = access_token;
                        updatePage();
                    }, function (error) {
                        console.log("Failure acquiring token: " + error);
                    });
                }
            });
            
        } else {
            console.log("signed in failure");
        }
    }, function (error) {
        console.log("error: " + error);
        });

}


var sign_in_button = document.getElementById("sign_in_button")
sign_in_button.addEventListener("click", sign_in);