let app = require('express')();
let http = require('http').Server(app);
var appDal = require('../model/dal/dal');
let io = require('socket.io')(http);

io.on('connection', (socket) => {

    // Log whenever a user connects
    console.log('user connected');

    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    // socket.on('message', (message) => {
    //     console.log("Message Received: " + message);
    //     io.emit('message', {type:'new-message', text: message});
    // });
    socket.on('viewProduct', (product) => {
        console.log("Productview productname " + product );
        appDal.updateProduct(product);
        //add to DB of compName +1
        //io.emit('stats', {type:'new-message', text: message});
    });
});

// Initialize our websocket server on port 5000
function ioConnect() {
http.listen(5000, () => {
    console.log('started on port 5000');
});
}

exports.ioConnect = ioConnect;