
var BasicGame = {}

BasicGame = function(){
    
    this.levelinfo = LevelInfo[0];
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
    this.brickSize = {
          width:0,
          height:0,
          marginleft:(50 + this.levelinfo.padding/2),
          margintop:(30 +this.levelinfo.padding/2),
          padding:0
        };
        this.SpeedText;
    this.debug = false;
    this.pauseText;
    this.ballspeedX;
    this.ballspeedY;
    this.pause;
};



BasicGame.prototype = {
        
    reset : function(){
            
        this.score = 0;
        this.lives = 3;
        this.levelinfo = LevelInfo[0];
        this.level = 1;
        this.brickSize = {
          width:0,
          height:0,
          marginleft:(50 + this.levelinfo.padding/2),
          margintop:(30 +this.levelinfo.padding/2),
          padding:0
        };
        this.speedBase =game.world.height/74;
        this.speedIncrease = this.speedBase*0.2;
        this.speed = this.speedBase;
        this.speedScore = 0;
        this.pause = false;
    },
        
        
    startGame : function (){
        this.startButton.destroy();
        this.stop = false;
        this.ball.body.velocity.set(0, -30 * this.speed);
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
            
            if(this.combo >3) this.speedScore += 10;
            this.comboText.text = "Combo: " + this.combo;
            this.scoreText.text = "Score: " + this.score;
            
        }
        else{
            /*var bitmap = brick.key; 
            bitmap.rect(0,0,this.brickSize.width,this.brickSize.height,"hsl(210,90%,"+(90 - brick.stat*8 )+"%)" );
            */
            //brick.key.rect(0,0,this.brickSize.width,this.brickSize.height,"hsl(210,90%,"+(90 - brick.stat*8 )+"%)" );
            var bitmap = new Phaser.BitmapData(game,'brick',this.brickSize.width,this.brickSize.height);
            bitmap.rect(0,0,this.brickSize.width,this.brickSize.height,"hsl("+this.levelinfo.color+",90%,"+(90 - brick.stat*10 )+"%)" );
            
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
    /*handleRemoteImagesOnJSFiddle : function () {
    	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
    	game.load.crossOrigin = 'anonymous';
    },*/
    initBricks : function () {
        this.bricks.removeAll(true);
        //this.bricks = game.add.group();
        var matrix = {
            col : this.levelinfo.matrix[0].length,
            row:this.levelinfo.matrix.length
        };
        
        this.brickSize.padding = game.world.width*0.021*this.levelinfo.padding/10;
        this.brickSize.marginleft=(game.world.width*0.106 + this.brickSize.padding/2);
        this.brickSize.margintop=(game.world.width*0.064 +this.brickSize.padding/2);
        
        this.brickSize.width = (game.world.width-(2*this.brickSize.marginleft))/matrix.col - this.brickSize.padding;
        this.brickSize.height = this.brickSize.width * 0.4;
        
        
        
        
        
        for(var r=0; r<matrix.row; r++) {
            for( var c=0; c<matrix.col; c++) {
                if(this.levelinfo.matrix[r][c] !=0){
                    var brickX = (c*(this.brickSize.width+this.brickSize.padding))+this.brickSize.marginleft;
                    var brickY = (r*(this.brickSize.height+this.brickSize.padding))+this.brickSize.margintop;
                    var bitmap = new Phaser.BitmapData(game,'brick',this.brickSize.width,this.brickSize.height);
                    bitmap.rect(0,0,this.brickSize.width,this.brickSize.height,
                        "hsl("+this.levelinfo.color+",90%,"+(90 - this.levelinfo.matrix[r][c]*10 )+"%)" );
                    
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
	//this.handleRemoteImagesOnJSFiddle();
   this.reset();
   var ballsize = game.world.width*0.038
   var ballsize2 = ballsize/2;
    var ball = game.add.bitmapData(ballsize,ballsize);
    ball.circle(ballsize2,ballsize2,ballsize2,'#0095DD');
    game.cache.addBitmapData('ball', ball);   
    //game.load.image('ball', 'img/ball.png');
    
    var paddle = game.add.bitmapData(game.world.width*0.15,10);
    paddle.rect(0,0,game.world.width*0.15,10,'#0095DD');
    game.cache.addBitmapData('paddle', paddle);   
    //game.load.image('paddle', 'img/paddle.png');
    //game.load.image('brick', 'img/brick.png');
    game.load.spritesheet('btnStart', 'img/StartButton.png', 120, 40);
   
    
};
    
BasicGame.prototype.create = function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    this.ball = game.add.sprite(game.world.width*0.5, game.world.height-25, game.cache.getBitmapData('ball'));
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
                 this.ball.body.velocity.set(0, -30 * this.speed);
           },this);
       }
       
       this.stop = true;
       this.liveText.text = "Lifes: " + this.lives;
       
    }, this);
    
    
    this.emitter = game.add.emitter(0, 0, 1000);
    
    var bitmap = new Phaser.BitmapData(game, 'pad', 5, 5);
    
    bitmap.rect(0,0,5,5,"hsl("+this.levelinfo.color+",90%,80%)");
    
    
    this.emitter.makeParticles(bitmap);
    this.emitter.gravity = 200;
    this.emitter.pysicsBodyType = Phaser.Physics.ARCADE;
    this.emitter.bounce.set(0.7);
    
    this.paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, game.cache.getBitmapData('paddle'));
    this.paddle.anchor.set(0.5,1);
    game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.immovable = true;
    
    this.startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'btnStart', this.startGame, this, 1, 0, 2);
    this.startButton.anchor.set(0.5);
    
    this.scoreText = game.add.text(5,5,"Score: " + this.score, { font: '18px Arial', fill: '#0095DD' });
    this.liveText = game.add.text(game.world.width-5,5,"Lifes: " + this.lives, { font: '18px Arial', fill: '#0095DD' });
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
    this.SpeedText = game.add.text(game.world.width-5,game.world.height-5,"Speed: " + this.speedBase + 
            "\nSpeedIncrease: " + this.speedIncrease + "\nSpeedScore: " + this.speedScore, { font: '18px Arial', fill: '#0095DD' });
    this.SpeedText.anchor.set(1,1);
    this.SpeedText.visible =false;
    
    this.winText = game.add.text(game.world.width*0.5,game.world.height*0.5,
                    "OH my God!! You did it :D\nWanna play again?", { font: '18px Arial', fill: '#0095DD' });
    this.winText.anchor.set(0.5);
    this.winText.visible =false;
    
    
    
    
    this.bricks = game.add.group();
    this.initBricks();
    
    var debugKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
     debugKey.onDown.add(function(){
         this.debug = !this.debug;
         this.SpeedText.visible = !this.SpeedText.visible;
     },this);
     
     this.pauseText = game.add.text(game.world.width/2,game.world.height/2,"Pause", { font: '18px Arial', fill: '#0095DD' });
    this.pauseText.anchor.set(0.5);
    this.pauseText.visible = false;
     var pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
     pauseKey.onDown.add(function(){
         if(!this.stop){
             this.pause = !this.pause;
             if(this.pause){
                 this.ball.body.velocity.set(0, 0);
                 this.pauseText.visible = true;
             }
             else{
                this.ball.body.velocity.x = this.ballspeedX;
                this.ball.body.velocity.y = this.ballspeedY;
                this.pauseText.visible = false;
             }
         }
     },this);
     
     this.ballspeedY = -30 * this.speed;
     this.ballspeedX = 0;
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
            /*this.game.input.onDown.addOnce(function(){
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
            },this);*/
            alert("You beat all Level!! :D Score: " + this.score);
            game.state.start('Menu');
            /*$("#hsPopUp").show();
            $("#txtscore").text(this.score);*/
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
                var parts = new Phaser.BitmapData(game, 'pad', 5, 5);
    
                parts.rect(0,0,5,5,"hsl("+this.levelinfo.color+",90%,80%)");
                this.emitter.forEach (function(particle,parts){particle.key = parts; particle.loadTexture(parts,0);}, this,false,parts);
                this.speedBase += 0.5;
                this.stop = false;
                this.nextLvlText.visible = false;
                this.ball.body.velocity.set(0, -30 * this.speed);
            },this);
        }
            
    }
    if(this.combo <2)this.comboText.visible =false;
    if(this.combo == 2)this.comboText.visible =true;
    if(!this.stop && !this.pause){
        this.paddle.x = game.input.x - (isMobile?100:0) || game.world.width*0.5;
        this.ballspeedX = this.ball.body.velocity.x;
        this.ballspeedY = this.ball.body.velocity.y;
        
    }
    
    if(this.lives == 0){
            alert('Game over! Score:' + this.score);
            //document.body.innerHTML = "";
            this.stop = true;
            game.state.start('Menu');
            /*$("#hsPopUp").show();
            $("#txtscore").text(this.score);*/
            //initAll();
        }
    this.speed =  Math.floor(this.speedBase +this.speedScore/100*this.speedIncrease);
    if(this.debug){
        this.SpeedText.text = "Speed: " + this.speed+ "\nSpeedBase: " + this.speedBase + 
            "\nSpeedIncrease: " + this.speedIncrease + "\nSpeedScore: " + this.speedScore +
            "\nSpeedDirection: " + this.ballspeedX + " " + this.ballspeedY;
    }
};
