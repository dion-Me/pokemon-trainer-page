let pokemonList = []

async function loadPokemonList(){
	/*
	const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000")
	*/
	const res = await fetch("https://pokeapi.co/api/v2/pokemon-form?limit=2000")
	
	const data = await res.json()
	pokemonList = data.results.map(p => p.name)
}

window.addEventListener("DOMContentLoaded", loadPokemonList)

const searchInput = document.getElementById("searchInput")
	searchInput.addEventListener("input", function(){
	const value = searchInput.value.toLowerCase().trim()

	showSuggestions(value)

})

function showSuggestions(input){

	const list = document.getElementById("autocompleteList")

	list.innerHTML = ""
	if(input.length === 0) return

	const matches = pokemonList.filter(p => p.toLowerCase().includes(input)).slice(0,10)

	matches.forEach(name => {
		const item = document.createElement("div")
		item.classList.add("autocomplete-item")
		item.textContent = name
		item.onclick = function(){
			searchInput.value = name
			list.innerHTML = ""

			searchPokemon()
		}

	list.appendChild(item)
	})
}

document.addEventListener("click", function(e){

const list = document.getElementById("autocompleteList")
const input = document.getElementById("searchInput")

if(!list.contains(e.target) && e.target !== input){
	list.innerHTML = ""
}

})