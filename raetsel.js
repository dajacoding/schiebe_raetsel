const canvas = document.getElementById('meinCanvas');
const ctx = canvas.getContext('2d');

const farben = {
    rot: "#FF0000",
    orange: "#FFA500",
    gelb: "#FFFF00",
    limone: "#77FF00",
    gruen: "#009950",
    azur: "#007FFF",
    blau: "#0000FF",
    lila: "#800080",
    schwarz: "#000000",
    grau: "#777777"
  };

const farbMap = {
    '0,0': 'rot', '0,1': 'orange', '0,2': 'gelb', '0,3': 'limone',
    '1,0': 'orange'                             , '1,3': 'azur',
    '2,0': 'gelb'                               , '2,3': 'blau',
    '3,0': 'gruen', '3,1': 'azur', '3,2': 'blau', '3,3': 'lila'
};

const spielsteine = {
    // [0] links-oben ("mittig")
    // [1] rechts
    // [2] unten
    0: [farben['limone'], farben['schwarz'], farben['azur']],
    1: [farben['rot'], farben['schwarz'], farben['schwarz']],
    2: [farben['orange'], farben['schwarz'], farben['schwarz']],
    3: [farben['azur'], farben['blau'], farben['schwarz']],
    4: [farben['blau'], farben['schwarz'], farben['lila']],
    5: [farben['orange'], farben['gelb'], farben['schwarz']],
    6: [farben['gelb'], farben['schwarz'], farben['gruen']],
    // der graue
    7: [farben['grau'], farben['grau'], farben['schwarz']]
}

const startkonstellation = {
    0: [[0, 0], [0, 1]],
    1: [[0, 1], [1, 2]],
    2: [[1, 2], [1, 3]],
    3: [[2, 0], [2, 0]],
    4: [[1, 3], [2, 3]],
    5: [[3, 0], [0, 2]],
    6: [[2, 2], [0, 0]],
    // der graue
    7: [[0, 2], [3, 1]]
}

const zielkonstellation = {
    0: [0, 3],
    1: [0, 0],
    2: [1, 0],
    3: [3, 1],
    4: [2, 3],
    5: [0, 1],
    6: [2, 0],
    // der graue
    7: [1, 1]
}

const richtungen = {
    'links':  [-1, 0],
    'rechts': [1, 0],
    'hoch':   [0, 1],
    'runter': [0, -1]
}

let level = 0;

function bekommeFarbe(pos) {
    gesucht = farbMap[pos.join(',')] || 'schwarz';
    return farben[gesucht];
}

function bekommeRichtung(differenzX, differenzY) {
    if (Math.abs(differenzX) > Math.abs(differenzY)) {
        if (differenzX < 0) {
            return richtungen['links'];
        } else {
            return richtungen['rechts'];
        }
    } else {
        if (differenzY < 0) {
            return richtungen['runter'];
        } else {
            return richtungen['hoch'];
        }
    }
}

class Spielstein {
    constructor(id = 0, kantenlaenge = 150, geografie = [], position = [0, 0]) {
        this.id = id;
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
            startX + (this.positionen[0][0] + 0.1) * this.kantenlaenge, 
            startY + (this.positionen[0][1] + 0.1) * this.kantenlaenge, 
            this.dimensionierung[0], 
            this.dimensionierung[1]
        );
        ctx.stroke(); 

        ctx.beginPath();
        ctx.rect(            
            startX + (this.positionen[0][0] + 0.1) * this.kantenlaenge, 
            startY + (this.positionen[0][1] + 0.1) * this.kantenlaenge, 
            this.dimensionierung[0], 
            this.dimensionierung[1]
        );
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke(); 

