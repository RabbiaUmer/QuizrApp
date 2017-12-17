// This script tries to reconnect the socket if it is already not connected

if (!socket.connected) {
  socket = io.connect('localhost:8000', {
    query: 'token=' + authToken
  });
}