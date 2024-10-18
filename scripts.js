const palavraElement = document.getElementById('palavra');
const dicaElement = document.getElementById('dica');
const temaElement = document.getElementById('tema');
const tentativasElement = document.getElementById('tentativas');
const letrasUsadasElement = document.getElementById('letras-usadas');
const chutePalavraInput = document.getElementById('chute-palavra');
const btnChutarPalavra = document.getElementById('btn-chutar-palavra');
const btnReiniciar = document.getElementById('btn-reiniciar');
const virtualKeyboard = document.getElementById('virtual-keyboard');

// Elementos do boneco
const headElement = document.getElementById('head');
const bodyElement = document.getElementById('body');
const leftArmElement = document.getElementById('left-arm');
const rightArmElement = document.getElementById('right-arm');
const leftLegElement = document.getElementById('left-leg');
const rightLegElement = document.getElementById('right-leg');

// Inicialmente, esconder o boneco
const boneco = [headElement, bodyElement, leftArmElement, rightArmElement, leftLegElement, rightLegElement];
boneco.forEach(part => part.style.visibility = 'hidden');

let palavraAtual = '';
let dicaAtual = '';
let temaAtual = '';
let tentativasRestantes = 6;
let letrasUsadas = [];
let palavraExibida = [];
let jogoAtivo = true;


function atualizarPlacar() {
    localStorage.setItem('vitorias', vitorias);
    localStorage.setItem('derrotas', derrotas);
    console.log(`Vitórias: ${vitorias}, Derrotas: ${derrotas}`);
}

// Array com palavras, dicas e temas
const palavrasForca = [
    { palavra: "JAVASCRIPT", dica: "Linguagem de Programação", tema: "Tecnologia" },
    { palavra: "ELEFANTE", dica: "Maior animal terrestre", tema: "Animais" },
    { palavra: "BRASIL", dica: "País da América do Sul", tema: "Geografia" },
    { palavra: "PIZZA", dica: "Comida italiana popular", tema: "Alimentação" },
    { palavra: "VULCAO", dica: "Fenômeno natural explosivo", tema: "Natureza" }
];

// Função para escolher uma palavra aleatória do array
function escolherPalavraAleatoria() {
    const palavraObj = palavrasForca[Math.floor(Math.random() * palavrasForca.length)];
    palavraAtual = palavraObj.palavra;
    dicaAtual = palavraObj.dica;
    temaAtual = palavraObj.tema;

    dicaElement.textContent = dicaAtual;
    temaElement.textContent = temaAtual;
    palavraExibida = Array(palavraAtual.length).fill('_');
    atualizarPalavra();
}

// Função para configurar o teclado virtual
function configurarTecladoVirtual() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.classList.add('tecla');
        btn.addEventListener('click', () => tentarLetra(letra, btn));
        virtualKeyboard.appendChild(btn);
    });
}

// Função para atualizar a exibição da palavra
function atualizarPalavra() {
    palavraElement.textContent = palavraExibida.join(' ');
}

// Função para processar a tentativa de uma letra
function tentarLetra(letra, btn) {
    if (!jogoAtivo || letrasUsadas.includes(letra)) return;

    btn.disabled = true;
    btn.classList.add('tecla-usada');

    letrasUsadas.push(letra);
    letrasUsadasElement.textContent = letrasUsadas.join(', ');

    if (palavraAtual.includes(letra)) {
        palavraAtual.split('').forEach((char, index) => {
            if (char === letra) {
                palavraExibida[index] = letra;
            }
        });
        atualizarPalavra();
        verificarVitoria();
    } else {
        tentativasRestantes--;
        tentativasElement.textContent = tentativasRestantes;
        mostrarParteDoBoneco();
        verificarDerrota();
    }
}

// Função para mostrar a parte do boneco correspondente ao número de erros
function mostrarParteDoBoneco() {
    const partesDoBoneco = 6 - tentativasRestantes;
    switch (partesDoBoneco) {
        case 1:
            headElement.style.visibility = 'visible';  // Cabeça
            break;
        case 2:
            bodyElement.style.visibility = 'visible';  // Corpo
            break;
        case 3:
            leftArmElement.style.visibility = 'visible';  // Braço esquerdo
            break;
        case 4:
            rightArmElement.style.visibility = 'visible';  // Braço direito
            break;
        case 5:
            leftLegElement.style.visibility = 'visible';  // Perna esquerda
            break;
        case 6:
            rightLegElement.style.visibility = 'visible';  // Perna direita
            break;
    }
}

// Função para verificar se o jogador venceu
function verificarVitoria() {
    if (palavraExibida.join('') === palavraAtual) {
        alert('Parabéns, você venceu!');
        jogoAtivo = false;
    }
}

// Função para verificar se o jogador perdeu
function verificarDerrota() {
    if (tentativasRestantes === 0) {
        alert(`Você perdeu! A palavra era: ${palavraAtual}`);
        jogoAtivo = false;
    }
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    tentativasRestantes = 6;
    letrasUsadas = [];
    letrasUsadasElement.textContent = '';
    tentativasElement.textContent = tentativasRestantes;
    jogoAtivo = true;

    // Esconder o boneco
    boneco.forEach(part => part.style.visibility = 'hidden');

    escolherPalavraAleatoria();
}

// Configurar evento para chute de palavra inteira
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

// Configurar evento para reiniciar o jogo
btnReiniciar.addEventListener('click', reiniciarJogo);

// Inicializar o jogo
configurarTecladoVirtual();
atualizarPlacar();
reiniciarJogo();

async function sortearPokemon() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=20&limit=200`)

        if (!response.ok) {
            throw new Error('Erro na requisição')
        }
        const data = await response.json()

        const infos = []

        data.results.forEach(item => {
            infos.push({ name: item.name, url: item.url })
        })

        const pokemon = (infos[Math.floor(Math.random() * (infos.length))])

        const pokemonResponse = await fetch(pokemon.url)
        const pokemonData = await pokemonResponse.json()

        const pokeData = {
            pokemonSorteado: pokemon.name,
            pokemonImg: pokemonData.sprites.other["dream_world"].front_default
        }

        return pokeData

    } catch (error) {
        console.log(error)
    }
}

// Mostrar array com os pokemons
sortearPokemon().then((pokemon) => console.log(pokemon))

async function selecionarDados () {
    const pokemon = await sortearPokemon()

    const imgPokemon = document.querySelector('#pokeImg')
    imgPokemon.src = pokemon.pokemonImg

    const pokeName = document.querySelector('#pokeName')
    pokeName.innerText = pokemon.pokemonSorteado

    const unders = pokemon.pokemonSorteado
    const letters = unders.split('')
    console.log(letters.length)
    console.log(letters)

    const encontrar = document.querySelector('.encontrar')

    letters.forEach(item => {
        const novoCard = document.createElement('div')
        const letterElement = document.createElement('p')
        letterElement.innerText = item

        novoCard.appendChild(letterElement)

        novoCard.setAttribute('data-letra', item)
        novoCard.classList.add(`card-letter`,`${item}`)
        encontrar.appendChild(novoCard)

        novoCard.addEventListener('click', () => {
            handleShow(item)
            letterElement.style.opacity = 100
        })
    });
}

selecionarDados()

function handleShow(item){
    
}
