// JS file for index.html
const query = document.querySelector.bind(document);

const signupFormSubmit = async (e) => {
    let user = {};

    // set user properties to the form fields
    [...e.target.elements].forEach(element => {
        user[element.name] = (element.selectedIndex !== undefined) ? element.selectedIndex : element.value;
    });

    try {
        await axios.post("/users", user);
        await axios.get('/main');
    } catch (e) {}
};

const loginFormSubmit = async (e) => {
    const user = {
        email: e.target.elements[0].value,
        password: e.target.elements[1].value
    };
    
    try {
        // login user
        await axios.post('/users/login', user);
        await axios.get('/main');
    } catch (e) {}
};

window.onload = () => {
    // hide signup form
    query('#signup-form').style.display = 'none';

    // show login form
    query('#login-toggle').addEventListener('click', () => {
        query('#login-form').style.display = 'block';
        query('#signup-form').style.display = 'none';
    });

    // show signup form
    query('#signup-toggle').addEventListener('click', () => {
        query('#signup-form').style.display = 'block';
        query('#login-form').style.display = 'none';
    });

    query('#login-form').addEventListener('submit', loginFormSubmit);
    query('#signup-form').addEventListener('submit', signupFormSubmit);
};