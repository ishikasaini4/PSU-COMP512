import React from 'react';
import io from 'socket.io-client';
import './style.css';


class Board extends React.Component {

    timeout;

    //Change it with your local IP and desired port number
    socket = io.connect("http://192.168.0.19:3000/"); 

    ctx;
    isDrawing = false;

    constructor(props) {
        super(props);

        //socket created for the canvas data
        this.socket.on("canvas-data", function(data){

            var root = this;
            var interval = setInterval(function(){

                //do nothing when the client is drawing on the board
                if(root.isDrawing) return;
                root.isDrawing = true;
                clearInterval(interval);

                //Extract whiteboard data in form of Image
                var image = new Image();
                var canvas = document.querySelector('#board');
                var ctx = canvas.getContext('2d');
                image.onload = function() {
                    ctx.drawImage(image, 0, 0);

                    root.isDrawing = false;
                };
                image.src = data;
            }, 200)
        })
    }

    componentDidMount() {
        this.drawOnCanvas();
    }

    componentWillReceiveProps(newProps) {
        //newProps contains whiteboard color and brush size properties
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }

    

    drawOnCanvas() {
        // Get components by id
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;

        var resetBtn = document.querySelector('#ResetButton');

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        
        // Mouse capturing work based on user's movement on the whiteboard
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);

         // Touch capturing work based on user's movement on the whiteboard
         canvas.addEventListener('touchmove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);

        
        // Drawing on the whiteboard using brush and color property selected by the user
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        // Recording the user's movement using mouse and/or touch
        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('touchstart', function(e) {
            canvas.addEventListener('touchmove', onPaint, false);
        }, false);

        canvas.addEventListener('touchend', function(e) {
            canvas.addEventListener('touchmove', onPaint, false);
        }, false);

        canvas.addEventListener('touchcancel', function() {
            canvas.removeEventListener('touchmove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if(root.timeout !== undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function(){

                // Compressing the whiteboard data before sending it to the server
                var base64ImageData = canvas.toDataURL("image/png");
                root.socket.emit("canvas-data", base64ImageData);
            }, 1000)
            // Data is sent from client to server exactly 1 second after user stops drawing on the whiteboard
        };


        // Reset the canvas
        resetBtn.addEventListener('click',function() {
            console.log("erasing");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var base64ImageData = canvas.toDataURL("image/png");
                root.socket.emit("canvas-data", base64ImageData);
        }, false)

    }

    render() {
        return (           
                <div class="sketch" id="sketch">
                <canvas className="board" id="board"></canvas>
           
            </div>
            
        )
    }
}

export default Board