import HBInit from "haxball.js";

const room = HBInit({
  roomName: "7/24 BOT ODA",
  maxPlayers: 16,
  public: true,
  noPlayer: false,
  playerName: "BOT",
  token: process.env.TOKEN
});

room.setDefaultStadium("Big");
room.setScoreLimit(5);
room.setTimeLimit(0);

let botId = 0;
let gameStarted = false;

room.onPlayerJoin = function(player){

  botId = room.getPlayerList()[0].id;

  if(player.id != botId){
    room.setPlayerTeam(player.id,2);
  }

  room.setPlayerTeam(botId,1);

  if(!gameStarted){
    gameStarted=true;
    setTimeout(()=>room.startGame(),2000);
  }
};

room.onPlayerChat = function(player,msg){
  if(msg=="admin"){
    room.setPlayerAdmin(player.id,true);
    return false;
  }
  return true;
};

function dist(a,b){
  let dx=a.x-b.x;
  let dy=a.y-b.y;
  return Math.sqrt(dx*dx+dy*dy);
}

room.onGameTick = function(){

  let bot = room.getPlayerDiscProperties(botId);
  if(!bot) return;

  let ball = room.getBallPosition();
  if(!ball) return;

  let xs=0, ys=0;
  let d = dist(bot,ball);

  if(d>25){
    xs = Math.sign(ball.x-bot.x)*0.5;
    ys = Math.sign(ball.y-bot.y)*0.5;
  }

  room.setPlayerDiscProperties(botId,{
    xspeed:xs,
    yspeed:ys
  });

  if(d<20){
    room.kickBall(botId);
  }
};
