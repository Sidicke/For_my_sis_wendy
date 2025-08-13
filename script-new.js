// Configuration des données
const birthdayData = {
    // Titre principal - vous pouvez personnaliser le prénom ici
    title: "Joyeux Anniversaire Wendy",
    
    // Configuration des sons
    sounds: {
        explosion: 'explosionSound',
        backgroundMusic: 'backgroundMusic',
        health: 'healthSound',
        success: 'successSound',
        love: 'loveSound'
    }
};

// Variables globales
let isFirstLoad = true;
let typingTimeout; // remplacer typingTimer par typingTimeout

// Éléments DOM
const elements = {
    titleSection: document.getElementById('titleSection'),
    messageSection: document.getElementById('messageSection'),
    interactiveSection: document.getElementById('interactiveSection'),
    replaySection: document.getElementById('replaySection'),
    typedMessage: document.getElementById('typedMessage'),
    typingCursor: document.getElementById('typingCursor'),
    mainTitle: document.getElementById('mainTitle'),
    replayButton: document.getElementById('replayButton'),
    explosionSound: document.getElementById('explosionSound'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    healthSound: document.getElementById('healthSound'),
    successSound: document.getElementById('successSound'),
    loveSound: document.getElementById('loveSound')
};

// Fonction pour jouer un son (avec gestion des erreurs d'autoplay)
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.play().catch(e => {
            console.log(`Son ${soundId} bloqué par autoplay policy:`, e);
        });
    }
}

// Fonction pour déclencher l'explosion initiale
function triggerInitialExplosion(callbackAfterExplosion) {
    // Effet flash
    const flashDiv = document.createElement('div');
    flashDiv.className = 'flash-effect';
    document.body.appendChild(flashDiv);
    
    setTimeout(() => {
        document.body.removeChild(flashDiv);
    }, 300);
    
    // Son d'explosion
    playSound('explosionSound');
    
    // Confettis
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
            colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
        });
    }, 250);
    
    // Après l'explosion → afficher contenu et jouer musique
    setTimeout(() => {
        showContent();
        playSound('backgroundMusic');
        if (callbackAfterExplosion) callbackAfterExplosion();
    }, 1500);
}


// Fonction pour afficher le contenu progressivement (titres, sections, boutons)
function showContent() {
    elements.titleSection.style.opacity = '1';
    elements.titleSection.classList.add('visible');

    setTimeout(() => {
        elements.messageSection.style.opacity = '1';
        elements.messageSection.classList.add('visible');
    }, 1000);

    setTimeout(() => {
        elements.interactiveSection.style.opacity = '1';
        elements.interactiveSection.classList.add('visible');
    }, 2000);

    setTimeout(() => {
        elements.replaySection.style.opacity = '1';
        elements.replaySection.classList.add('visible');
    }, 3000);
}

// Fonction pour afficher le message directement (sans animation)
function showMessageInstantly() {
    const message = [
    "Chère Wendy,",
    "",
    "En ce jour spécial, je veux te souhaiter un merveilleux anniversaire rempli de joie, de rires et de moments inoubliables.",
    "Que cette nouvelle année de vie t'apporte tout le bonheur que tu mérites, des réussites éclatantes et des rêves qui se réalisent.",
    "Profite de chaque instant entourée de ceux que tu aimes.",
    "Et crois moi tu es une personne spéciale laisse jamais les autres te dire qui tu es",
    "Joyeux anniversaire ! 🎉🎂💖"
].join('\n');

    elements.typedMessage.innerHTML = message.replace(/\n/g, '<br>');
    elements.typingCursor.style.display = 'none';
}

// Animation machine à écrire (pour "Rejouer la fête")
function startTypingAnimation() {
    const message = [
    "Chère Wendy,",
    "",
    "En ce jour spécial, je veux te souhaiter un merveilleux anniversaire rempli de joie, de rires et de moments inoubliables.",
    "Que cette nouvelle année de vie t'apporte tout le bonheur que tu mérites, des réussites éclatantes et des rêves qui se réalisent.",
    "",
    "Profite de chaque instant entourée de ceux que tu aimes.",
    "",
    "Joyeux anniversaire ! 🎉🎂💖"
].join('\n');

    let i = 0;
    elements.typedMessage.innerHTML = '';
    elements.typingCursor.style.display = 'inline';

    function type() {
        if (i < message.length) {
            let char = message.charAt(i);
            if (char === '\n') {
                elements.typedMessage.innerHTML += '<br>';
            } else {
                elements.typedMessage.innerHTML += char;
            }
            i++;
            typingTimeout = setTimeout(type, 30);
        } else {
            elements.typingCursor.style.display = 'none';
        }
    }
    type();
}

