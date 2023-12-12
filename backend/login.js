function setup(io) {
  const users = [
    {
      "username": "admin",
      "password": "test123"
    },
    {
      "username": "deboy",
      "password": "test1234"
    }
  ];

  io.on('connection', (socket) => {
    socket.on('checkUsername', (data) => {
      if(usernameAvailable(data.username)){
        socket.emit('checkUsername', { isAvailable:true });
      }else{
        socket.emit('checkUsername', { isAvailable:false });
      }
    });

    function usernameAvailable(username) {
      return !users.some(user => user.username === username);
    }
/* 
    socket.on('login', (data) => {
      const { username, password } = data;
      // Check username and password (you may want to implement proper authentication)
      if (users[username] && users[username].password === password) {
        socket.emit('loginSuccess');
      } else {
        socket.emit('loginFailure');
      }
    });

    socket.on('registerGuest', (username) => {
      users[username] = { isGuest: true };
      socket.emit('registrationSuccess', { username, isGuest: true });
    });

    socket.on('register', (data) => {
      const { username, password } = data;
      users[username] = { password };
      socket.emit('registrationSuccess', { username, isGuest: false });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    }); */
  });
}

module.exports = {
  setup: setup,
};