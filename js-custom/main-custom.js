var modal = document.getElementById("exampleModal");
var modalBody = document.getElementsByClassName("modal-body")[0];
var modalTitle = document.getElementById("modalTitle");
var loginBtn = document.getElementsByClassName("login-btn")[0];


// handles navbar login btn click
loginBtn.addEventListener('click', function() {
  
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

  $(".login-alert").text(error).show();

  console.log(error);
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
  
  var fName = document.getElementById("fNameInput").value;
  var lName = document.getElementById("lNameInput").value;
  var username = (fName + " " + lName);
  var userEmail = document.getElementById("emailRegisterInput").value;
  var password = confirmPassword();

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
      alert(err.message || JSON.stringify(err));
      return;
    }
    cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
    //change elements of page
  });
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

// handles validating the password confirmation input
function confirmPassword() {
  
  var password;

  // compare the values in the two password inputs
  if (document.getElementById("registerPasswordInput").value != document.getElementById("confirmPasswordInput").value) {
    // the contents of the string don't really do anything, but a non-empty string basically means "wrong"
    document.getElementById("confirmPasswordInput").setCustomValidity("Passwords did not match.");
  } 
  else {
    // an empty string is basically saying that the value is correct.
    document.getElementById("confirmPasswordInput").setCustomValidity("");
    // if it's correct get the password value and return it to the caller
    password = document.getElementById("registerPasswordInput").value;
    return password;	
  }  
}













