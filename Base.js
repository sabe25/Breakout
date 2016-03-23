var BasicGame = {}

BasicGame = function(){
    
    this.levelinfo = LevelInfo[4];
    this.level = 1;
    this.ball;
    this.paddle;
    this.bricks;
    this.newBrick;
    this.brickInfo;
    this.scoreText;
    this.score = 0;
    this.lives = 3;
    this.liveText;
    this.liveLostText;
    this.stop = true;
    this.startButton;
    this.emitter;  
    this.particlecnt = isMobile ? 10 :30;
    this.lvlText;
    this.nextLvlText;
    this.combo =0;
    this.comboText;
    this.winText;
    this.speedBase = 5;
    this.speed = this.speedBase;
    this.speedScore = 0;
    this.brickSize ={
          width:0,
          height:0,
          marginleft:(50 + this.levelinfo.padding/2),
          margintop:(30 +this.levelinfo.padding/2)
        };
};



BasicGame.prototype = {
        
        
        
    startGame : function (){
        this.startButton.destroy();
        this.stop = false;
        this.ball.body.velocity.set(0, -150);
    },
    
    ballHitBrick : function (ball, brick) {
        /*var killTween = game.add.tween(brick.scale);
        bricks.body.enable =false;
        killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
        killTween.onComplete.addOnce(function(){
            brick.kill();
        }, game);*/
        //  Position the emitter where the mouse/touch event was
        brick.stat--;
        if(brick.stat == 0){
            brick.kill();
            this.bricks.removeChild(brick);
            this.emitter.x = brick.x+ this.brickSize.width/2;
            this.emitter.y = brick.y+ this.brickSize.height/2;
        
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst
            
            
            this.emitter.start(true, 2000, null, this.particlecnt);
            //killTween.start();
            this.score += this.combo+1;
            this.speedScore += this.combo+1;
            
            this.combo++;
            
            if(this.combo >3) this.speedScore += this.combo*10;
            this.comboText.text = "Combo: " + this.combo;
            this.scoreText.text = "Score: " + this.score;
            
        }
        else{
            /*var bitmap = brick.key; 
            bitmap.rect(0,0,this.brickSize.width,this.brickSize.height,"hsl(210,90%,"+(90 - brick.stat*8 )+"%)" );
            */
            //brick.key.rect(0,0,this.brickSize.width,this.brickSize.height,"hsl(210,90%,"+(90 - brick.stat*8 )+"%)" );
            var bitmap = new Phaser.BitmapData(game,'brick',this.brickSize.width,this.brickSize.height);
            bitmap.rect(0,0,this.brickSize.width,this.brickSize.height,"hsl(210,90%,"+(90 - brick.stat*10 )+"%)" );
            
            brick.key = bitmap;
            brick.loadTexture(bitmap,0);
        }
    },
    ballHitPaddle : function (ball, paddle){
        ball.body.velocity.x = (ball.x-paddle.x) * this.speed;
        ball.body.velocity.y = -30 * this.speed;
        this.combo = 0;
        this.comboText.text = "Combo: " + this.combo;
    },
// this function (needed only on JSFiddle) take care of loading the images from the remote server
    handleRemoteImagesOnJSFiddle : function () {
    	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
    	game.load.crossOrigin = 'anonymous';
    },
    initBricks : function () {
        this.bricks.removeAll(true);
        //this.bricks = game.add.group();
        var matrix = {
            col : this.levelinfo.matrix[0].length,
            row:this.levelinfo.matrix.length
        };
        
        
        this.brickSize.marginleft=(50 + this.levelinfo.padding/2);
        this.brickSize.margintop=(30 +this.levelinfo.padding/2);
        this.brickSize.width = (game.world.width-(2*this.brickSize.marginleft))/matrix.col - this.levelinfo.padding;
        this.brickSize.height = this.brickSize.width * 0.4;
        
        
        for(var r=0; r<matrix.row; r++) {
            for( var c=0; c<matrix.col; c++) {
                if(this.levelinfo.matrix[r][c] !=0){
                    var brickX = (c*(this.brickSize.width+this.levelinfo.padding))+this.brickSize.marginleft;
                    var brickY = (r*(this.brickSize.height+this.levelinfo.padding))+this.brickSize.margintop;
                    var bitmap = new Phaser.BitmapData(game,'brick',this.brickSize.width,this.brickSize.height);
                    bitmap.rect(0,0,this.brickSize.width,this.brickSize.height,
                        "hsl(210,90%,"+(90 - this.levelinfo.matrix[r][c]*10 )+"%)" );
                    
                    this.newBrick = game.add.sprite(brickX, brickY, bitmap);
                    game.physics.enable(this.newBrick, Phaser.Physics.ARCADE);
                    this.newBrick.body.immovable = true;
                    this.newBrick.anchor.set(0,0);
                    this.newBrick.stat = this.levelinfo.matrix[r][c];
                    this.bricks.add(this.newBrick);
                }
            }
        }
    }
        
}
BasicGame.prototype.preload = function() {
	this.handleRemoteImagesOnJSFiddle();
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    //game.load.image('brick', 'img/brick.png');
    game.load.spritesheet('button', 'img/button.png', 120, 40);
    
};
    
