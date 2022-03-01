const io = require('socket.io-client');
const socketClient = io.connect('http://localhost:3000');

console.log("Stopping CARDS")

socketClient.on('connect', () => {
  socketClient.emit('npmStop');
  setTimeout(() => { process.exit(0); }, 1000);
});