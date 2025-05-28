import { ctx } from "./kontext.js";

export class Spielstein {
    constructor(kantenlaenge = 150, geografie = [], position = [0, 0]) {
        this.kantenlaenge = kantenlaenge;
        this.geografie = geografie;
        this.positionen = [position];
        this.farben = [geografie[0]];
        this.groesse = 1;
        this.dimensionierung = [this.kantenlaenge * 0.8, this.kantenlaenge * 0.8]; 
        this.hintergrundfarbe = "#333333"

        this.findePositionen();
        this.berechneDimensionierung();
    }

    findePositionen() {
        for (let i = 1; i < 3; i++) {
            if (this.geografie[i] != "#000000"){
                this.groesse = 2;
                this.farben.push(this.geografie[i]);
                if (i == 1) {
                    this.positionen.push([
                        this.positionen[0][0], this.positionen[0][1] + 1 
                    ]);
                } else {
                    this.positionen.push([
                        this.positionen[0][0] + 1, this.positionen[0][1]
                    ]);
                }
            }
        }
    }

    berechneDimensionierung() {
        if (this.groesse == 2) {
            if (this.positionen[1][0] - this.positionen[0][0] > 0) {
                this.dimensionierung[0] = this.dimensionierung[0] + this.kantenlaenge;
            } else {
                this.dimensionierung[1] = this.dimensionierung[1] + this.kantenlaenge;
            }
        }
    }  

    zeichnen(startX, startY) {
        ctx.beginPath();
        ctx.fillStyle = this.hintergrundfarbe;
        ctx.fillRect(            
            startX + (this.positionen[0][1] + 0.1) * this.kantenlaenge, 
            startY + (this.positionen[0][0] + 0.1) * this.kantenlaenge, 
            this.dimensionierung[1], 
            this.dimensionierung[0]
        );
        ctx.stroke(); 

        ctx.beginPath();
        ctx.rect(            
            startX + (this.positionen[0][1] + 0.1) * this.kantenlaenge, 
            startY + (this.positionen[0][0] + 0.1) * this.kantenlaenge, 
            this.dimensionierung[1], 
            this.dimensionierung[0]
        );
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke(); 

        for (let i = 0; i < this.groesse; i++){
            ctx.beginPath();
            ctx.arc(
                startX + (this.positionen[i][1] + 0.5) * this.kantenlaenge,
                startY + (this.positionen[i][0] + 0.5) * this.kantenlaenge, 
                this.kantenlaenge * 0.3, 
                0, Math.PI * 2, false);
            ctx.fillStyle = this.farben[i];
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }
}