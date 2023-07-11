const  express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// Inorder to serve static file (public)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

    const firstName = req.body.fName; 
    const lastName = req.body.lName;   
    const email = req.body.email;

    // Data that the mailchimp need
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
            
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/782e384274";

    const option = {
        method: "POST",
        auth: "shruti827:f8a76b61bcdf0f897ad96249721d41ca-us17"
    };

    const request = https.request(url, option, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data) {
        console.log(JSON.parse(data));
        })
    })

    // Send request to mailchimp
    request.write(jsonData);
    request.end();

    // console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res) {
    res.redirect("/")
})

// API Key --> f8a76b61bcdf0f897ad96249721d41ca-us17
// List Id --> 782e384274 

app.listen(3000, function() {
    console.log("Server is running on port 3000"); 

});