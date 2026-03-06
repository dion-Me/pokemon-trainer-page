let team=[]
let boss=null

let bossHP=0
let bossMaxHP=0

let currentIndex=0

let protectActive=false
let doubleNextAttack=false
let lastBossDamage=0
let usedMiracle=false

const UI={}


window.onload=loadRaid


function cacheUI(){

UI.bossName=document.getElementById("bossName")
UI.bossSprite=document.getElementById("bossSprite")
UI.bossHPFill=document.getElementById("bossHPFill")
UI.bossHPText=document.getElementById("bossHPText")

UI.battleLog=document.getElementById("battleLog")
UI.teamContainer=document.getElementById("raidTeam")

}



async function loadRaid(){

cacheUI()

await loadTeam()

sortTeamBySpeed()

renderTeam()

renderMoves()

generateBoss()

updateBossHP()

showBossIntro()

}



/* TEAM */

async function loadTeam(){

const savedTeam=localStorage.getItem("pokemonTeam")

if(!savedTeam){

alert("No team found!")
window.location.href = "../index.html"

return
}

const rawTeam=JSON.parse(savedTeam)

team=[]

for(let p of rawTeam){

const res=await fetch(
"https://pokeapi.co/api/v2/pokemon/"+p.name
)

const data=await res.json()

team.push({

name:p.name,
sprite:p.sprite || data.sprites.front_default,

hp:data.stats[0].base_stat,
maxHP:data.stats[0].base_stat,

atk:data.stats[1].base_stat,
satk:data.stats[3].base_stat,

speed:data.stats[5].base_stat,

alive:true

})

}

}

function renderMoves(){

const menu=document.getElementById("attackMenu")

menu.innerHTML=""

const pokemon=team[currentIndex]

for(let id in Moves){

const move=Moves[id]

const btn=document.createElement("button")

btn.innerText=move.name

let usable=true

if(move.condition){

usable=move.condition(pokemon)

}

if(!usable){

btn.disabled=true

}else{

btn.onclick=()=>chooseMove(id)

}

menu.appendChild(btn)

}

}


function sortTeamBySpeed(){

team.sort((a,b)=>b.speed-a.speed)

}



/* BOSS */

function generateBoss(){

boss=getRandomBoss()

bossMaxHP=boss.hp
bossHP=boss.hp

UI.bossName.innerText=boss.name
UI.bossSprite.src=boss.sprite

}


function showBossIntro(){

const intro=document.createElement("div")

intro.className="boss-intro"

intro.innerHTML=`

<h1>RAID BOSS APPEARED</h1>

<h2>${boss.name}</h2>

<p class="boss-quote">
"${boss.quote}"
</p>

<img src="${boss.sprite}">

`

document.body.appendChild(intro)

setTimeout(()=>{

intro.remove()

startTurn()

},2000)

}



/* TEAM RENDER */

function renderTeam(){

UI.teamContainer.innerHTML=""

team.forEach((pokemon,index)=>{

const card=document.createElement("div")

card.className="raid-pokemon"

card.innerHTML=`

<img src="${pokemon.sprite}" id="pokemon-${index}">

<div class="hp-bar">
<div id="hp-fill-${index}" class="hp-fill"></div>
</div>

<p id="hp-text-${index}">
${pokemon.hp} HP
</p>

`

UI.teamContainer.appendChild(card)

})

}



/* HP */

function updateBossHP(){

const percent=Math.max(0,(bossHP/bossMaxHP)*100)

UI.bossHPFill.style.width=percent+"%"

UI.bossHPText.innerText=
"HP: "+bossHP+" / "+bossMaxHP

}


function updatePokemonHP(index){

const pokemon=team[index]

const percent=Math.max(0,(pokemon.hp/pokemon.maxHP)*100)

document.getElementById("hp-fill-"+index)
.style.width=percent+"%"

document.getElementById("hp-text-"+index)
.innerText=pokemon.hp+" HP"

}



/* TURN */

function startTurn(){

if(currentIndex>=team.length){

loseRaid()
return

}

const pokemon=team[currentIndex]

if(!pokemon.alive){

nextPokemon()
return

}

highlightActivePokemon()

renderMoves()

log("What will "+pokemon.name+" do?")

}


function chooseMove(id){

disableAttacks()

const move=Moves[id]

const pokemon=team[currentIndex]

let damage=move.use(pokemon)

if(doubleNextAttack){

damage*=2
doubleNextAttack=false

}

bossHP-=damage

showDamage(damage)

log(pokemon.name+" used "+move.name)

animateBossHit()

if(bossHP<=0){

bossHP=0
updateBossHP()

winRaid()

return
}

updateBossHP()

setTimeout(bossTurn,600)

}


function bossTurn(){

BossAI.takeTurn()

nextPokemon()

}


function nextPokemon(){

currentIndex++

startTurn()

}



/* DAMAGE */

function damagePokemon(pokemon,damage){

if(protectActive){

damage=Math.floor(damage/2)
protectActive=false

}

pokemon.hp-=damage

lastBossDamage=damage

if(pokemon.hp<=0){

pokemon.hp=0
pokemon.alive=false

}

updatePokemonHP(team.indexOf(pokemon))

}


function damageRandomPokemon(damage){

const alive=team.filter(p=>p.alive)

if(alive.length===0) return

const target=
alive[Math.floor(Math.random()*alive.length)]

damagePokemon(target,damage)

}



/* UI */

function highlightActivePokemon(){

team.forEach((p,index)=>{

const el=document.getElementById("pokemon-"+index)

if(el) el.classList.remove("active-pokemon")

})

const el=document.getElementById("pokemon-"+currentIndex)

if(el) el.classList.add("active-pokemon")

}


function animateBossHit(){

UI.bossSprite.classList.add("hit")

setTimeout(()=>{
UI.bossSprite.classList.remove("hit")
},300)

}


function showDamage(number){

const rect=UI.bossSprite.getBoundingClientRect()

const popup=document.createElement("div")

popup.className="damage-popup"

popup.innerText="-"+number

popup.style.left=rect.left+rect.width/2+"px"
popup.style.top=rect.top+"px"

document.body.appendChild(popup)

setTimeout(()=>popup.remove(),800)

}



/* LOG */

function log(text){

const entry=document.createElement("div")

entry.className="log-entry"

entry.textContent=text

UI.battleLog.appendChild(entry)

UI.battleLog.scrollTop=UI.battleLog.scrollHeight

}



/* BUTTON */

function disableAttacks(){

document.querySelectorAll(".attack-menu button")
.forEach(b=>b.disabled=true)

}

function enableAttacks(){

document.querySelectorAll(".attack-menu button")
.forEach(b=>b.disabled=false)

}



/* RESULT */

function showResult(win){

const popup=document.createElement("div")

popup.className="result-popup"

popup.innerHTML=`

<div class="result-box">

<img src="${
win
? 'assets/raid-success.gif'
: 'assets/raid-fail.png'
}">

<h2>${
win
? "Raid Cleared!"
: "Raid Failed!"
}</h2>

<button onclick="window.location.href='../index.html'">
Return
</button>

</div>

`

document.body.appendChild(popup)

}


function winRaid(){

log("Raid Boss Defeated!")

disableAttacks()

setTimeout(()=>{

showResult(true)

},1200)

}


function loseRaid(){

log("All your Pokémon fainted!")

disableAttacks()

setTimeout(()=>{

showResult(false)

},1200)

}