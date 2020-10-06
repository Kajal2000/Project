let knex = require("./connection.js")

// This is Registration table
knex.schema.createTable("Registration", (table) => {
    table.increments("Id")
    table.string("First_Name")
    table.string("Last_Name")
    table.string("Email")
    table.string("Password")
    table.string("User_Role")
}).then(()=>{
    console.log("table created well")
}).catch((err)=>{
    console.log(err,"oops some err")
})

// This is second tbl for Assign-Model
knex.schema.createTable("Assign_Model", (table) => {
    table.increments("Id")
    table.string("Project")
    table.string("Task")
    table.integer("user_id").unsigned()
    table.foreign("user_id").references("Registration.Id")
}).then(()=>{
    console.log("table created well")
}).catch((err)=>{
    console.log(err,"oops some err")
})
