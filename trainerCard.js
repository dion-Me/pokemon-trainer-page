function saveTrainerCard(){

const canvas = document.createElement("canvas")
canvas.width = 1400
canvas.height = 760

const ctx = canvas.getContext("2d")

/* BACKGROUND */

const bg = new Image()
bg.src = "assets/placeholder.jpg"

bg.onload = function(){

ctx.drawImage(bg,0,0,canvas.width,canvas.height)

/* soften background */

ctx.fillStyle = "rgba(255,255,255,0.85)"
ctx.fillRect(0,0,canvas.width,canvas.height)

/* TITLE */

ctx.fillStyle = "#222"
ctx.font = "bold 60px Segoe UI"

const name = document.getElementById("trainerName").value

ctx.fillText("Trainer: " + name,80,100)

/* TRAINER PHOTO */

const img = new Image()
img.src = document.getElementById("trainerPhoto").src

img.onload = function(){

const x = 80
const y = 150
const w = 420
const h = 420

ctx.save()

ctx.beginPath()
ctx.roundRect(x,y,w,h,40)
ctx.clip()

/* COVER FIT (no stretch) */

const scale = Math.max(w / img.width, h / img.height)

const newWidth = img.width * scale
const newHeight = img.height * scale

const offsetX = x + (w - newWidth) / 2
const offsetY = y + (h - newHeight) / 2

ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight)

ctx.restore()

/* DESCRIPTION */

const desc =
document.getElementById("trainerDesc").value

ctx.fillStyle = "#333"
ctx.font = "28px Segoe UI"

wrapText(ctx,desc,80,620,420,36)

/* TEAM TITLE */

ctx.fillStyle = "#222"
ctx.font = "bold 48px Segoe UI"

ctx.fillText("Team",650,160)

/* DRAW TEAM */

let loaded = 0

if(team.length === 0){
download(canvas)
return
}

team.forEach((pokemon,index)=>{

const pImg = new Image()

pImg.crossOrigin = "anonymous"
pImg.src = pokemon.sprite

pImg.onload = function(){

/* grid lebih besar */

const spacingX = 260
const spacingY = 240

const px = 650 + (index % 3) * spacingX
const py = 220 + Math.floor(index / 3) * spacingY

/* circle background */

ctx.beginPath()
ctx.arc(px+75,py+75,85,0,Math.PI*2)
ctx.fillStyle = "white"
ctx.fill()

/* pokemon sprite lebih besar */

ctx.drawImage(pImg,px+10,py+10,130,130)

/* pokemon name */

ctx.fillStyle = "#333"
ctx.font = "26px Segoe UI"
ctx.textAlign = "center"

ctx.fillText(pokemon.name,px+75,py+175)

loaded++

if(loaded === team.length){
download(canvas)
}

}

})

}

}

/* DOWNLOAD */

function download(canvas){

const link = document.createElement("a")

link.download = "trainer-card.png"

link.href = canvas.toDataURL()

link.click()

}

/* WORD WRAP */

function wrapText(ctx,text,x,y,maxWidth,lineHeight){

const words = text.split(" ")
let line = ""

for(let n=0;n<words.length;n++){

const testLine = line + words[n] + " "
const metrics = ctx.measureText(testLine)

if(metrics.width > maxWidth && n > 0){

ctx.fillText(line,x,y)
line = words[n] + " "
y += lineHeight

}else{

line = testLine

}

}

ctx.fillText(line,x,y)

}}