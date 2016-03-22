
function initAll(){
    var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});
    
    var ball;
    var paddle;
    var bricks;
    var newBrick;
    var brickInfo;
    var scoreText;
    var score = 0;
    var lives = 3;
    var liveText;
    var liveLostText;
    var stop = false;
    
    function preload() {
    	handleRemoteImagesOnJSFiddle();
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.load.image('ball', 'img/ball.png');
        game.load.image('paddle', 'img/paddle.png');
        game.load.image('brick', 'img/brick.png');
    }
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.checkCollision.down = false;
        ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
        ball.anchor.set(0.5);
        game.physics.enable(ball, Phaser.Physics.ARCADE);
        ball.body.velocity.set(150, -150);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1);
        ball.checkWorldBounds = true;
        ball.events.onOutOfBounds.add(function(){
           lives--;
           if(lives >0){
               liveLostText.visible = true;
               ball.body.velocity.set(0, 0);
               ball.reset(game.world.width*0.5, game.world.height-25);
               paddle.reset(game.world.width*0.5, game.world.height-5);
               game.input.onDown.addOnce(function(){
                     stop = false;
                     liveLostText.visible = false;
                     ball.body.velocity.set(150, -150);
               });
           }
           
           stop = true;
           liveText.text = "Lives: " + lives;
           
        }, this);
    
        paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
        paddle.anchor.set(0.5,1);
        game.physics.enable(paddle, Phaser.Physics.ARCADE);
        paddle.body.immovable = true;
    		
        initBricks();
        
        scoreText = game.add.text(5,5,"Score: 0", { font: '18px Arial', fill: '#0095DD' });
        liveText = game.add.text(game.world.width-5,5,"Lives: 3", { font: '18px Arial', fill: '#0095DD' });
        liveText.anchor.set(1,0);
        liveLostText =  game.add.text(game.world.width*0.5,game.world.height*0.5,"You lost a live", { font: '18px Arial', fill: '#0095DD' });
        liveLostText.visible = false;
        liveLostText.anchor.set(0.5);
    }
    function update() {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle);
        game.physics.arcade.collide(ball, bricks, ballHitBrick);
        
        if(score == brickInfo.count.col*brickInfo.count.row){
            alert("Win");
        }
        if(lives == 0){
             alert('Game over!');
            document.body.innerHTML = "";
            initAll();
        }
        if(!stop)
            paddle.x = game.input.x || game.world.width*0.5;
    }
    function initBricks() {
        brickInfo = {
            width: 50,
            height: 20,
            count: {
                row: 7,
                col: 3
            },
            offset: {
                top: 50,
                left: 60
            },
            padding: 10
        }
        bricks = game.add.group();
        for(c=0; c<brickInfo.count.col; c++) {
            for(r=0; r<brickInfo.count.row; r++) {
                var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
                var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
                newBrick = game.add.sprite(brickX, brickY, 'brick');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                bricks.add(newBrick);
            }
        }
    }
    function ballHitBrick(ball, brick) {
        var killTween = game.add.tween(brick.scale);
        killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
        killTween.onComplete.addOnce(function(){
            brick.kill();
        }, this);
        killTween.start();
        score++;
        scoreText.text = "Score: " + score;
    }
    function ballHitPaddle(ball, paddle){
        ball.body.velocity.x = (ball.x-paddle.x) * 2.3;
    }
    // this function (needed only on JSFiddle) take care of loading the images from the remote server
    function handleRemoteImagesOnJSFiddle() {
    	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
    	game.load.crossOrigin = 'anonymous';
    }
}