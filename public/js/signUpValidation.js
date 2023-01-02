
// email validation
const emailInput = document.getElementById('email');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
if (!emailInput.value.match(emailRegex)) {
  alert('Invalid email address.');
}

// password validation
const password = document.getElementById('password').value;
const confirmPassword = document.getElementById('confirm-password').value;

if (password.value !== confirmPassword.value) {
  alert('Entered passwords do not match');
}
if (password.length < 6) {
  alert('Password must be more than 6 characters long')
}