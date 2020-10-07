const express = require('express');
const app = express.Router();
const appdb = require("../model/appDB")
var jwt = require("jsonwebtoken")

//This API FOR Registration 
app.post("/regApi", (req, res) => {
    var post_data = {
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Email: req.body.Email,
        Password: req.body.Password,
        User_Role: req.body.User_Role
    }
    appdb.insert_data(post_data)
    .then(() => {
        res.send("inserted data")
    }).catch((err) => {
        console.log(err)
    })
})

// THIS API FOR LOGIN
app.post("/login",(req,res)=>{
    var Email_id = req.body.Email;
    var Password = req.body.Password;
    appdb.login_email(Email_id)
    .then((logindata) => {
        if (logindata.length == 0) {
            res.send("Email is wrong")
        } else {
            appdb.login_Password(Password)
            .then((logindata) => {
                if (logindata.length == 0) {
                    res.send("Password is wrong")
                } else {
                    let newToken = jwt.sign({ "app": logindata }, "Neha")
                    res.cookie(newToken)
                    res.send("login successful")
                }
            })
        }
    }).catch((err) => {
        console.log(err);
    })
});
// Admin will post the data
app.post("/postApi",(req,res)=>{
    let alltoken = req.headers.cookie
    var token = alltoken.split('=')
    token = (token[token.length-2]).slice(11,500)
    jwt.verify(token,"Neha",(err,result)=>{
        // console.log(result);
        var id = result["app"][0]["Id"]
        var Admin = result["app"][0]["Admin"]
        if (Admin == "True"){
            var data = {
                Project : req.body.Project,
                Task : req.body.Task,
                user_id : id
            }
            appdb.admin_post(data)
            .then(()=>{
                console.log("posted data");
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
})

// From this Api will get project
app.get("/getApi",(req,res)=>{
    let alltoken = req.headers.cookie
    var token = alltoken.split('=')
    token = (token[token.length-2]).slice(11,500)
    jwt.verify(token,"Neha",(err,result)=>{
        var Admin = result["app"][0]["Admin"]
    if (Admin == "True"){
        var data = appdb.get_data()
        data.then((res_data)=>{
            // console.log(res_data);
            var data_list = []
            for(var i = 0;i<res_data.length; i++){
                var Project = res_data[i]["Project"]
                data_list.push(Project)
            }
            res.send(data_list)
        }).catch((err)=>{
            console.log(err) 
        })
    }
    })
})

// Update Api
app.put("/adminApi/:Id", (req, res) => {
    var Id = req.params.Id
    let alltoken = req.headers.cookie
    var token = alltoken.split('=')
    token = (token[token.length-2]).slice(11,500)
    jwt.verify(token,"Neha",(err,result)=>{
        var Admin = result["app"][0]["Admin"]
        if (Admin == "True"){
            var update_data = {
                Project : req.body.Project,
                Task : req.body.Task
            }
            appdb.update(update_data,Id)
            .then(() => {
                res.send("update data")
            }).catch((err) => {
                console.log(err)
            })
        }
    })
})

// Remove API
app.delete("/del_Api/:Id", (req, res) => {
    let Id = req.params.Id
    let alltoken = req.headers.cookie
    var token = alltoken.split('=')
    token = (token[token.length-2]).slice(11,500)
    jwt.verify(token,"Neha",(err,result)=>{
        var Admin = result["app"][0]["Admin"]
        if (Admin == "True"){
            appdb.del_data(Id)
            .then(() => {
                res.send(".....delete date.....")
            }).catch((err) => {
                console.log(err)
            })
        }
    })
})

// From this Api will get current assignment
app.get("/getApis/:Id",(req,res) => {
    var Id = req.params.Id
    let alltoken = req.headers.cookie
    var token = alltoken.split('=')
    token = (token[token.length-2]).slice(11,500)
    jwt.verify(token,"Neha",(err,result)=>{
        var Admin = result["app"][0]["Admin"]
        if (Admin == "True"){
            appdb.get_by_id(Id)
            .then((resp_data)=>{
                console.log(resp_data);
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
})

//Authenticated users should be able to see only the assigned modules
app.get("/AdminAPI/:search_value",(req,res)=>{
    var search_value = req.params.search_value
    let alltoken = req.headers.cookie
    var token = alltoken.split('=')
    token = (token[token.length-2]).slice(11,500)
    jwt.verify(token,"Neha",(err,result)=>{
        var user_name = result["app"][0]["First_Name"]
        var list = []
        if (user_name == search_value){
            appdb.user_get_data(search_value)
            .then((resp_data)=>{
                project = resp_data[0]["Project"]
                task = resp_data[0]["Task"]
                name = resp_data[0]["First_Name"]
                list.push(name,project,task)
            res.send(list)
            }).catch((err)=>{
                console.log(err);
            })
        }
    }) 
})

module.exports = app;