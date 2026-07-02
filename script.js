const URL = "./my_model/";

let model, webcam, ctx;

const songs = [

new Audio("music/song1.mp3"),
new Audio("music/song2.mp3"),
new Audio("music/song3.mp3")

];

let currentSong=null;
let isSmiling=false;

async function init(){

const modelURL=URL+"model.json";
const metadataURL=URL+"metadata.json";

model=await tmPose.load(modelURL,metadataURL);

const size=350;

webcam=new tmPose.Webcam(size,size,true);

await webcam.setup();

await webcam.play();

window.requestAnimationFrame(loop);

const canvas=document.getElementById("canvas");

canvas.width=size;
canvas.height=size;

ctx=canvas.getContext("2d");

}

async function loop(){

webcam.update();

await predict();

window.requestAnimationFrame(loop);

}

async function predict(){

const {pose,posenetOutput}=await model.estimatePose(webcam.canvas);

const prediction=await model.predict(posenetOutput);

ctx.drawImage(webcam.canvas,0,0);

if(pose){

tmPose.drawSkeleton(pose.keypoints,0.5,ctx);

tmPose.drawKeypoints(pose.keypoints,0.5,ctx);

}

let smileProbability=0;
let neutralProbability=0;

prediction.forEach(p=>{

if(p.className=="Smile")
smileProbability=p.probability;

if(p.className=="Neutral")
neutralProbability=p.probability;

});

document.getElementById("status").innerHTML=
"😊 Smile: "+smileProbability.toFixed(2);

if(smileProbability>0.95){

if(!isSmiling){

playRandomSong();

isSmiling=true;

}

}else{

if(isSmiling){

stopSong();

isSmiling=false;

}

}

}

function playRandomSong(){

stopSong();

const random=Math.floor(Math.random()*songs.length);

currentSong=songs[random];

currentSong.loop=false;

currentSong.play();

}

function stopSong(){

if(currentSong){

currentSong.pause();

currentSong.currentTime=0;

}

}
