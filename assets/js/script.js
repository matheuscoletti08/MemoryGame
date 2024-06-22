const gameContainer = document.querySelector('.game-container');
const cardGrid = document.querySelector('.card-grid');
const newGameBtn = document.querySelector('.new-game-btn');
const scoreElement = document.querySelector('.score');
const definitionElement = document.querySelector('.definition');

let cards = [];
let flippedCards = [];
let score = 0;
let canFlip = false; // Variável para controlar se é possível virar as cartas

// Função para criar cartas
function createCards() {
    const javaTopics = [
        { topic: 'Classe', definition: 'Uma classe é um modelo para criar objetos.' },
        { topic: 'Objeto', definition: 'Um objeto é uma instância de uma classe.' },
        { topic: 'Método', definition: 'Um método é uma função definida dentro de uma classe.' }
    ];

    // Duplica os tópicos para formar pares e triplica para chegar a 8 pares
    let topics = javaTopics.concat(javaTopics).concat(javaTopics);

    topics.sort(() => Math.random() - 0.5); // Embaralha as cartas

    topics.slice(0, 8).concat(topics.slice(0, 8)).forEach(({ topic }) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.topic = topic;
        card.innerHTML = `<p>${topic}</p>`;
        cardGrid.appendChild(card);
        cards.push(card);

        // Adiciona evento de clique à carta
        card.addEventListener('click', () => {
            if (canFlip && !card.classList.contains('flip') && flippedCards.length < 2) {
                flipCard(card);
            }
        });
    });

    // Mostra todas as cartas por 2 segundos
    setTimeout(() => {
        cards.forEach(card => {
            card.innerHTML = `<p></p>`;
            card.classList.remove('flip');
            canFlip = true; // Permite que o jogador comece a virar as cartas
        });
    }, 1000);
}

// Função para flipar carta
function flipCard(card) {
    card.classList.add('flip');
    card.innerHTML = `<p>${card.dataset.topic}</p>`;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false; // Impede de virar mais cartas temporariamente
        setTimeout(checkMatch, 500); // Aguarda 500 ms antes de verificar a correspondência
    }
}

// Função para verificar se as cartas são iguais
function checkMatch() {
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        if (card1.dataset.topic === card2.dataset.topic) {
            score++;
            scoreElement.textContent = `Pontuação: ${score}`;
            card1.removeEventListener('click', () => flipCard(card1));
            card2.removeEventListener('click', () => flipCard(card2));
            card1.style.pointerEvents = 'none';
            card2.style.pointerEvents = 'none';
            card1.classList.add('matched');
            card2.classList.add('matched');
            showDefinition(card1.dataset.topic);
            flippedCards = [];
            canFlip = true; // Permite virar novas cartas novamente
        } else {
            setTimeout(() => {
                card1.classList.remove('flip');
                card2.classList.remove('flip');
                card1.innerHTML = `<p></p>`;
                card2.innerHTML = `<p></p>`;
                flippedCards = [];
                canFlip = true; // Permite virar novas cartas novamente
            }, 500);
        }
    }
}

// Função para mostrar a definição do tópico
function showDefinition(topic) {
    const javaTopics = {
        'Classe': 'Uma classe é um modelo para criar objetos.',
        'Objeto': 'Um objeto é uma instância de uma classe.',
        'Método': 'Um método é uma função definida dentro de uma classe.'
    };
    definitionElement.textContent = javaTopics[topic];
}

// Adiciona evento de clique ao botão de novo jogo
newGameBtn.addEventListener('click', () => {
    cardGrid.innerHTML = '';
    cards = [];
    flippedCards = [];
    score = 0;
    scoreElement.textContent = `Pontuação: 0`;
    definitionElement.textContent = '';
    canFlip = false; // Impede de virar cartas antes do início do jogo
    createCards();
});

createCards();