        for (let i = 0; i < this.groesse; i++){
            ctx.beginPath();
            ctx.arc(
                startX + (this.positionen[i][0] + 0.5) * this.kantenlaenge,
                startY + (this.positionen[i][1] + 0.5) * this.kantenlaenge, 
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

class Farbraster {
    constructor(kantenlaenge = 150, randPosition = [0, 0]) {
        if (kantenlaenge <= 0) throw new Error("Kantenlänge muss positiv sein");
        if (!Array.isArray(randPosition) || randPosition.length !== 2) {
            throw new Error("Randposition muss ein Array mit zwei Elementen sein");
        }
        
        this.kantenlaenge = [kantenlaenge, kantenlaenge];
        this.randPosition = randPosition;    
        this.zeichenPosition = this.findeZeichenPosition();   
        this.farbe = bekommeFarbe([this.randPosition[0], this.randPosition[1]]);
        
        this.findeZeichenPosition();
    }

    findeZeichenPosition() {
        let zp = [this.kantenlaenge[0] * this.randPosition[0], 
                  this.kantenlaenge[1] * this.randPosition[1]];
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

class Spielfeld {
    constructor(kantenlaenge = 600) {
        this.kantenlaenge = kantenlaenge;
        this.feldlaenge = this.kantenlaenge / 4;
        this.hintergrundfarbe = '#987977';
        this.spielsteine = [];
        this.rand = [];
        
        this.generiereRand();
        this.generiereSpielsteine();
        this.addEventListeners();

        this.bordersX = [
            (canvas.width - this.kantenlaenge) / 2, 
            canvas.width - ((canvas.width - this.kantenlaenge) / 2)];
        this.bordersY = [
            (canvas.height - this.kantenlaenge) / 2, 
            canvas.width - ((canvas.height - this.kantenlaenge) / 2)];

        this.tempX = 0;
        this.tempY = 0;
        this.aktivesTeil = false;
        this.aktivePosition = [0, 0];
    }

    addEventListeners() {
        canvas.addEventListener('mousedown',  this.linksKlicken.bind(this));
        canvas.addEventListener('touchstart', this.linksKlicken.bind(this));
        canvas.addEventListener('mouseup',  this.linksKlickenBeenden.bind(this));
        canvas.addEventListener('touchend', this.linksKlickenBeenden.bind(this));
        // canvas.addEventListener('mousemove', this.mouseBewegen.bind(this));
        // canvas.addEventListener('touchmove', this.mouseBewegen.bind(this));

    }

    feldIstBelegt(pos) {
        for (const s of this.spielsteine) {
            for (const p of s.positionen) {
                if (pos[0] == p[0] && pos[1] == p[1]) {
                    return true;
                }
            }
        }
        return false;
    }
    
    linksKlicken(e) {
        e.preventDefault();
  
        let xIn, yIn;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            xIn = touch.pageX - canvas.offsetLeft;
            yIn = touch.pageY - canvas.offsetTop;
        } else {
            xIn = e.clientX - canvas.offsetLeft;
            yIn = e.clientY - canvas.offsetTop;
        }

        const mouseX = xIn - this.bordersX[0];
        const mouseY = yIn - this.bordersY[0];
        if (mouseX > 0 && mouseX < this.bordersX[1] &&
            mouseY > 0 && mouseY < this.bordersY[1]){
                const x = Math.floor(mouseX / this.feldlaenge);
                const y = Math.floor(mouseY / this.feldlaenge);
                if (this.feldIstBelegt([x, y])) {
                    this.tempX = mouseX;
                    this.tempY = mouseY;
                    this.aktivesTeil = true;
                    this.aktivePosition = [x, y];                    
                }
            } 
    }

    linksKlickenBeenden(e) {  
        e.preventDefault();
  
        let xIn, yIn;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            xIn = touch.pageX - canvas.offsetLeft;
            yIn = touch.pageY - canvas.offsetTop;
        } else {
            xIn = e.clientX - canvas.offsetLeft;
            yIn = e.clientY - canvas.offsetTop;
        }

        if (this.aktivesTeil) {   
            this.aktivesTeil = false;
            const differenzX = xIn - this.bordersX[0] - this.tempX;
            const differenzY = yIn - this.bordersY[0] - this.tempY;
            this.spielsteinBewegen(bekommeRichtung(differenzX, differenzY));
        }
    }

    bekommeSpielsteinIdVonPosition(pos) {
        for (const s of this.spielsteine) {
            for (const p of s.positionen) {
                if (p[0] == pos[0] && p[1] == pos[1]) {
                    return s.id; 
                }
            }
        }
        return -1;
    }

    bekommeZielPosition(position, richtung = [0, 0]) {
        return [
            position[0] + richtung[0], 
            position[1] + richtung[1]        
        ];
    }

    zielImGleichenStein(id, zielposition) {
        for (const s of this.spielsteine) {
            if (id == s.id) {
                for (const p of s.positionen) {
                    if (zielposition[0] == p[0] && zielposition[1] == p[1]) {
                        return true;
                    }
                }
                return false
            }
        }
        return false
    }

    positionImSpielfeld(position) {
        if (position[0] >= 0 && position[0] <= 3 &&
            position[1] >= 0 && position[1] <= 3) {
                return true;
            }
        return false;
    }

    verschiebbar(id, positionen, richtung) {
        for (const p of positionen) {
            const zielpositionSpielsteinId = this.bekommeSpielsteinIdVonPosition(this.bekommeZielPosition(p, richtung));
            if (zielpositionSpielsteinId != -1 && zielpositionSpielsteinId != id) {
                return false;
            }
        }
        return true;
    }



    spielsteinBewegen(richtung) {
        let zielposition = this.bekommeZielPosition(this.aktivePosition, richtung);
        const spielsteinId = this.bekommeSpielsteinIdVonPosition(this.aktivePosition);
        if (this.zielImGleichenStein(spielsteinId, zielposition)) {
            zielposition = this.bekommeZielPosition(zielposition, richtung);
        }
        if (this.positionImSpielfeld(zielposition)) {
            for (let s of this.spielsteine) {
                if (s.id == spielsteinId) {                    
                    if (this.verschiebbar(s.id, s.positionen, richtung)) {
                        for (let i = 0; i < s.groesse; i++) {
                            s.positionen[i] = this.bekommeZielPosition(s.positionen[i], richtung);
                        }
                        this.neuZeichnen();      
                    }
                }
            }
        }    
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
            this.spielsteine.push(new Spielstein(i, 
                                    this.kantenlaenge / 4,
                                    spielsteine[i],
                                    startkonstellation[i][level]));                        
        }
    }

    neuZeichnen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.zeichnen(0, 0);
    }

    zeichnen() {
        const startX = (canvas.width - this.kantenlaenge) / 2;
        const startY = (canvas.height - this.kantenlaenge) / 2;

        for (const r of this.rand) {
            r.zeichnen(startX, startY);
        }
        
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

        for (const s of this.spielsteine) {
            s.zeichnen(startX, startY);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const spielfeld = new Spielfeld(600);
    spielfeld.zeichnen();
}); 