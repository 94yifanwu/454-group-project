var modal = document.getElementById("exampleModal");
var modalBody = document.getElementsByClassName("modal-body")[0];
var modalTitle = document.getElementById("modalTitle");
var loginBtns = document.getElementsByClassName("login-btn");

var recipes = [];


// fires on page load
$(document).ready(function() {

  // populate the ingredients dropdown
  fetch('https://xghmh4k433.execute-api.us-west-1.amazonaws.com/prod/ingredients/?id=0')
    .then(response => response.text()
    .then(data => getIngredients(JSON.parse(data))));

  // add search recipes function to btn
  $('#searchRecipesBtn').on('click', function(){
    // gather all the ingredients

    let searchParameters = $('#userIngredientsList').children();

    // remove previous selections from the DOM
    $('#userIngredientsList').empty();
    $('#resultsList').empty();

    // base url
    let url = 'https://xghmh4k433.execute-api.us-west-1.amazonaws.com/prod/recipes/?'
    // counter for unique param names
    let count = 0;

    // iterate through ingredients 
    for(let item of searchParameters) {
      // construct query param
      url += "param" + count + "=" + item.textContent + "&";
      count++;
    }

    getRecipes(url);
  });
});


function getIngredients(data) {
  
  // append an li item for every ingredient in the list
  for(item of data) {
    $("#ingredientListId").append('<li class="item">'+ item + '</li>');
  }

  // add the event listener
  $('.item').on('click', function(){
    // get the value of the selected li
    let item = $(this).text();
    // add it to the list of ingredients
    $('#userIngredientsList').append('<li>'+ item + '</li>');
  });
}

function getRecipes(url) {

    // search for recipes based on search parameters with given url
    fetch(url)
    .then(response => response.text()
    .then(data => appendRecipes(JSON.parse(data))));
}

function appendRecipes(data) {
  console.log(data);

  // store data in our local 'DB' variable
  recipes = data;


  if(data == []) {
    console.log('no results!');
  }
  else {

  }

  for(let item of data) {

    $("#resultsList").append('<li class="result-item">'+ item.Name + '</li>');
  }

  $('.result-item').on('click', function(){
  

    $("#recipeInfoList").empty();
    $("#recipeInstructionsList").empty();

    let listRecipeName = $(this).text();
    
    for(recipe of recipes) {
      if(recipe.Name === listRecipeName) {
        console.log(recipe);
        $("#recipeName").text(recipe.Name);
        $("#recipeInfoList").append('<li>Servings:'+ recipe.Servings + '</li>');
        $("#recipeInfoList").append('<li>Yield:'+ recipe.Yield + '</li>');
        $("#recipeInfoList").append('<li>Prep:'+ recipe.Prep + '</li>');
        $("#recipeInfoList").append('<li>Cook:'+ recipe.Cook + '</li>');
        $("#recipeInfoList").append('<li>Total:'+ recipe.Total + '</li>');

        console.log(recipe.Instructions);

        for(instr of recipe.Instructions) {
          $("#recipeInstructionsList").append('<li>' + instr + '</li>');
        }  
      }
    }

  });
}


for(var i = 0; i <= 1; i++) {
  loginBtns[i].addEventListener('click', function() {

    // remove any existing modal body content
    modalBody.textContent = '';

    var loginFormTemplate = document.getElementById("loginForm");
    var loginClone = loginFormTemplate.content.cloneNode(true);
    modalBody.append(loginClone);

    $(".login-alert").hide();
    addValidation();

    var loginFormSubmitBtn = document.getElementsByClassName("signin-btn")[0];
    var loginFormRegisterLink = document.getElementsByClassName("register-btn")[0];

    loginFormRegisterLink.addEventListener('click', function() {
      registerLinkClick();
    });
    
    // add click handler
    loginFormSubmitBtn.addEventListener('click', function(event) {
      //event.preventDefault();
      loginFormSubmitBtnClick();
    });

    modalTitle.innerText = "Login"; 
  });
}

// handles login form submit btn click
function loginFormSubmitBtnClick() {

  // boolean check 
  var formDataIsValid;
  // form data
  var loginUsername = document.getElementById("inputUsername").value;
  var loginPassword = document.getElementById("inputPassword").value;

  formDataIsValid = validateLoginFormData(loginUsername, loginPassword);

  if(formDataIsValid) {
    processLoginFormData(loginUsername, loginPassword);
  }
} 

// handles successful login
function loginSuccess() {

  // remove any existing modal body content
  modalBody.textContent = '';

  modalTitle.innerText = "Success!";

  var headerSuccess = document.createElement("h4");
  headerSuccess.innerText = "Login successful, welcome back!";

  modalBody.append(headerSuccess);

  setTimeout(function(){ $("#exampleModal").modal("hide"); }, 2000);
}

// handles login fail
function loginFailure(err) {
  var error = err.message || JSON.stringify(err);
  //alert(err.message || JSON.stringify(err));

  // handle case: invalid email w/ password
  if(error === "Unkown error") {
    $(".login-alert").text("Incorrect username or password.").show();
  }
  // just print all the other errors
  else {
    $(".login-alert").text(error).show();
  }
}

// handles register link click 
function registerLinkClick() {
  
  // remove any existing modal body content
  modalBody.textContent = '';

  var registerFormTemplate = document.getElementById("registerForm");
  var registerClone = registerFormTemplate.content.cloneNode(true);
  modalBody.append(registerClone);

  addValidation();
  document.getElementById("confirmPasswordInput").onchange = confirmPassword;

  var registerFormSubmitBtn = document.getElementById("registerBtn");

  registerFormSubmitBtn.addEventListener("click", function() {
    registerFormSubmitBtnClick();
  });

  modalTitle.innerText = "Register"; 
}

