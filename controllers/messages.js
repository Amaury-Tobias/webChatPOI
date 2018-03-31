function newMessage (data) {
    users.forEach(element => {
        if (element.user == data.to) {
          io.to(element.id).emit('new message', {
            username: data.username,
            message: data.message
          });
        }
      });
}


module.exports = newMessage