// Fonction pour les confettis thématiques
function triggerThemedConfetti(type) {
    let colors;
    let shapes = ['circle'];
    let soundId;
    
    switch (type) {
        case 'health':
            colors = ['#2ecc71', '#27ae60', '#ffffff', '#e8f8f5'];
            soundId = 'healthSound';
            break;
        case 'success':
            colors = ['#ffd700', '#f1c40f', '#fff176', '#ffecb3'];
            soundId = 'successSound';
            break;
        case 'love':
            colors = ['#e74c3c', '#ff6b9d', '#f8d7da', '#ffc0cb'];
            shapes = ['heart'];
            soundId = 'loveSound';
            break;
        default:
            colors = ['#3498db', '#74b9ff'];
    }
    
    if (soundId) {
        playSound(soundId);
    }
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        shapes: shapes,
        zIndex: 999
    });
}

// Fonction pour rejouer la fête
// Fonction pour rejouer la fête
function replayParty() {
    // Stopper l'animation en cours
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    // Masquer tout le contenu
    elements.titleSection.classList.remove('visible');
    elements.messageSection.classList.remove('visible');
    elements.interactiveSection.classList.remove('visible');
    elements.replaySection.classList.remove('visible');
    elements.typedMessage.innerHTML = '';
    elements.typingCursor.style.display = 'none';

    // Lancer séquence complète
    setTimeout(() => {
        triggerInitialExplosion(); // explosion + confettis + musique
        setTimeout(() => {
            startTypingAnimation(); // écriture progressive après explosion
        }, 2000); // attendre 2s pour que l'explosion soit finie
    }, 300);
}


// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Personnaliser le titre
    elements.mainTitle.innerHTML = birthdayData.title.replace('Wendy', '<span class="name-placeholder">Wendy</span>');

    // Cacher tout le contenu initialement
    elements.titleSection.style.opacity = '0';
    elements.messageSection.style.opacity = '0';
    elements.interactiveSection.style.opacity = '0';
    elements.replaySection.style.opacity = '0';

    // Ajouter les événements de clic sur les cases interactives
    const interactiveBoxes = document.querySelectorAll('.interactive-box');
    interactiveBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const type = box.getAttribute('data-type');
            triggerThemedConfetti(type);
        });
    });

    // Événement du bouton rejouer
    elements.replayButton.addEventListener('click', replayParty);

    // Bouton de démarrage ("Appuyer pour voir la surprise")
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        const startContainer = document.getElementById('startButtonContainer');
        startContainer.classList.add('hidden');
        setTimeout(() => {
            startContainer.style.display = 'none';
        }, 500);

        // Afficher message direct (pas d’animation)
        showMessageInstantly();

        // Afficher les sections
        showContent();
        showMessageInstantly();
        showMessageInstantly();

        // Jouer sons
        playSound('explosionSound');
        playSound('backgroundMusic');
    });

    // Gestion des erreurs audio (première interaction utilisateur)
    document.addEventListener('click', () => {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (audio.readyState >= 2) {
                console.log(`Audio ${audio.id} prêt`);
            }
        });
    }, { once: true });

    // Démarrage automatique si besoin (mais ici on part sur bouton)
    setTimeout(() => {
        if (isFirstLoad) {
            // On ne lance plus automatiquement, on attend le clic sur startButton
            isFirstLoad = false;
        }
    }, 500);
});
// Affiche la photo avec confettis
function showBirthdayPhoto() {
    const photoSection = document.getElementById('photoSection');
    photoSection.classList.add('visible');

    // Confettis autour de la photo
    const rect = photoSection.getBoundingClientRect();
    const xCenter = (rect.left + rect.right) / 2 / window.innerWidth;
    const yCenter = (rect.top + rect.bottom) / 2 / window.innerHeight;

    confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: xCenter, y: yCenter },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1']
    });
}
