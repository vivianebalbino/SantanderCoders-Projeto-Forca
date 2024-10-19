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

// ------------------------------
// Scores
// ------------------------------
let vitorias = 0;
let derrotas = 0;

// ------------------------------
// Game Configuration
// ------------------------------
const palavrasForca = [
    { palavra: "JAVASCRIPT", dica: "Linguagem de Programação", tema: "Tecnologia" },
    { palavra: "ELEFANTE", dica: "Maior animal terrestre", tema: "Animais" },
    { palavra: "BRASIL", dica: "País da América do Sul", tema: "Geografia" },
    { palavra: "PIZZA", dica: "Comida italiana popular", tema: "Alimentação" },
    { palavra: "VULCAO", dica: "Fenômeno natural explosivo", tema: "Natureza" }
];

// ------------------------------
// Game Functions
// ------------------------------

// Initialize the game
function initGame() {
    configurarTecladoVirtual();
    atualizarPlacar();
    reiniciarJogo();
}

// Function to update score
function atualizarPlacar() {
    localStorage.setItem('vitorias', vitorias);
    localStorage.setItem('derrotas', derrotas);
    console.log(`Vitórias: ${vitorias}, Derrotas: ${derrotas}`);
}

// Function to choose a random word
function escolherPalavraAleatoria() {
    const palavraObj = palavrasForca[Math.floor(Math.random() * palavrasForca.length)];
    palavraAtual = palavraObj.palavra;

    palavraExibida = Array(palavraAtual.length).fill('_');
    atualizarPalavra();
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
        jogoAtivo = false;
        disableKeyboard();
    }
}

function verificarDerrota() {
    if (tentativasRestantes === 0) {
        alert(`Você perdeu! A palavra era: ${palavraAtual}`);
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

    escolherPalavraAleatoria();
}

// ------------------------------
// Event Listeners
// ------------------------------
// Event for guessing the full word
btnChutarPalavra.addEventListener('click', () => {
    const chute = chutePalavraInput.value.toUpperCase();
    if (chute === palavraAtual) {
        alert('Parabéns, você venceu!');
        jogoAtivo = false;
    } else {
        alert(`Você errou! A palavra era: ${palavraAtual}`);
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

        return {
            pokemonSorteado: pokemon.name,
            pokemonImg: pokemonData.sprites.other["dream_world"].front_default
        };
    } catch (error) {
        console.log(error);
    }
}

// Function to display Pokémon data
async function selecionarDados() {
    const pokemon = await sortearPokemon();

    const imgPokemon = document.querySelector('#pokeImg');
    imgPokemon.src = pokemon.pokemonImg;

    const pokeName = document.querySelector('#pokeName');
    pokeName.innerText = pokemon.pokemonSorteado;

    const letters = pokemon.pokemonSorteado.split('');

    letters.forEach(item => {
        const novoCard = document.createElement('div');
        const letterElement = document.createElement('p');
        letterElement.innerText = item;

        novoCard.appendChild(letterElement);
        novoCard.setAttribute('data-letra', item);
        novoCard.classList.add(`card-letter`, `${item}`);

        novoCard.addEventListener('click', () => {
            handleShow(item);
            letterElement.style.opacity = 100;
        });
    });
}

// Start Pokémon selection
selecionarDados();

function handleShow(item) {
    // Implementation for handling letter show
}