BasicGame.prototype.create = function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    this.ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
    this.ball.anchor.set(0.5);
    game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1);
    this.ball.checkWorldBounds = true;
    this.ball.events.onOutOfBounds.add(function(){
       this.lives--;
       this.combo = 0;
       this.speedScore = 0;
       if(this.lives >0){
           this.liveLostText.visible = true;
           this.ball.body.velocity.set(0, 0);
           this.ball.reset(game.world.width*0.5, game.world.height-25);
           this.paddle.reset(game.world.width*0.5, game.world.height-5);
           this.game.input.onDown.addOnce(function(){
                 this.stop = false;
                 this.liveLostText.visible = false;
                 this.ball.body.velocity.set(0, -150);
           },this);
       }
       
       this.stop = true;
       this.liveText.text = "Lives: " + this.lives;
       
    }, this);
    
    
    this.emitter = game.add.emitter(0, 0, 1000);
    
    var bitmap = new Phaser.BitmapData(game, 'pad', 5, 5);
    
    bitmap.rect(0,0,5,5,"hsl(210,90%,80%)");
    
    
    this.emitter.makeParticles(bitmap);
    this.emitter.gravity = 200;
    this.emitter.pysicsBodyType = Phaser.Physics.ARCADE;
    this.emitter.bounce.set(0.7);
    
    this.paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    this.paddle.anchor.set(0.5,1);
    game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.immovable = true;
    
    this.startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', this.startGame, this, 1, 0, 2);
    this.startButton.anchor.set(0.5);
    
    this.scoreText = game.add.text(5,5,"Score: " + this.score, { font: '18px Arial', fill: '#0095DD' });
    this.liveText = game.add.text(game.world.width-5,5,"Lives: " + this.lives, { font: '18px Arial', fill: '#0095DD' });
    this.liveText.anchor.set(1,0);
    this.liveLostText =  game.add.text(game.world.width*0.5,game.world.height*0.5,"You lost a live! Tab to continue", { font: '18px Arial', fill: '#0095DD' });
    this.liveLostText.visible = false;
    this.liveLostText.anchor.set(0.5);
    
    this.lvlText = game.add.text(game.world.width/2,5,"Level: " + this.level, { font: '18px Arial', fill: '#0095DD' });
    this.lvlText.anchor.set(0.5,0);
    
    this.nextLvlText = game.add.text(game.world.width*0.5,game.world.height*0.5,"Yeah! Next Level\nDo you beat Level "+this.level+"?", { font: '18px Arial', fill: '#0095DD' });
    this.nextLvlText.anchor.set(0.5);
    this.nextLvlText.visible = false;
    
    this.comboText = game.add.text(5,game.world.height-5,"Combo: "+this.combo, { font: '18px Arial', fill: '#0095DD' });
    this.comboText.anchor.set(0,1);
    
    
    this.winText = game.add.text(game.world.width*0.5,game.world.height*0.5,
                    "OH my God!! You did it :D\nWanna play again?", { font: '18px Arial', fill: '#0095DD' });
    this.winText.anchor.set(0.5);
    this.winText.visible =false;
    this.bricks = game.add.group();
    this.initBricks();
};
    
BasicGame.prototype.update = function () {
    game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle,null,this);
    game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick,null,this);
    game.physics.arcade.collide(this.emitter, this.bricks);
    if(this.bricks.length == 0){
        this.level ++;
        if(this.level > LevelInfo.length){
            this.winText.visible = true;
            this.stop = true;
            this.game.input.onDown.addOnce(function(){
                this.level=1;
                this.levelinfo = LevelInfo[this.level-1];
                this.lvlText.text = "Level: " + this.level;
                this.initBricks();
                this.score  = 0;
                this.combo = 0;
                this.lives = 3;
                this.stop = false;
                this.winText.visible = false;
                this.ball.body.velocity.set(150, -150);
            },this);
        }
        else{
            
            this.levelinfo = LevelInfo[this.level-1];
            this.lvlText.text = "Level: " + this.level;
            this.initBricks();
            this.stop = true;
            this.nextLvlText.text = "Yeah! Next Level\nDo you beat Level "+this.level+"?";
            this.nextLvlText.visible = true;
            this.ball.body.velocity.set(0, 0);
            this.ball.reset(game.world.width*0.5, game.world.height-25);
            this.paddle.reset(game.world.width*0.5, game.world.height-5);
            this.game.input.onDown.addOnce(function(){
                this.stop = false;
                this.nextLvlText.visible = false;
                this.ball.body.velocity.set(0, -150);
            },this);
        }
            
    }
    if(this.combo <2)this.comboText.visible =false;
    if(this.combo == 2)this.comboText.visible =true;
    if(!this.stop){
        this.paddle.x = game.input.x - (isMobile?100:0) || game.world.width*0.5;
    
        if(this.lives == 0){
            alert('Game over!');
            document.body.innerHTML = "";
            this.stop = true;
           
            //initAll();
        }
    }
    
    
    this.speed = this.speedBase + Math.floor(this.speedScore/100);
    
};