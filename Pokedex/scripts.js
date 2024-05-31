function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value;
    fetch(`/pokemons?name=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const pokemonList = document.getElementById('pokemonList');
            pokemonList.innerHTML = '';
            data.forEach(pokemon => {
                const div = document.createElement('div');
                div.classList.add('pokemon-item');
                div.innerHTML = `
                    <span>${pokemon.name} - ${pokemon.type}</span>
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                    <button onclick="deletePokemon(${pokemon.id})">Eliminar</button>
                `;
                pokemonList.appendChild(div);
            });
        });
}

function addPokemon() {
    const nameInput = document.getElementById('nameInput').value;
    const typeInput = document.getElementById('typeInput').value;
    const imageInput = document.getElementById('imageInput').files[0];
    const formData = new FormData();
    formData.append('name', nameInput);
    formData.append('type', typeInput);
    formData.append('image', imageInput);

    fetch('/pokemons', {
        method: 'POST',
        body: formData
    }).then(response => response.text())
    .then(data => {
        alert(data);
        searchPokemon();
    });
}

function deletePokemon(id) {
    fetch(`/pokemons/${id}`, {
        method: 'DELETE'
    }).then(response => response.text())
    .then(data => {
        alert(data);
        searchPokemon();
    });
}


