const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const https = require("https");

    const data = {
        members: [
            {
            email_address : email,
            status: "subscribed",
            merge_fields : {
                FNAME: firstName,
                LNAME: lastName
            }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    var url = "https://us18.api.mailchimp.com/3.0/lists/6a3454321f";

    const options = {
        method: "POST",
        auth: "puneet:9c01882c055b43f2f0f9ef0bf71a0916-us18"
    }
    
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    app.post("/failure", function(req, res){
        res.redirect("/");
    })

    request.write(jsonData);
    request.end();

})


app.listen(process.env.PORT || 3000, function(){
    console.log("server started at port 3000.");
})


// API key
// 9c01882c055b43f2f0f9ef0bf71a0916-us18

// list ID
// 6a3454321f