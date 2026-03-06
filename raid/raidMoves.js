const Moves={

quick:{
name:"Quick Attack",

use(pokemon){

const base=Damage.pokemonBase(pokemon)

return Math.floor(
base*Damage.modifier()
)

}

},


team:{
name:"Team Attack",

use(pokemon){

const base=Damage.pokemonBase(pokemon)

const allies=team.filter(p=>p.alive && p!==pokemon)

if(allies.length===0){

return Math.floor(base*Damage.modifier())

}

const ally=
allies[Math.floor(Math.random()*allies.length)]

const allyBase=Damage.pokemonBase(ally)

return Math.floor(
(base+allyBase)*Damage.modifier()
)

}

},


critical:{
name:"Critical Star",

condition(pokemon){

return pokemon.hp<=pokemon.maxHP/2

},

use(pokemon){

const base=Damage.pokemonBase(pokemon)

return base*2

}

},


beatdown:{
name:"Beatdown Together",

use(pokemon){

const base=Damage.pokemonBase(pokemon)

const alive=team.filter(p=>p.alive).length

return base*alive

}

},


miracle:{
name:"Miracle Rush",

condition(){

return !usedMiracle

},

use(pokemon){

usedMiracle=true

const base=Damage.pokemonBase(pokemon)

return base+lastBossDamage

}

},


protect:{
name:"Protect",

use(){

protectActive=true

log("Team protected!")

return 0

}

},


helping:{
name:"Helping Hand",

use(){

doubleNextAttack=true

log("Next attack doubled!")

return 0

}

}

}