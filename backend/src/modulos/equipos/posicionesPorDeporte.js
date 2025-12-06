// src/modules/equipo/posicionesPorDeporte.js

// Mapa de posiciones permitidas por deporte
// La clave debe coincidir con cómo guardas equipo.deporte (en minúsculas, snake_case, etc.)
const POSICIONES_POR_DEPORTE = {
  futbol: [
    "portero",
    "defensa central",
    "lateral derecho",
    "lateral izquierdo",
    "carrilero derecho",
    "carrilero izquierdo",
    "pivote defensivo",
    "centrocampista mixto",
    "mediapunta",
    "extremo derecho",
    "extremo izquierdo",
    "delantero centro",
    "segundo delantero",
  ],

  futbol_sala: ["portero", "cierro", "ala derecha", "ala izquierda", "pívot"],

  baloncesto: ["base", "escolta", "alero", "ala-pívot", "pívot"],

  balonmano: [
    "portero",
    "central",
    "lateral izquierdo",
    "lateral derecho",
    "extremo izquierdo",
    "extremo derecho",
    "pivote",
  ],

  voleibol: ["líbero", "colocador", "central", "opuesto", "receptor", "punta"],

  hockey_hierba: [
    "portero",
    "defensa central",
    "lateral derecho",
    "lateral izquierdo",
    "medio centro",
    "interior",
    "delantero",
  ],

  hockey_hielo: [
    "portero",
    "defensa izquierdo",
    "defensa derecho",
    "ala izquierda",
    "ala derecha",
    "centro",
  ],

  beisbol: [
    "lanzador",
    "receptor",
    "primera base",
    "segunda base",
    "tercera base",
    "shortstop",
    "jardinero izquierdo",
    "jardinero central",
    "jardinero derecho",
    "bateador designado",
  ],

  softbol: [
    "lanzador",
    "receptor",
    "primera base",
    "segunda base",
    "tercera base",
    "shortstop",
    "jardinero izquierdo",
    "jardinero central",
    "jardinero derecho",
  ],

  futbol_americano: [
    "quarterback",
    "running back",
    "fullback",
    "wide receiver",
    "tight end",
    "offensive tackle",
    "offensive guard",
    "center",
    "defensive end",
    "defensive tackle",
    "linebacker",
    "cornerback",
    "safety",
    "kicker",
    "punter",
  ],

  rugby: [
    "pilar izquierdo",
    "pilar derecho",
    "talonador",
    "segunda línea",
    "tercera línea ala",
    "tercera línea centro",
    "medio melé",
    "apertura",
    "centro interior",
    "centro exterior",
    "ala",
    "zaguero",
  ],

  cricket: ["bateador", "lanzador rápido", "lanzador spin", "wicket-keeper", "fielder"],

  waterpolo: ["portero", "boya", "defensa", "exterior", "lateral", "delantero"],

  polo: ["número 1", "número 2", "número 3", "número 4"],

  tenis: [
    "singles",
    "dobles",
    "servidor-volador",
    "revés una mano",
    "revés dos manos",
  ],

  padel: ["drive", "revés"],

  badminton: ["singles", "dobles", "dobles mixtos"],

  ciclismo: [
    "sprinter",
    "rodador",
    "escalador",
    "contrarrelojista",
    "clasicómano",
    "gregario",
  ],

  atletismo: [
    "velocista",
    "medio fondista",
    "fondista",
    "saltador",
    "lanzador",
    "marchador",
    "vallista",
  ],

  natacion: ["libre", "espalda", "braza", "mariposa", "estilos"],

  boxeo: [
    "peso mosca",
    "peso gallo",
    "peso pluma",
    "peso ligero",
    "peso welter",
    "peso medio",
    "peso semipesado",
    "peso pesado",
  ],

  mma: ["striker", "wrestler", "grappler", "jiu-jitsu", "all-rounder"],

  judo: ["categorías por peso", "tachi-waza", "ne-waza"],

  taekwondo: ["categorías por peso", "luchador técnico", "luchador explosivo"],

  karate: ["kumite", "kata"],

  esgrima: ["florete", "sable", "espada"],

  remo: ["timón", "proel", "remero de babor", "remero de estribor", "skiff"],

  surf: ["goofy", "regular", "longboarder", "shortboarder"],

  skateboarding: ["street", "park", "rider técnico", "rider de transiciones"],

  motociclismo: ["piloto", "copiloto (sidecar)", "probador"],

  formula1: ["piloto", "piloto reserva", "tester"],

  golf: ["drive specialist", "putter specialist", "all-around"],

  tiro_arco: ["recurvo", "compuesto"],

  tiro_olimpico: ["pistola", "rifle", "foso", "skeet"],

  patinaje_artistico: ["individual", "parejas", "danza"],

  patinaje_velocidad: ["sprint", "medio fondo", "fondo"],

  gimnasia_artistica: [
    "suelo",
    "barra fija",
    "anillas",
    "potro",
    "paralelas",
    "barra de equilibrio",
  ],

  gimnasia_ritmica: ["cinta", "aro", "mazas", "pelota", "cuerda"],

  halterofilia: ["arrancada", "dos tiempos", "categorías por peso"],

  triatlon: ["nadador", "ciclista", "corredor", "all-around"],

  escalada: ["bloque", "velocidad", "dificultad"],

  equitacion: ["salto de obstáculos", "doma", "concurso completo", "raid"],

  lucha: ["grecorromana", "libre", "categorías por peso"],

  // --- NUEVOS DEPORTES AÑADIDOS ----

  kickboxing: [
    "peso mosca",
    "peso gallo",
    "peso pluma",
    "peso ligero",
    "peso welter",
    "peso medio",
    "peso semipesado",
    "peso pesado",
    "kicker ofensivo",
    "kicker técnico",
  ],

  muay_thai: [
    "nak muay ofensivo",
    "nak muay técnico",
    "clinch fighter",
    "kicker",
    "rodillero",
    "codos especialista",
    "categorías por peso",
  ],

  snowboard: [
    "freestyle",
    "halfpipe",
    "slopestyle",
    "big air",
    "boardercross",
    "freeride",
  ],

  curling: ["lead", "second", "third (vice-skip)", "skip", "alternate"],
};

module.exports = POSICIONES_POR_DEPORTE;
