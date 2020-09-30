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

    addValidation();

    var loginFormSubmitBtn = document.getElementsByClassName("signin-btn")[0];
    var loginFormRegisterLink = document.getElementsByClassName("register-btn")[0];

    loginFormRegisterLink.addEventListener('click', function() {
      registerLinkClick();
    });
    
    // add click handler
    loginFormSubmitBtn.addEventListener('click', function() {
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
        alert(err.message || JSON.stringify(err));
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

// handles register link click 
function registerLinkClick() {
  
  // remove any existing modal body content
  modalBody.textContent = '';

  var registerFormTemplate = document.getElementById("registerForm");
  var registerClone = registerFormTemplate.content.cloneNode(true);
  modalBody.append(registerClone);

  var registerFormSubmitBtn = document.getElementById("registerBtn");

  registerFormSubmitBtn.addEventListener("click", function() {
    registerFormSubmitBtnClick();
  });

  

  modalTitle.innerText = "Register"; 
}

// handles register form submit btn click
function registerFormSubmitBtnClick() {
  
}


function addValidation() {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  console.log(forms);
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}















