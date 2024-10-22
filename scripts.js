// ------------------------------
// DOM Elements
// ------------------------------
const palavraElement = document.getElementById('palavra');
const tentativasElement = document.getElementById('tentativas');
const chutePalavraInput = document.getElementById('chute-palavra');
const btnChutarPalavra = document.getElementById('btn-chutar-palavra');
const btnReiniciar = document.getElementById('btn-reiniciar');
const virtualKeyboard = document.getElementById('virtual-keyboard');

// Boneco Elements
const headElement = document.getElementById('head');
const bodyElement = document.getElementById('body');
const leftArmElement = document.getElementById('left-arm');
const rightArmElement = document.getElementById('right-arm');
const leftLegElement = document.getElementById('left-leg');
const rightLegElement = document.getElementById('right-leg');

// ------------------------------
// Game Variables
// ------------------------------
let palavraAtual = '';
let tentativasRestantes = 6;
let palavraExibida = [];
let jogoAtivo = true;
let placarVitorias = parseInt(sessionStorage.getItem('vitorias')) || 0;
let placaDerrotas = parseInt(sessionStorage.getItem('derrotas')) || 0;




// ------------------------------
// Game Functions
// ------------------------------

// Function to update score
function atualizarPlacar(recebePlacar) {
    debugger
    recebePlacar === 'V' ? placarVitorias++ : placaDerrotas++;
    document.getElementById('vitorias').innerText = placarVitorias;
    document.getElementById('derrotas').innerText = placaDerrotas;
    sessionStorage.setItem('vitorias', placarVitorias);
    sessionStorage.setItem('derrotas', placaDerrotas);
    console.log(`Vitórias: ${placarVitorias}, Derrotas: ${placaDerrotas}`);
}

// Initialize the game
function initGame() {
    configurarTecladoVirtual();
    atualizarPlacar();
    reiniciarJogo();
}


// Function to configure the virtual keyboard
function configurarTecladoVirtual() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.classList.add('button');
        btn.id = `tecla-${letra}`;
        btn.addEventListener('click', () => tentarLetra(letra, btn));
        virtualKeyboard.appendChild(btn);
    });
}

// Function to update the displayed word
function atualizarPalavra() {
    palavraElement.textContent = palavraExibida.join(' ');
}

// Function to process letter attempts
function tentarLetra(letra, btn) {
    if (!jogoAtivo) return;

    btn.disabled = true;
    btn.classList.add('tecla-correta');

    const tecla = document.getElementById(`tecla-${letra}`);
    tecla.disabled = true;

    if (palavraAtual.includes(letra)) {
        palavraAtual.split('').forEach((char, index) => {
            if (char === letra) {
                palavraExibida[index] = letra;
            }
        });
        tecla.classList.add('tecla-correta');
        atualizarPalavra();
        verificarVitoria();
    } else {
        tecla.classList.add('tecla-errada');
        tentativasRestantes--;
        mostrarParteDoBoneco();
        tentativasElement.textContent = tentativasRestantes;
        verificarDerrota();
    }
}

// ------------------------------
// Hangman Drawing
// ------------------------------
const boneco = [
    "O\n", // Head
    "/  ", // Left arm
    "M ", // Body
    "\\\n", // Right arm
    "/ ", // Left leg
    "\\", // Right leg with space to align it
];

// Function to show the part of the hangman corresponding to the number of errors
function mostrarParteDoBoneco() {
    const parte = 5 - tentativasRestantes;
    const containerBoneco = document.getElementById('stickmanDrawing');

    // Remove spaces for last character and add current part
    containerBoneco.textContent = containerBoneco.textContent.replace(/(?!\n)\s+/g, '') + boneco[parte];
}

// ------------------------------
// Game Over Checks
// ------------------------------
function verificarVitoria() {
    if (palavraExibida.join('') === palavraAtual) {
        alert('Parabéns, você venceu!');
        atualizarPlacar('V');
        jogoAtivo = false;
        disableKeyboard();
    }
}

function verificarDerrota() {
    if (tentativasRestantes === 0) {
        alert(`Você perdeu! A palavra era: ${palavraAtual}`);
        atualizarPlacar('D');
        jogoAtivo = false;
        disableKeyboard();
    }
}

// ------------------------------
// Keyboard Control
// ------------------------------
function resetKeyboard() {
    Array.from(document.getElementsByClassName('button')).forEach(button => {
        button.disabled = false; // Enable the button
        button.classList.remove('tecla-errada', 'tecla-correta');
    });
}

function disableKeyboard() {
    Array.from(document.getElementsByClassName('button')).forEach(button => {
        button.disabled = true; // Disable the button
    });
}

// ------------------------------
// Restart Game
// ------------------------------
function reiniciarJogo() {
    tentativasRestantes = 6;
    tentativasElement.textContent = tentativasRestantes;
    jogoAtivo = true;

    resetKeyboard();

    // Hide the stickman drawing
    document.getElementById('stickmanDrawing').textContent = '';

    sortearPokemon();
}

// ------------------------------
// Event Listeners
// ------------------------------
// Event for guessing the full word
btnChutarPalavra.addEventListener('click', () => {
    const chute = chutePalavraInput.value.toUpperCase();
    if (chute === palavraAtual) {
        alert('Parabéns, você venceu!');
        atualizarPlacar('V');
        jogoAtivo = false;
    } else {
        alert(`Você errou! A palavra era: ${palavraAtual}`);
        atualizarPlacar('D');
        jogoAtivo = false;
    }
});

// Event for restarting the game
btnReiniciar.addEventListener('click', reiniciarJogo);

// ------------------------------
// Initialize Game
// ------------------------------
initGame();

// ------------------------------
// Pokémon Functions
// ------------------------------
async function sortearPokemon() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=20&limit=200`);

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        const data = await response.json();
        const infos = data.results.map(item => ({ name: item.name, url: item.url }));
        const pokemon = infos[Math.floor(Math.random() * infos.length)];

        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();

        // Atualiza a imagem do Pokémon (se houver no seu HTML)
        const imgPokemon = document.querySelector('#pokeImg');
        imgPokemon.src = pokemonData.sprites.other["dream_world"].front_default;

        // Define o nome do Pokémon como a palavra
        palavraAtual = pokemon.name.toUpperCase();
        palavraExibida = Array(palavraAtual.length).fill('_');
        atualizarPalavra();  // Exibe a palavra com os underscores

        console.log(palavraAtual)
    } catch (error) {
        console.log(error);
    }
}

// Mostrar array com os pokemons
sortearPokemon().then((pokemon) => console.log(pokemon))

// Start Pokémon selection
reiniciarJogo();

function handleShow(item) {

}
