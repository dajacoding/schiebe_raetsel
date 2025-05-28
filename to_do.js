// 
// 
//         

this.isDragging = false;
this.dragOffsetX = 0;
this.dragOffsetY = 0;
this.x = position[1] * kantenlaenge; // Aktuelle X-Position
this.y = position[0] * kantenlaenge; // Aktuelle Y-Position

this.addEventListeners();

// 


// 
// 
// 
// 
//     
     // Neue Methode zum Hinzufügen von Event-Listenern
     addEventListeners() {
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    // Neue Methode zum Behandeln des Mausklicks
    handleMouseDown(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isPointInside(mouseX, mouseY)) {
            this.isDragging = true;
            this.dragOffsetX = mouseX - this.x;
            this.dragOffsetY = mouseY - this.y;
        }
    }

    // Neue Methode zum Behandeln der Mausbewegung
    handleMouseMove(e) {
        if (this.isDragging) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.x = mouseX - this.dragOffsetX;
            this.y = mouseY - this.dragOffsetY;

            // Hier können Sie Grenzen für die Bewegung festlegen
            this.x = Math.max(0, Math.min(this.x, canvas.width - this.dimensionierung[1]));
            this.y = Math.max(0, Math.min(this.y, canvas.height - this.dimensionierung[0]));

            // Neuzeichnen des Canvas
            this.redrawCanvas();
        }
    }

    // Neue Methode zum Behandeln des Loslassens der Maus
    handleMouseUp() {
        this.isDragging = false;
    }

    // Neue Methode zur Überprüfung, ob ein Punkt innerhalb des Spielsteins liegt
    isPointInside(x, y) {
        return x >= this.x && x <= this.x + this.dimensionierung[1] &&
               y >= this.y && y <= this.y + this.dimensionierung[0];
    }

    // Neue Methode zum Neuzeichnen des Canvas
    redrawCanvas() {
        // Löschen Sie hier den gesamten Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Zeichnen Sie hier alle Spielsteine neu
        this.zeichnen(0, 0);
    }

// 
// 
// 
// 
// 
//   