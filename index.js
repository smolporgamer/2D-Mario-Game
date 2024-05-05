
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1
let jumpCounter = 0;


//image loader
function createImage(imageSrc) {
    const image = new Image();
    image.onload = function() {
        console.log("Image loaded successfully:", imageSrc);
    };
    image.onerror = function() {
        console.error("Error loading image:", imageSrc);
    };
    image.src = imageSrc; // Set the source inside the function
    return image;
}


let platformImage = createImage('./assets/img/platform.png');
let backgroundImage = createImage('./assets/img/background.png');
let hillsImage = createImage('./assets/img/hills.png');
let platformSmallTall = createImage('./assets/img/platformSmallTall.png');
let flagPole = createImage('./assets/img/flagpole.png');

// let spriteRunLeft = createImage('./assets/img/spriteRunLeft.png');
// let spriteRunRight = createImage('./assets/img/spriteRunRight.png');
// let spriteStandLeft = createImage('./assets/img/spriteStandLeft.png');
// let spriteStandRight = createImage('./assets/img/spriteStandRight.png');


class Platform {
    constructor({x, y, image}) {
        this.position = {
            x:x, // x:x the same
            y:y   // y:y the same
        }

        this.image = image
        this.width = image.width
        this.height = image.height

    }
    draw() {
        //image resource
        c.drawImage(this.image, this.position.x, this.position.y)

        //plain rectangle
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x:x, // x:x the same
            y:y   // y:y the same
        }

        this.image = image
        this.width = image.width
        this.height = image.height

    }
    draw() {
        //image resource
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        //gravity
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150

        // this.image = createImage(spriteRunRight)
        // this.frames = 0
        // this.sprites = {
        //     stand: {
        //         right: createImage(spriteStandRight)
        //     },
        //     run: {
        //         right: createImage(spriteRunRight)
        //     }
        // }
        // this.currentSprite = this.sprites.stand.right
    }
    draw () {
        // c.drawImage(
        //     this.currentSprite,
        //     this.image, 
        //     177 * this.frames,
        //     0,
        //     177 ,
        //     400,
        //     this.position.x,
        //     this.position.y, 
        //     this.width, 
        //     this.height
        // )
        //rectangle style
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        // this.frames++
        // if (this.frames > 28) {
        //     this.frames = 0
        // }
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //gravity ground logic
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }
    }
}


 
let player = new Player()
// const platform = new Platform() //replaced
let platforms = []

let genericObjects = []

// player left and right movement
const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    }
}

let scrollOffset = 0

function init(){
 player = new Player()
// const platform = new Platform() //replaced
 platforms = [ 
                    new Platform({
                        x: platformImage.width * 4 + 300- 2 + platformImage.width - platformSmallTall.width,
                        y: 270,
                        image:platformSmallTall
                    }),
                    new Platform({
                        x: -1,
                        y: 470,
                        image:platformImage
                    }), 
                    new Platform({
                        x: platformImage.width -3,
                        y: 470,
                        image:platformImage
                    }),
                    new Platform({
                        x: platformImage.width * 2 + 100,
                        y: 470,
                        image:platformImage
                    }),
                    new Platform({
                        x: platformImage.width * 3 + 400,
                        y: 470,
                        image:platformImage
                    }),
                    new Platform({
                        x: platformImage.width * 4 + 300 -2,
                        y: 470,
                        image:platformImage
                    }),
                    new Platform({
                        x: platformImage.width * 5 + 800 -2,
                        y: 470,
                        image:platformImage
                    }),
                    new Platform({
                        x: platformImage.width * 5 + 1300 -2,
                        y: 320,
                        image:flagPole
                    })
                  ]

 genericObjects = [
                        new GenericObject({
                            x: -1,
                            y: -1,
                            image: backgroundImage
                        }),
                        new GenericObject({
                            x: -1,
                            y: -1,
                            image: hillsImage
                        })
                  ]

scrollOffset = 0

}

//animation loop
function animate() {//recursive function
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach((genericObject) => {
        genericObject.draw()
    })

    // platform.draw() //replaced
    platforms.forEach( (platform) => {
        platform.draw()
    })
    player.update()

    //player movement
    if (keys.right.pressed && player.position.x < 400){//move player right 
        player.velocity.x = player.speed
    } else if (keys.left.pressed && player.position.x > 100
        || keys.left.pressed && scrollOffset === 0 
        && player.position.x > 0
    ){// move player left
        player.velocity.x = -player.speed
    } else {//move canvas left or right when hit edges
        player.velocity.x = 0

        //canvas movement
        if(keys.right.pressed){// move canvas left
            scrollOffset += player.speed
            platforms.forEach( (platform) => {
            platform.position.x -= player.speed
            })
            genericObjects.forEach((genericObject) =>{
                genericObject.position.x -=  player.speed * 0.66
            })
        }else if (keys.left.pressed && scrollOffset > 0) { // move canvas right
            scrollOffset -= player.speed
            platforms.forEach( (platform) => {
                platform.position.x +=  player.speed
                })
            genericObjects.forEach((genericObject) =>{
                genericObject.position.x += player.speed * 0.66
            })
        }
    }
    
    //platform collision detection
        // 1. platform ground
        // 2. only above platform ground
        // 3. right side slide of platform
        // 4. left side slide of platform
    platforms.forEach( (platform) => {
        if( player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y 
            && player.position.x + player.width >= platform.position.x 
            && player.position.x <= platform.position.x + platform.width    
        ){
            player.velocity.y = 0;
        }
    })


    //win condition
    if(scrollOffset > platformImage.width * 5 + 800 - 2){

        console.log("winner")
    }

    //lose condition
    if(player.position.y > canvas.height){
        init()
    }
}

function stop(){
    
}

init()
animate()

addEventListener('keydown', ({keyCode}) =>{
    switch(keyCode){
        case 87 : // W key
        case 38 : // Up arrow key
            if (player.velocity.y === 0) { // Allowing jump only if player is on the ground
                player.velocity.y -= 20; // Adjust the vertical velocity for the jump
            }
            break;
        case 65 : // A key
        case 37 : // Left arrow key
            keys.left.pressed = true;
            break;
        case 83 : // S key
        case 40 : // Down arrow key
        if(player.velocity.y > 0){
            player.velocity.y += 20;
            
        }
        break;
        case 68 : // D key
        case 39 : // Right arrow key
            keys.right.pressed = true;
            break;
    }
});

addEventListener('keyup', ({keyCode}) =>{
    switch(keyCode){
        case 87 : // W key
        case 38 : // Up arrow key
            break;
        case 65 : // A key
        case 37 : // Left arrow key
            keys.left.pressed = false
            break;
        case 83 : // S key
        case 40 : // Down arrow key
        if(player.velocity.y > 0){
            player.velocity.y += 20;

        }
            break;
        case 68 : // D key
        case 39 : // Right arrow key
            keys.right.pressed = false
            break;
    }
});

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
