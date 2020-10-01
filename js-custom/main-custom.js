var modal = document.getElementById("exampleModal");
var modalBody = document.getElementsByClassName("modal-body")[0];
var modalTitle = document.getElementById("modalTitle");
var loginBtns = document.getElementsByClassName("login-btn");


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
      loginSubmitBtnClick();
    });

    modalTitle.innerText = "Login"; 
  });
}

// handles login form submit btn click
function loginSubmitBtnClick() {

  // get the form data
  var authenticationData = {
    Username : document.getElementById("inputUsername").value,
    Password : document.getElementById("inputPassword").value,
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

// handles successful login
function loginSuccess() {

  // remove any existing modal body content
  modalBody.textContent = '';

  var headerSuccess = document.createElement("h4");
  headerSuccess.innerText = "Login Successful!";

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
    processFormData(username, userEmail, password);
  }
}

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

// handles validating the password confirmation input
function confirmPassword(password, password2) {
  
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

// handles register form submission
function processFormData(username, userEmail, password) {

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












