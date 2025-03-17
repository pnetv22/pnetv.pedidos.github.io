// game.js
document.addEventListener('DOMContentLoaded', () => {
    // Configuração inicial
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const SCALE = 2;
    
    // Elementos da UI
    const healthBars = {
        p1: document.getElementById('p1-health'),
        p2: document.getElementById('p2-health')
    };

    // Sistema de sprites
    const sprites = {
        ken: new Image(),
        ryu: new Image(),
        stage: new Image()
    };

    // Carregar recursos
    function loadAssets() {
        return new Promise((resolve) => {
            let loaded = 0;
            const total = Object.keys(sprites).length;
            
            Object.values(sprites).forEach(img => {
                img.onload = () => {
                    loaded++;
                    if(loaded === total) resolve();
                };
                img.src = `assets/${img._name}.png`; // Coloque suas sprites na pasta assets
            });
        });
    }

    // Sistema de personagem
    class Fighter {
        constructor(x, y, sprite, controls) {
            this.x = x;
            this.y = y;
            this.sprite = sprite;
            this.controls = controls;
            this.state = 'idle';
            this.frame = 0;
            this.health = 100;
            this.combo = 0;
            this.lastHit = 0;
            this.facing = 1;
        }

        update() {
            if(this.state === 'attack' && this.frame > 6) {
                this.setState('idle');
            }
            this.frame = (this.frame + 0.2) % 8;
        }

        setState(newState) {
            this.state = newState;
            this.frame = 0;
        }

        draw() {
            const frameX = Math.floor(this.frame) * 64;
            const frameY = this.state === 'attack' ? 64 : 0;
            
            ctx.save();
            if(this.facing === -1) {
                ctx.scale(-1, 1);
                ctx.drawImage(this.sprite, frameX, frameY, 64, 64, -this.x-64, this.y, 64, 64);
            } else {
                ctx.drawImage(this.sprite, frameX, frameY, 64, 64, this.x, this.y, 64, 64);
            }
            ctx.restore();
        }
    }

    // Sistema de jogo principal
    class Game {
        constructor() {
            this.fighters = [];
            this.keys = {};
            this.init();
        }

        async init() {
            await loadAssets();
            this.setupFighters();
            this.setupControls();
            this.gameLoop();
        }

        setupFighters() {
            this.fighters = [
                new Fighter(200, 300, sprites.ken, { 
                    left: 'a', 
                    right: 'd', 
                    jump: 'w', 
                    attack: ' ' 
                }),
                new Fighter(700, 300, sprites.ryu, { 
                    left: 'ArrowLeft', 
                    right: 'ArrowRight', 
                    jump: 'ArrowUp', 
                    attack: 'Enter' 
                })
            ];
        }

        setupControls() {
            window.addEventListener('keydown', e => this.keys[e.key] = true);
            window.addEventListener('keyup', e => this.keys[e.key] = false);
        }

        checkCollision(a, b) {
            return a.x < b.x + 64 &&
                   a.x + 64 > b.x &&
                   a.y < b.y + 64 &&
                   a.y + 64 > b.y;
        }

        updateHealthBars() {
            healthBars.p1.style.width = `${this.fighters[0].health * 3}px`;
            healthBars.p2.style.width = `${this.fighters[1].health * 3}px`;
        }

        update() {
            this.fighters.forEach((fighter, index) => {
                const opponent = this.fighters[1 - index];
                
                // Movimento
                if(this.keys[fighter.controls.left]) {
                    fighter.x -= 5;
                    fighter.facing = -1;
                }
                if(this.keys[fighter.controls.right]) {
                    fighter.x += 5;
                    fighter.facing = 1;
                }
                
                // Ataque
                if(this.keys[fighter.controls.attack] && fighter.state !== 'attack') {
                    fighter.setState('attack');
                    if(this.checkCollision(fighter, opponent)) {
                        const damage = 10 + Math.random() * 5;
                        opponent.health = Math.max(0, opponent.health - damage);
                        fighter.combo++;
                        this.updateHealthBars();
                    }
                }

                fighter.x = Math.max(50, Math.min(canvas.width - 114, fighter.x));
                fighter.update();
            });
        }

        draw() {
            // Fundo
            ctx.drawImage(sprites.stage, 0, 0, canvas.width, canvas.height);
            
            // Personagens
            this.fighters.forEach(fighter => fighter.draw());
        }

        gameLoop() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    // Iniciar o jogo
    new Game();
});
