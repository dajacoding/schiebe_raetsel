export const farben = {
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
}

export const farbMap = {
    '0,0': 'rot', '0,1': 'orange', '0,2': 'gelb', '0,3': 'limone',
    '1,0': 'orange'                             , '1,3': 'azur',
    '2,0': 'gelb'                               , '2,3': 'blau',
    '3,0': 'gruen', '3,1': 'azur', '3,2': 'blau', '3,3': 'lila'
}

export const spielsteine = {
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

export const startkonstellation = {
    0: [[0, 0]],
    1: [[0, 1]],
    2: [[1, 2]],
    3: [[2, 0]],
    4: [[1, 3]],
    5: [[3, 0]],
    6: [[2, 2]],
    // der graue
    7: [[0, 2]]
}

export const zielkonstellation = {
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

export function bekommeFarbe(pos) {
    gesucht = farbMap[pos.join(',')] || 'schwarz';
    return farben[gesucht];
}