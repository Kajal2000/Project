let knex = require('../connection')

//This IS FOR Registration 
let insert_data = (data) => {
    return knex("Registration").insert(data)
}

// THIS API FOR LOGIN
var login_email = (Email) => {
    return knex.select("*").from("Registration")
    .havingIn("Registration.Email", Email)
}

var login_Password = (Password) => {
    return knex.select("*").from("Registration")
    .havingIn("Registration.Password", Password)
}
// Admin will post the data
var admin_post = (data)=>{
    return knex("Assign_Model")
    .insert(data)
}

// From this Api will get project
let get_data = () => {
    return knex.select("*")
    .from("Assign_Model")
}
// Update Api
let update = (data,Id) => {
    return knex('Assign_Model')
    .update(data)
    .where("Assign_Model.Id",Id)
}
// Remove API
let del_data = (Id) => {
    return knex("Assign_Model")
    .where("Assign_Model.Id",Id)
    .del()
}

// From this Api will get current assignment
let get_by_id = (Id) => {
    return knex.select("*").from("Assign_Model")
    .join('Registration','Assign_Model.Id',"=",'Registration.Id')
    // .select("Assign_Model.Id","Project","Task","Registration.Id","First_Name","Last_Name")
    .where("Assign_Model.Id",Id)
};

//Authenticated users should be able to see only the assigned modules

var user_get_data = (search_value)=>{
    return knex.select("*")
    .from("Assign_Model")
    .join('Registration','Assign_Model.Id',"=",'Registration.Id')
    .where('First_Name','like',  '%' +search_value+ '%')
}

module.exports = {insert_data,login_email,login_Password,
    admin_post,get_data,update,del_data,get_by_id,
    user_get_data}