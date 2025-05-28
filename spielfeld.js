import { spielsteine, startkonstellation } from "./config.js";
import { Spielstein } from "./spielstein.js";
import { Farbraster } from "./farbraster.js";

const canvas = document.getElementById('meinCanvas');
const ctx = canvas.getContext('2d');

export class Spielfeld {
    constructor(kantenlaenge = 600) {
        this.kantenlaenge = kantenlaenge;
        this.hintergrundfarbe = '#987977';
        this.spielsteine = [];
        this.rand = [];
        
        // this.generiereRand();
        // this.generiereSpielsteine();
    }

    generiereRand() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let fr = new Farbraster(this.kantenlaenge / 4, [i, j]);                
                if (fr.farbe != '#000000') {
                    this.rand.push(fr);
                }
            }
        }
    }

    generiereSpielsteine() {
        for (let i = 0; i < 8; i++) {
            this.spielsteine.push(new Spielstein(
                                    this.kantenlaenge / 4,
                                    spielsteine[i],
                                    startkonstellation[i][0]));                        
        }
    }

    zeichnen() {
        const startX = (canvas.width - this.kantenlaenge) / 2;
        const startY = (canvas.height - this.kantenlaenge) / 2;

        // for (const r of this.rand) {
        //     r.zeichnen(startX, startY);
        // }
        
        ctx.beginPath();
        ctx.fillStyle = this.hintergrundfarbe;
        ctx.fillRect(
            startX, 
            startY, 
            this.kantenlaenge, 
            this.kantenlaenge);
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(
            startX, 
            startY, 
            this.kantenlaenge, 
            this.kantenlaenge);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();

        // for (const s of this.spielsteine) {
        //     s.zeichnen(startX, startY);
        // }
    }
}

