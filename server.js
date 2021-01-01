const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    origins: '*:*',
    transports: ['polling']
})
const { v4: uuidV4 } = require('uuid')

// const expressStatusMonitor = require('express-status-monitor');
// app.use(expressStatusMonitor({ websocket: io, port: app.get('port') }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})


// socket = io.connect("ws://dow.innovateframeworks.com/");
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})
  


server.listen(3000, function() {
    // server.close(function() {
    //     server.listen(3000, '192.168.43.239')
    // })
    console.log('listening on port: '+ 3000)
})