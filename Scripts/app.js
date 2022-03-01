/**
 * Mitchell Peltenburg
 * 100503753
 * February 28, 2022
 */

// IIFE -- Immediately Invoked Function Expression
//AKA -- Anonymous Self-Executing Function
(function()
{
    /**
     * This function uses AJAX to open a connection to the server and returns
     * the data payload to the callback function
     * 
     * @param {string} method 
     * @param {string} url 
     * @param {Function} callback 
     */
    function AjaxRequest(method, url, callback)
    {
        //AJAX STEPS
        // Step 1. - instantiate an XHR Object
        let XHR = new XMLHttpRequest();

        // Step 2. - add an event listener for readystatechange
        XHR.addEventListener("readystatechange", () =>
        {
            if (XHR.readyState === 4 && XHR.status === 200)
            {
                if(typeof callback === "function")
                {
                    callback(XHR.responseText);
                }
                else
                {
                    console.error("ERROR: callback not a function");
                }
            }
        });

        // Step 3. - Open a connection to the server
        XHR.open(method, url);

        // Step 4. - Send the request to the server
        XHR.send();
    }

    /**
     * This function loads the header.html content into the page
     * 
     * @param {string} html_data 
     */
    function LoadHeader(html_data)
    {
        $("header").html(html_data);
        $(`li>a:contains(${document.title})`).addClass("active"); //Look for an anchor tag inside of a list item that says 'Home' and update active link
        CheckLogin();
    }

    /**
     * Executes code when the home page is accessed
     */
    function DisplayHomePage()
    {
        console.log("Home Page");

                
        // fattest memory footprint
        //jQuery way - get all elements with an id of AboutUsButton and for each element add a "click" event
        $("#AboutUsButton").on("click", function(){
            location.href = "about.html";
        });


        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph!</p>`);
        
    }

    /**
     * Executes code when the Products page is accessed
     */
    function DisplayProductsPage()
    {
        console.log("Products Page");
    }

    /**
     * Executes code when the Services page is accessed
     */
    function DisplayServicesPage()
    {
        console.log("Services Page");
    }

    /**
     * Executes code when the About page is accessed
     */
    function DisplayAboutPage()
    {
        console.log("About Page");
    }

    /**
     * Executes code when the Contact page is accessed
     */
    function DisplayContactPage()
    {
        console.log("Contact Page");

        // check if user is logged in
        if(!sessionStorage.getItem("user"))
        {
            // if not... hide show contact list button
            $('a').hide();
        }


        ContactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event)
        {
            event.preventDefault();
            if(subscribeCheckbox.checked)
            {
                let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
                console.log(contact.serialize());
                if(contact.serialize())
                {
                    let key = contact.FullName.substring(0, 1) + Date.now();

                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }

    /**
     * Executes code when the edit page is accessed from the contact page
     */
    function DisplayEditPage()
    {
        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);

        switch(page)
        {
            case "add":
                {
                    //Find all h1 tags inside the main tag and change text
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();
                        AddContact(fullName.value, contactNumber.value, emailAddress.value);
                        location.href = "contact-list.html";


                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "contact-list.html";
                    });
                }
                break;
            default:
                {
                    //Gets Contact from localStorage and displays it in the form
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));

                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();
                        // get changes from the page
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();

                        // replace the item in local storage
                        localStorage.setItem(page, contact.serialize());
                        // go back to the contact list page (refresh)
                        location.href = "contact-list.html";


                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "contact-list.html";
                    });
                }
                break;
        }
    }

    /**
     * This function adds a Contact object to localStorage
     * 
     * @param {string} fullName 
     * @param {string} contactNumber 
     * @param {string} emailAddress 
     */
    function AddContact(fullName, contactNumber, emailAddress)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        console.log(contact.serialize());
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();

            localStorage.setItem(key, contact.serialize());
        }
    }

    /**
     * This method validates a field in the form and displays an error in the message area div element
     * 
     * @param {string} fieldID 
     * @param {RegEx} regular_expression 
     * @param {string} error_message 
     */
    function ValidateContact(fieldID, regular_expression, error_message)
    {
        let messageArea = $("#messageArea").hide();
        

        $("#" + fieldID).on("blur", function()
        {
            let text_value = $(this).val();
            if(!regular_expression.test(text_value))
            {
                // doesn't pass Regex test
                $(this).trigger("focus").trigger("select"); //go back to the text box and select all the text
                
                messageArea.addClass("alert alert-danger").text(error_message).show(); //add the alert to the div element
            }
            else
            {
                // does pass Regex test
                messageArea.removeAttr("class").hide();
            }
        });
    }

    /**
     * Passes RegEx's to the ValidateContact function for validating their respective field and displaying an error message
     */
    function ContactFormValidation()
    {
        ValidateContact("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name");
        ValidateContact("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateContact("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }

    /**
     * Executes code when the Contact-List page is accessed from the Contact page
     */
    function DisplayContactListPage()
    {

        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList");

            let data = "";

            let keys = Object.keys(localStorage); //returns a list of keys from localStorage

            let index = 1;

            //for every key in the keys string array
            for(const key of keys)
            {
                let contactData = localStorage.getItem(key); //get localStorage data value

                let contact = new core.Contact(); //create an empty Contact object
                contact.deserialize(contactData);

                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>`;



                index++;
            }

            contactList.innerHTML = data;

            $("button.delete").on("click", function()
            {
                if(confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val())
                }
                location.href = "contact-list.html";
            });

            $("button.edit").on("click", function()
            {
                location.href = "edit.html#" + $(this).val();
            });
        }

        $("#addButton").on("click", () =>
        {
            location.href = "edit.html#add";
        });
    }

    /**
     * Executes code when the Login page is accessed
     */
    function DisplayLoginPage()
    {
        console.log("Login Page");
        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function()
        {
            let success = false;
            // create an empty user object
            let newUser = new core.User();

            // uses jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function(data)
            {
                // for every user in the users.json file
                for (const user of data.users) 
                {
                    // check if the username and password entered in the form matches this user
                    if(username.value == user.Username && password.value == user.Password)
                    {
                        console.log("success");
                        console.log(user);
                        console.log(newUser);
                        // get the user data from the file and assign to our empty user object
                        newUser.fromJSON(user);
                        DisplaynameSender(user.DisplayName);
                        success = true;
                        break;
                    }
                }
                // if username and password matches - success... then perform the login sequence
            if(success)
            {
                // add user to session storage
                sessionStorage.setItem("user", newUser.serialize());
               
                // hide any error message
                messageArea.removeAttr("class").hide();

                

                // redirect the user to the secure area of our site - contact-list.html
                location.href = "contact-list.html";
            }
            // else if bad credentials were entered...
            else
            {
                // display an error message
                $("#username").trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
            }
            });

        });

        $("#cancelButton").on("click", function()
        {
            // clear the login form
            document.forms[0].reset();

            //return to the home page
            location.href = "index.html";
        });
    }

    /**
     * Executes code when the Registration page is accessed
     */
    function DisplayRegisterPage()
    {
        console.log("Register Page");

        //Prepend a div to the element with an ID of 'registerForm' (just under the Registration header)
        $("#registerForm").prepend('<div id="ErrorMessage"></div>');

        //Runs a series of validation checks using RegEx
        RegisterFormValidation();
        
        $("#registerButton").on("click", (event) =>
        {
            event.preventDefault();
            let success = false;

            // check if the password and confirmed password entered in the form match
            if(password.value == confirmPassword.value && password.value != "")
            {
                console.log("success");
                let newUser = new core.User(firstName.value + " " + lastName.value, emailAddress.value, firstName.value + lastName.value, password.value);
                console.log(newUser);
                // get the user data from the form and assign to a user object
                success = true;
            }
            if(success)
            {              
                // hide any error message
                $("#ErrorMessage").removeAttr("class").hide();

                // clear the registration form
                document.forms[0].reset();
            }
            else if (password.value != confirmPassword.value)
            {
                $("#confirmPassword").trigger("focus").trigger("select");
                $("#ErrorMessage").addClass("alert alert-danger").text("Error: Passwords do not match.").show();
            }
            // else if bad credentials were entered...
            else
            {
                // display an error message
                $("#firstName").trigger("focus").trigger("select");
                $("#ErrorMessage").addClass("alert alert-danger").text("Error: Invalid Registration Info.").show();
            }

        });

    }

    /**
     * Assigns the passed in name to sessionStorage so it may be used on every page
     * until the end of the session or when the user is logged out
     * 
     * @param {string} displayname 
     */
    function DisplaynameSender(displayname)
    {
        let name = displayname;
        sessionStorage.setItem("name", name);

    }

    /**
     * This method validates a field in the form and displays an error in the message area div element
     * 
     * @param {string} fieldID 
     * @param {RegEx} regular_expression 
     * @param {string} error_message 
     */
    function ValidateRegister(fieldID, regular_expression, error_message)
    {
        let messageArea = $("#ErrorMessage").hide();
        

        $("#" + fieldID).on("blur", function()
        {
            let text_value = $(this).val();
            if(!regular_expression.test(text_value))
            {
                // doesn't pass Regex test
                $(this).trigger("focus").trigger("select"); //go back to the text box and select all the text
                
                messageArea.addClass("alert alert-danger").text(error_message).show(); //add the alert to the div element
            }
            else
            {
                // does pass Regex test
                messageArea.removeAttr("class").hide();
            }
        });
    }

    /**
     * Passes RegEx's into the ValidateRegister function in order to validate their respective field
     * for a specific set of parameters
     */
    function RegisterFormValidation()
    {
        ValidateRegister("firstName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})$/, "Please enter a valid First Name. This must include at least a Capitalized first letter");
        ValidateRegister("lastName", /^([A-Z][a-z]{1,})$/, "Please enter a valid Last Name. This must include at least a Capitalized first letter");
        ValidateRegister("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
        ValidateRegister("password", /^([a-zA-Z0-9_-]{6,})$/, "Please enter a password that is atleast 6 characters in length.");
        
    }

    /**
     * Checks if the user is logged in on every page to allow logged in users to access certain pages
     * and prevent logged out users from reaching certain pages
     */
    function CheckLogin()
    {
        // if user is logged in
        if(sessionStorage.getItem("user"))
        {
            // Hides register link in the nav bar
            $("#register").hide();

            sessionName = sessionStorage.getItem("name");
            //console.log(localName);
            // add username to navbar between contact us and login/logout
            $("li").eq(5).after(`
            <li class="nav-item">
              <p>${sessionName}</p>
            </li>`);

            // swap out the login link for logout   
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            ); //Look for an anchor tag inside of a list item that says 'Login' and update active link
            
            $("#logout").on("click", function()
            {
                // perform logout
                sessionStorage.clear();

                // Register link reappears
                $("#register").show();
                
                //redirect back to login
                location.href = "login.html";
            });
        }
    }


    //named function
    /**
     * Executed when the application is launched successfully
     */
    function Start()
    {
        console.log("App Started!");

        AjaxRequest("GET", "header.html", LoadHeader);

        //AddUsernameToNavbar();

        switch (document.title) {
          case "Home":
            DisplayHomePage();
            break;

          case "Our Products":
            DisplayProductsPage();
            break;

          case "Our Services":
            DisplayServicesPage();
            break;

          case "About Us":
            DisplayAboutPage();
            break;

          case "Contact Us":
            DisplayContactPage();
            break;

          case "Contact-List":
            DisplayContactListPage();
            break;

          case "Edit":
            DisplayEditPage();
            break;

          case "Login":
            DisplayLoginPage();
            break;

          case "Register":
            DisplayRegisterPage();
            break;
        }
    }

    window.addEventListener("load", Start);
})();