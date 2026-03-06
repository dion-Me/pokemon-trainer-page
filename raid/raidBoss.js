const BossList=[

{
name:"Revenger",
sprite:"assets/boss-revenger.png",
hp:750,
baseAtk:25,
spawnChance:60,
quote:"one bleed, so do other",
ability:"revenge"
},

{
name:"Poison Dragon",
sprite:"assets/boss-poison-dragon.png",
hp:1000,
baseAtk:50,
spawnChance:30,
quote:"i was a king, but this curse left me alone",
ability:"poison"
},

{
name:"Laughing Face",
sprite:"assets/boss-laughing-face.png",
hp:1200,
baseAtk:75,
spawnChance:10,
quote:"badut ya badut aja",
ability:"fate"
}

]


function getRandomBoss(){

const roll=Math.random()*100

let cumulative=0

for(let b of BossList){

cumulative+=b.spawnChance

if(roll<cumulative){

return {...b}

}

}

return {...BossList[0]}

}



const BossAI={

takeTurn(){

if(Math.random()<0.3){

if(this.useAbility()) return

}

this.normalAttack()

},


normalAttack(){

if(Math.random()<0.3){

this.swipeAttack()

}else{

this.singleAttack()

}

},


singleAttack(){

const alive=team.filter(p=>p.alive)

if(alive.length===0) return

const target=
alive[Math.floor(Math.random()*alive.length)]

const dmg=
Damage.bossAttack(boss.baseAtk)

damagePokemon(target,dmg)

log(boss.name+" attacked "+target.name)

},


swipeAttack(){

log(boss.name+" used Swipe Attack!")

team.forEach(p=>{

if(!p.alive) return

const dmg=
Damage.bossAttack(boss.baseAtk*0.7)

damagePokemon(p,dmg)

})

},


useAbility(){

if(boss.ability==="revenge"){

const lost=bossMaxHP-bossHP

const dmg=Math.floor(
(boss.baseAtk+lost)*Damage.modifier()
)

log("Revenger used Revenge!")

damageRandomPokemon(dmg)

return true

}


if(boss.ability==="poison"){

log("Poison Breath!")

team.forEach(p=>{

if(!p.alive) return

p.hp=Math.floor(p.hp*0.5)

updatePokemonHP(team.indexOf(p))

})

return true

}


if(boss.ability==="fate"){

log("Fate Circus!")

const alive=team.filter(p=>p.alive)

if(alive.length===0) return true

const target=
alive[Math.floor(Math.random()*alive.length)]

target.hp=0
target.alive=false

updatePokemonHP(team.indexOf(target))

return true

}

return false

}

}