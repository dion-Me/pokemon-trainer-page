const Damage={

modifier(){

return Math.random()*1.5+0.5
// 0.5 - 2.0

},

pokemonBase(pokemon){

return Math.max(pokemon.atk,pokemon.satk)

},

bossAttack(base){

return Math.floor(
base*Damage.modifier()
)

}

}