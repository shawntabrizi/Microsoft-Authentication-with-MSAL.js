//This function takes a base 64 url encoded string, and converts it to a JSON object... using a few steps.
function decoder(base64url) {
    try {
        //Convert base 64 url to base 64
        var base64 = base64url.replace('-', '+').replace('_', '/')
        //atob() is a built in JS function that decodes a base-64 encoded string
        var utf8 = atob(base64)
        //Then parse that into JSON
        var json = JSON.parse(utf8)
        //Then make that JSON look pretty
        var json_string = JSON.stringify(json, null, 4)
    } catch (err) {
        json_string = "Bad Section.\nError: " + err.message
    }
    return json_string
}

function jwtdecode(jwt_token, div_header, div_payload, div_signature, p_message, div_raw) {
    div_raw.innerHTML = jwt_token;

    var message, Header, Payload, Signature

    Header = "{\n}"
    Payload = "{\n}"
    Signature = "{\n}"

    if (jwt_token.length < 1) {
        message = "Use the text area above to input a JSON Web Token, " + "<a href='javascript:;' onclick='sample()'>or use this sample token.</a>"
    } else {
        //JSON Web Tokens consist of three parts separated by dots "."
        //Header, Payload, and Signature
        //Each of these parts are base-64-url encoded strings with the JSON data
        var tokens = jwt_token.split(".")
        if (tokens.length == 3) {
            message = "Valid Token"
            Header = decoder(tokens[0])
            Payload = decoder(tokens[1])
            if (tokens[2].length > 0) {
                Signature = "[Signed Token]"
            } else {
                Signature = "[Unsigned Token]"
            }
        } else {
            message = "JSON Web Tokens must have 3 sections, even without a signature."
        }
    }
    div_header.innerHTML = Header
    div_payload.innerHTML = Payload
    div_signature.innerHTML = Signature
    p_message.innerHTML = message

    return Payload
}

function updatePage() {
    if (id_token_global != null) {
        var div_header = document.getElementById('header_id')
        var div_payload = document.getElementById('payload_id')
        var div_signature = document.getElementById('signature_id')
        var p_message = document.getElementById('message_id')
        var div_raw = document.getElementById('jwt_raw_id')

        var id_token_jwt = JSON.parse(jwtdecode(id_token_global, div_header, div_payload, div_signature, p_message, div_raw));
        if (id_token_jwt['name']) {
            document.getElementById('name').innerText = id_token_jwt['name']
            document.getElementById('sign_in_button').innerText = "Sign in again!"
        }
        document.getElementById('id_token_container').hidden = false
    }

    if (access_token_global != null) {
        var div_header = document.getElementById('header_access')
        var div_payload = document.getElementById('payload_access')
        var div_signature = document.getElementById('signature_access')
        var p_message = document.getElementById('message_access')
        var div_raw = document.getElementById('jwt_raw_access')

        var access_token_jwt = JSON.parse(jwtdecode(access_token_global, div_header, div_payload, div_signature, p_message, div_raw));
        document.getElementById('access_token_container').hidden = false
    }
}