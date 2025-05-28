<?php
    if (isset($_POST['pw'])) {
        if (htmlspecialchars($_POST['pw']) == '*********') {
            
            echo "

            <style>
                canvas {
                    border: 1px solid black;
                }
            </style>
            
            <canvas id='meinCanvas' width='800' height='800'></canvas>'
            <script src='raetsel.js'></script>    

            ";

        } else {
            echo "Falsches Passwort übermittelt.";
        };
    } else {
        echo "Kein Passwort übermittelt.";
    }
?>
