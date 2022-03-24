function login() {
  let user = {};
  const name = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  console.log(`user ${user}`);
  user = {
    username: `${name}`,
    fullname: `${name} ${lastname}`,
    useremail: `${email}`,
  };
  console.log(user);
  window.localStorage.setItem('user', JSON.stringify(user));
}
function logout() {
  window.localStorage.removeItem('user');
}
