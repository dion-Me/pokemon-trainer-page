let team = []
let shinyMode = false

async function searchPokemon(name){
	if(!name){
	name = document.getElementById("searchInput").value.toLowerCase()
	}
	console.log(name)
	const response = await fetch("https://pokeapi.co/api/v2/pokemon/"+name)
	
	const baseName = name.split("-")[0]
	const responseSpecies = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + baseName)
	const data = await response.json()
	const speciesData = await responseSpecies.json()
	
	displayPokemon(data, speciesData)
}


function displayPokemon(pokemon, speciesPokemon){
	const card = document.getElementById("pokemonCard")
	const type = pokemon.types.map(t => t.type.name).join(" / ")
	const hp = pokemon.stats[0].base_stat
	const attack = pokemon.stats[1].base_stat
	const defense = pokemon.stats[2].base_stat
	const spAtk = pokemon.stats[3].base_stat
	const spDef = pokemon.stats[4].base_stat
	const speed = pokemon.stats[5].base_stat
	const typeBadges = pokemon.types
	.map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
	.join("")
	const pokedex = speciesPokemon.flavor_text_entries.find(e => e.language.name === "en")
	const pokedexEntry = pokedex.flavor_text
		.replace(/\f/g, " ")
		.replace(/\n/g, " ")
	
	card.innerHTML = `
	<div class="pokemon-card">
		<h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
		
		<div class="sprite-container">
			<label class="shiny-toggle">
				<input type="checkbox" onchange="toggleShiny()">
				✨
			</label>
			
			<img id="pokemonSprite" 
			src = "${pokemon.sprites.front_default}"
			data-normal = "${pokemon.sprites.front_default}"
			data-shiny = "${pokemon.sprites.front_shiny}"
			>
		</div>
		
		<p> ${pokedexEntry} </p>
		<p class="pokemon-type">${typeBadges}</p>
		
		<div class="stats-grid">
			<div class="stats-col">
				<p> HP : ${hp}</p>
				<p> Attack : ${attack}</p>
				<p> Defense : ${defense}</p>
			</div>
			<div class="stats-col">
				<p> Sp. Atk : ${spAtk}</p>
				<p> Sp. Def : ${spDef}</p>
				<p> Speed : ${speed}</p>
			</div>
		</div>
		
		<button onclick="addCurrentPokemon('${pokemon.name}')">
		Add to Team
		</button>
	</div>
	`
}

function toggleShiny(){
	shinyMode = !shinyMode
	const sprite = document.getElementById("pokemonSprite")
	
	if(!sprite) return
	
	const normal = sprite.dataset.normal
	const shiny = sprite.dataset.shiny
	
	sprite.src = shinyMode && shiny ? shiny : normal
}

function addCurrentPokemon(name){

const sprite = document.getElementById("pokemonSprite")

if(!sprite) return

addToTeam(name, sprite.src)

}

function addToTeam(name, sprite){
	if(team.length >= 6) {
		alert("Team already full")
		return
	}	
	
	team.push({name:name, sprite:sprite})
	
	saveTeam()
	renderTeam()
}

function removePokemon(index){
	team.splice(index,1)
	
	saveTeam()
	renderTeam()
}

function loadTeam(){
	const savedTeam = localStorage.getItem("pokemonTeam")
	
	if(!savedTeam) return
	
	team = JSON.parse(savedTeam)
	
	renderTeam()
}

document.querySelector(".trainer-photo-container").addEventListener("click", function(){
	document.getElementById("photoUpload").click()
}
)

document.getElementById("photoUpload").addEventListener("change", function(){
	const file = this.files[0]
	
	if(file){
		const reader = new FileReader()
		reader.onload = function(e){
			const img = document.getElementById("trainerPhoto")
			img.src = e.target.result
			img.style.display = "block"
			
			document.querySelector(".trainer-placeholder").style.display = "none"
		}
		reader.readAsDataURL(file)
	}
}
)

function saveTrainer(){

	const trainer = {
		name: document.getElementById("trainerName").value,
		desc: document.getElementById("trainerDesc").value,
		photo: document.getElementById("trainerPhoto").src
	}

	localStorage.setItem(
		"trainerData",
		JSON.stringify(trainer)
	)

	saveTeam()

	/*const raidChance = Math.random()*/
	const raidChance = 0

	console.log("Raid chance:", raidChance)

	if(raidChance < 0.3){

		alert("⚠ A Raid Boss has appeared nearby!")

		window.location.href = "./raid/raid.html"

	}else{

		alert("Trainer saved!")

	}

}

function saveTeam(){
	localStorage.setItem("pokemonTeam", JSON.stringify(team))
}

function renderTeam(){
	const slots = document.querySelectorAll(".team-slot")
	
	slots.forEach((slot, index)=>{
		if(team[index]) {
			slot.innerHTML = `
				<img src="${team[index].sprite}" width="70">
				<div>${team[index].name}</div>
				<small>click to remove</small>
			`
			slot.onclick = () => removePokemon(index)
		} else {
			slot.innerHTML = "Empty"
			slot.onclick = null
		}
	})
	console.log(team)
}

function loadTrainer(){
	const data = localStorage.getItem("trainerData")
	if (!data) return
	
	const trainer = JSON.parse(data)
	
	document.getElementById("trainerName").value =
	trainer.name

	document.getElementById("trainerDesc").value =
	trainer.desc

	document.getElementById("trainerPhoto").src =
	trainer.photo
	
}

loadTeam()
loadTrainer()