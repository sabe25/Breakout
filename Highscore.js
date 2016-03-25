
var Highscore = {}

Highscore = function(){
    this.ranks;
    this.displayText;
    this.upButton;
    this.downButton;
    this.isRanking;
    this.txtRanking;
    this.bakButton;
};



Highscore.prototype = {
        
      down : function(){
          this.displayText.y++;
      },
      up : function(){
          this.displayText.y--;
      },
      back : function(){
          game.state.start('Menu');
      }
        
}
Highscore.prototype.preload = function() {
     this.isRanking = false;
     //this.ranks = JSON.parse(this.txtContent);
     game.load.spritesheet('btnArrow', 'img/ArrowButton.png', 60, 60);
     game.load.spritesheet('btnBack', 'img/BackButton.png', 120, 40);
};
    
Highscore.prototype.create = function () {
    this.displayText = game.add.text(game.world.width/2,60,"", { font: '24px Arial', fill: '#0095DD' });
    this.displayText.anchor.set(0.5,0);
    
    this.txtRanking = game.add.text(30,30,"Ranking", { font: '28px Arial', fill: '#0095DD' });
    
    this.backButton = game.add.button(30, 70, 'btnBack', this.back, this, 1, 0, 2);
    
    
    this.upButton = game.add.button(game.world.width-60, 60, 'btnArrow', this.up, this, 1, 0, 2);
    this.upButton.anchor.set(0.5);
    this.upButton.angle = 90;
    
    this.downButton = game.add.button(game.world.width-60, game.world.height-60, 'btnArrow', this.down, this, 1, 0, 2);
    this.downButton.anchor.set(0.5);
    this.downButton.angle = 270;
};
    
Highscore.prototype.update = function () {
  
  if(highscoreJson != "" && !this.isRanking){
    this.ranks = JSON.parse(highscoreJson);
    for(var i = 0; i < this.ranks.ranking.length ;i++){
        this.displayText.text += (i+1)+". " + this.ranks.ranking[i][0] + " - " +this.ranks.ranking[i][1] + "\n" ;
    }
    this.isRanking = true;
  }
};
