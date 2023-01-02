
// email validation
const emailInput = document.getElementById('email');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
if (!emailInput.value.match(emailRegex)) {
  alert('Invalid email address.');
}

// password validation
const password = document.getElementById('password').value;

if (password.length < 5) {
  alert('Password must be more than 5 characters long')
}