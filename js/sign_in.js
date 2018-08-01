var applicationConfig = {
    // These default values get updated by the HTML inputs
    clientID: '947846e9-bea5-403d-a8f4-aa30f54ee587',
    scopes: ['https://graph.microsoft.com/user.read','https://graph.microsoft.com/user.readbasic.all']
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

function update_app() {
    var clientid_string = document.getElementById("clientid_input").value
    applicationConfig.clientID = clientid_string.split(' ').join('')
    var scopes_string = document.getElementById("scopes_input").value
    applicationConfig.scopes = scopes_string.split(' ').join('').split(',')
    userAgentApplication = new Msal.UserAgentApplication(applicationConfig.clientID, null, function (errorDes, token, error, tokenType, instance) {
        // this callback is called after loginRedirect OR acquireTokenRedirect. It's not used with loginPopup,  acquireTokenPopup.
        if (error) {
            console.log(error + ": " + errorDes);
        }
        else
            console.log("Token type = " + tokenType);
    
    })
    document.getElementById("sign_in_text").innerText = "Configuration updated: \n" + JSON.stringify(applicationConfig)
}

function sign_in() {
    update_app();
    
    userAgentApplication.loginPopup(applicationConfig.scopes).then(function (id_token) {
        var user = userAgentApplication.getUser();
        
        if (user) {
            console.log("signed in sucessfully");
            console.log(id_token);
            id_token_global = id_token;
            updatePage();
            // get an access token
            userAgentApplication.acquireTokenSilent(applicationConfig.scopes).then(function (access_token) {
                console.log("Success acquiring access token");
                console.log(access_token);
                access_token_global = access_token;
                updatePage();
            }, function (error) {
                // interaction required
                if (error.indexOf("interaction_required" != -1)) {
                    userAgentApplication.acquireTokenPopup(applicationConfig.scopes).then(function (access_token) {
                        console.log("Success acquiring access token");
                        console.log(access_token);
                        access_token_global = access_token;
                        updatePage();
                    }, function (error) {
                        console.log("Failure acquiring token: " + error);
                        document.getElementById("sign_in_text").innerText = error;
                    });
                }
            });
            
        } else {
            console.log("signed in failure");
        }
    }, function (error) {
        console.log("error: " + error);
        document.getElementById("sign_in_text").innerText = error;
        });

}


var sign_in_button = document.getElementById("sign_in_button")
sign_in_button.addEventListener("click", sign_in);

var update_app_button = document.getElementById("update_app_button")
update_app_button.addEventListener("click", update_app);