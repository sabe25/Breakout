
var Menu = {}

Menu = function(){
    this.startButton;
    this.HighscoreButton;
};



Menu.prototype = {
        gotoBase : function(){
            game.state.start('BasicGame');
        },
        gotoHighscore :function(){
            game.state.start('Highscore');
        }
      
        
}
Menu.prototype.preload = function() {
    readHighscore();
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.spritesheet('btnGame', 'img/GameButton.png', 120, 40);
    game.load.spritesheet('btnHighscore', 'img/HighscoreButton.png', 120, 40);
};
    
Menu.prototype.create = function () {
    this.startButton = game.add.button(game.world.width*0.5, game.world.height*0.25, 'btnGame', this.gotoBase, this, 1, 0, 2);
    this.startButton.anchor.set(0.5);
    
    /*this.HighscoreButton = game.add.button(game.world.width*0.5, game.world.height*0.75, 'btnHighscore', this.gotoHighscore, this, 1, 0, 2);
    this.HighscoreButton.anchor.set(0.5);*/
};
    
Menu.prototype.update = function () {
  
};
