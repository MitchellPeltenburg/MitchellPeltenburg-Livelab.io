"use strict";
((function()
{
    // check if user is logged in
    if(!sessionStorage.getItem("user"))
    {
        // if not... redirect them back to the login page
        location.href = "login.html";
    }
}))();