// handles register form submit btn click
function registerFormSubmitBtnClick() {
  
  // boolean check 
  var formDataIsValid;
  // form data
  var fName = document.getElementById("fNameInput").value;
  var lName = document.getElementById("lNameInput").value;
  var username = fName + " " + lName;
  var userEmail = document.getElementById("emailRegisterInput").value;
  var password = document.getElementById("registerPasswordInput").value;
  var password2 = document.getElementById("confirmPasswordInput").value;

  formDataIsValid = validateRegisterFormData(fName, lName, userEmail, password, password2);

  if(formDataIsValid) {
    processRegisterFormData(username, userEmail, password);
  }
}

// validates the register form to determine if it will be processed
function validateRegisterFormData(fName, lName, userEmail, password, password2) {

  // regex for name validation
  var nameRegExp = /^[A-Za-z]+$/;
  // regex for email validation
  var emailRegExp = /^\S+@\S+[\.][0-9a-z]+$/;
  //  regex for password validation
  var passwordRegExp = /(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  // READ: match funct returns null if the reg exp doesnt find a string that fits the condition

  // validate name
  if(fName.match(nameRegExp) === null || lName.match(nameRegExp) === null) {
    return false;
  }
  // validate email
  if(userEmail.match(emailRegExp) === null) {
    return false;
  }
  // validate password
  if(password.match(passwordRegExp) === null) {
    return false;
  }
  // confirm equal password input
  if(confirmPassword(password, password2)) {
    return false;
  }

  // if all the data checks out
  return true;
}

// validates the login form to determine if it will be processed
function validateLoginFormData(username, password) {
  
  // regex for username (email) validation
  var emailRegExp = /^\S+@\S+[\.][0-9a-z]+$/;
  // regex for password validation
  var passwordRegExp = /.+/;

  // validate username
  if(username.match(emailRegExp) === null) {
    return false;
  }  
  // validate password
  if(password.match(passwordRegExp) === null) {
    return false;
  }
  // if the username is formatted correctly
  return true;
}

// handles validating the password confirmation input
function confirmPassword(password, password2) {
  
  console.log(password + " vs. " + password2);

  if (password != password2) {
    // the contents of the string in setCustomValidity don't really do anything, but a non-empty string basically means "wrong"
    document.getElementById("confirmPasswordInput").setCustomValidity("Passwords did not match.");
    return true;
  } 
  else {
    // an empty string is saying that the value is correct.
    document.getElementById("confirmPasswordInput").setCustomValidity("");
    return false;	
  }  
}

// handles login form submission
function processLoginFormData(username, password) {
  
  // get the form data
  var authenticationData = {
    Username : username,
    Password : password,
  };
  // directions on what user pool to use for our app
  var poolData = {
    UserPoolId : _config.cognito.userPoolId, // User Pool Id Here
    ClientId : _config.cognito.clientId, // App Client Id Here
  };
  // get response data from AWS Cognito
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  var userData = {
    Username : document.getElementById("inputUsername").value,
    Pool : userPool,
  };
  // get data for the user trying to log in
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // try to login in the user, notify if there's an error
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      console.log(accessToken);	
      loginSuccess();
    },
    onFailure: function(err) {
      loginFailure(err);
    },
  });
}

// handles register form submission
function processRegisterFormData(username, userEmail, password) {

  poolData = {
    UserPoolId : _config.cognito.userPoolId, // Your user pool id here
    ClientId : _config.cognito.clientId // Your client id here
  };
  
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var attributeList = [];

  // username (email)
  var dataEmail = {
    Name : 'email', 
    Value : userEmail, 
  };
  // full name of user
  var dataPersonalName = {
    Name : 'name', 
    Value : username, 
  };
    
  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);

  attributeList.push(attributeEmail);
  attributeList.push(attributePersonalName);

  userPool.signUp(userEmail, password, attributeList, null, function(err, result){

    if (err) {
      //alert(err.message || JSON.stringify(err));
      registerFail(err);
      return;
    }
    // else
    registerSuccess(result);
  });
}

function registerSuccess(result) {
  
  var cognitoUser = result.user;

  // remove previous content
  modalBody.textContent = '';

  // change modal title
  modalTitle.innerText = "Almost there!";

  // create response with error feedback
  var responseSuccess = document.createElement("p");
  var feedback = document.createElement("p");

  responseSuccess.innerText = "Please check your email for an account verification link.";
  feedback.innerText = "user name is " + cognitoUser.getUsername();

  // append to the modal
  modalBody.append(responseSuccess);
  modalBody.append(feedback);
}

function registerFail(err) {

  // remove previous content
  modalBody.textContent = '';

  // change modal title
  modalTitle.innerText = "Uh-oh!";
  var errorMessage = err.message || JSON.stringify(err);

  // create response with error feedback
  var responseFail = document.createElement("p");
  var feedback = document.createElement("p");

  responseFail.innerText = "There was a problem with your registration.";
  feedback.innerText = errorMessage;

  // append to the modal
  modalBody.append(responseFail);
  modalBody.append(feedback);
}

// helper function for custom form validation
function addValidation() {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  //console.log(forms);

  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      // prevent any form submission at all - even if all data is validated
      event.preventDefault();

      /*if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }*/
      form.classList.add('was-validated');
    }, false);
  });
}











