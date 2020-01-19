// JS file for index.html
const query = document.querySelector.bind(document);
const $loginToggle = query('#login-toggle');
const $loginForm = query('#login-form');
const $loginButton = query('#login-button');
const $signupToggle = query('#signup-toggle');
const $signupForm = query('#signup-form');
const $signupButton = query('#signup-button');

// show signup form
const signupToggleClick = async () => {
    $signupForm.style.display = 'block';
    $loginForm.style.display = 'none';
    $signupToggle.style.borderBottom = '1px solid red';
    $loginToggle.style.borderBottom = 'none';
};

// show login form
const loginToggleClick = async () => {
    $loginForm.style.display = 'block';
    $signupForm.style.display = 'none';
    $loginToggle.style.borderBottom = '1px solid red';
    $signupToggle.style.borderBottom = 'none';
};

// sign up user and go to home page
const signupFormSubmit = async () => {
    let user = {};

    // set user properties to the form fields
    [...$signupForm.elements].forEach(element => {
        user[element.name] = (element.selectedIndex !== undefined) ? element.selectedIndex : element.value;
    });

    try {
        await axios.post('/users', user);
        window.location.href = '/home'
    } catch (ex) {
        // could not create user
    }
};

// log user in and go to home page
const loginFormSubmit = async () => {
    const user = {
        email: query('#login-email').value,
        password: query('#login-password').value
    };

    try {
        // login user
        await axios.post('/users/login', user);
        window.location.href = '/home'
    } catch (ex) {
        // wrong login info
    }
};

window.onload = () => {
    // hide signup form
    $signupForm.style.display = 'none';
    $loginToggle.style.borderBottom = '1px solid red';
    $loginToggle.addEventListener('click', loginToggleClick);
    $loginButton.addEventListener('click', loginFormSubmit);
    $signupToggle.addEventListener('click', signupToggleClick);    
    $signupButton.addEventListener('click', signupFormSubmit);
};