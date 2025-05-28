import { ctx } from "./kontext.js";
import { bekommeFarbe } from "./config.js";

export class Farbraster {
    constructor(kantenlaenge = 150, randPosition = [0, 0]) {
        if (kantenlaenge <= 0) throw new Error("Kantenlänge muss positiv sein");
        if (!Array.isArray(randPosition) || randPosition.length !== 2) {
            throw new Error("Randposition muss ein Array mit zwei Elementen sein");
        }
        
        this.kantenlaenge = [kantenlaenge, kantenlaenge];
        this.randPosition = randPosition;    
        this.zeichenPosition = this.findeZeichenPosition();   
        this.farbe = bekommeFarbe([this.randPosition[1], this.randPosition[0]]);
        
        this.findeZeichenPosition();
    }

    findeZeichenPosition() {
        let zp = [0, 0];
        zp[0] = this.kantenlaenge[0] * this.randPosition[0];
        zp[1] = this.kantenlaenge[1] * this.randPosition[1];
        if (this.randPosition[0] == 0) {
            zp[0] = zp[0] - 100;
            this.kantenlaenge[0] = this.kantenlaenge[0] + 100;
        }
        if (this.randPosition[1] == 0) {
            zp[1] = zp[1] - 100;
            this.kantenlaenge[1] = this.kantenlaenge[1] + 100;
        }
        if (this.randPosition[0] == 3) {
            this.kantenlaenge[0] = this.kantenlaenge[0] + 100;
        }
        if (this.randPosition[1] == 3) {
            this.kantenlaenge[1] = this.kantenlaenge[1] + 100;
        }
        return zp;
    }    

    zeichnen(startX, startY) {
        ctx.beginPath();
        ctx.fillStyle = this.farbe;
        ctx.fillRect(
            startX + this.zeichenPosition[0], 
            startY + this.zeichenPosition[1], 
            this.kantenlaenge[0], 
            this.kantenlaenge[1]
        );
        ctx.stroke();        
    }
}