// src/modulos/equipos/perfilesFisicosPorDeporte.js

/**
 * Mapa de perfiles físicos recomendados por deporte y posición.
 *
 * La idea NO es ser perfecto a nivel científico, sino proporcionar
 * una base razonable para generación automática de rutinas:
 *   - velocidad
 *   - resistencia
 *   - potencia
 *   - fuerza_general
 *   - fuerza_maxima
 *   - agilidad
 *   - equilibrio
 *   - movilidad
 *   - coordinacion
 *   - estabilidad_tronco
 *   - salto
 *   - capacidad_aerobica
 *   - capacidad_anaerobica
 *   - precision
 *   - flexibilidad
 *   - tecnica_especifica
 */

const PERFILES_FISICOS_POR_DEPORTE = {
  // ─────────────────────────────────────────────
  // FUTBOL
  // ─────────────────────────────────────────────
  futbol: {
    "portero": ["reflejos", "potencia_piernas", "movilidad", "salto", "estabilidad_tronco"],
    "defensa central": ["fuerza_general", "cambios_direccion", "capacidad_aerobica", "estabilidad_tronco"],
    "lateral derecho": ["velocidad", "resistencia", "cambios_direccion", "capacidad_aerobica"],
    "lateral izquierdo": ["velocidad", "resistencia", "cambios_direccion", "capacidad_aerobica"],
    "carrilero derecho": ["velocidad", "resistencia", "capacidad_aerobica", "agilidad"],
    "carrilero izquierdo": ["velocidad", "resistencia", "capacidad_aerobica", "agilidad"],
    "pivote defensivo": ["resistencia", "capacidad_aerobica", "fuerza_general", "agilidad"],
    "centrocampista mixto": ["resistencia", "capacidad_aerobica", "agilidad", "potencia"],
    "mediapunta": ["aceleracion", "agilidad", "potencia", "coordinacion"],
    "extremo derecho": ["velocidad", "aceleracion", "cambios_direccion", "agilidad"],
    "extremo izquierdo": ["velocidad", "aceleracion", "cambios_direccion", "agilidad"],
    "delantero centro": ["potencia", "aceleracion", "fuerza_general", "salto"],
    "segundo delantero": ["velocidad", "aceleracion", "agilidad", "coordinacion"],
  },

  // ─────────────────────────────────────────────
  // FUTBOL SALA
  // ─────────────────────────────────────────────
  futbol_sala: {
    "portero": ["reflejos", "agilidad", "movilidad", "salto_lateral", "estabilidad_tronco"],
    "cierro": ["fuerza_general", "cambios_direccion", "resistencia"],
    "ala derecha": ["velocidad", "aceleracion", "agilidad"],
    "ala izquierda": ["velocidad", "aceleracion", "agilidad"],
    "pívot": ["fuerza_general", "potencia", "equilibrio"],
  },

  // ─────────────────────────────────────────────
  // BALONCESTO
  // ─────────────────────────────────────────────
  baloncesto: {
    "base": ["velocidad", "agilidad", "resistencia", "coordinacion"],
    "escolta": ["salto", "agilidad", "velocidad", "capacidad_anaerobica"],
    "alero": ["fuerza_general", "salto", "velocidad"],
    "ala-pívot": ["fuerza_general", "fuerza_maxima", "salto", "estabilidad_tronco"],
    "pívot": ["fuerza_maxima", "fuerza_general", "equilibrio", "estabilidad_tronco"],
  },

  // ─────────────────────────────────────────────
  // BALONMANO
  // ─────────────────────────────────────────────
  balonmano: {
    "portero": ["reflejos", "salto_lateral", "movilidad", "estabilidad_tronco"],
    "central": ["resistencia", "cambios_direccion", "agilidad"],
    "lateral izquierdo": ["potencia", "salto", "fuerza_general"],
    "lateral derecho": ["potencia", "salto", "fuerza_general"],
    "extremo izquierdo": ["velocidad", "aceleracion", "salto"],
    "extremo derecho": ["velocidad", "aceleracion", "salto"],
    "pivote": ["fuerza_general", "equilibrio", "estabilidad_tronco"],
  },

  // ─────────────────────────────────────────────
  // VOLEIBOL
  // ─────────────────────────────────────────────
  voleibol: {
    "líbero": ["agilidad", "reflejos", "movilidad", "cambios_direccion"],
    "colocador": ["coordinacion", "agilidad", "resistencia"],
    "central": ["salto", "fuerza_general", "potencia"],
    "opuesto": ["salto", "potencia", "fuerza_general"],
    "receptor": ["salto", "agilidad", "resistencia"],
    "punta": ["salto", "velocidad", "potencia"],
  },

  // ─────────────────────────────────────────────
  // HOCKEY HIERBA
  // ─────────────────────────────────────────────
  hockey_hierba: {
    "portero": ["reflejos", "movilidad", "estabilidad_tronco"],
    "defensa central": ["fuerza_general", "resistencia", "cambios_direccion"],
    "lateral derecho": ["velocidad", "resistencia", "agilidad"],
    "lateral izquierdo": ["velocidad", "resistencia", "agilidad"],
    "medio centro": ["resistencia", "capacidad_aerobica", "cambios_direccion"],
    "interior": ["resistencia", "agilidad", "coordinacion"],
    "delantero": ["velocidad", "aceleracion", "potencia"],
  },

  // ─────────────────────────────────────────────
  // HOCKEY HIELO
  // ─────────────────────────────────────────────
  hockey_hielo: {
    "portero": ["reflejos", "movilidad", "equilibrio"],
    "defensa izquierdo": ["fuerza_general", "resistencia", "equilibrio"],
    "defensa derecho": ["fuerza_general", "resistencia", "equilibrio"],
    "ala izquierda": ["velocidad", "aceleracion", "cambios_direccion"],
    "ala derecha": ["velocidad", "aceleracion", "cambios_direccion"],
    "centro": ["resistencia", "capacidad_aerobica", "agilidad"],
  },

  // ─────────────────────────────────────────────
  // BEISBOL
  // ─────────────────────────────────────────────
  beisbol: {
    "lanzador": ["fuerza_general", "movilidad", "precision", "estabilidad_tronco"],
    "receptor": ["fuerza_general", "movilidad", "resistencia"],
    "primera base": ["fuerza_general", "equilibrio"],
    "segunda base": ["agilidad", "cambios_direccion", "coordinacion"],
    "tercera base": ["agilidad", "fuerza_general"],
    "shortstop": ["agilidad", "cambios_direccion", "coordinacion"],
    "jardinero izquierdo": ["velocidad", "resistencia"],
    "jardinero central": ["velocidad", "resistencia"],
    "jardinero derecho": ["velocidad", "resistencia"],
    "bateador designado": ["potencia", "fuerza_general"],
  },

  // ─────────────────────────────────────────────
  // SOFTBOL
  // ─────────────────────────────────────────────
  softbol: {
    "lanzador": ["fuerza_general", "movilidad", "precision"],
    "receptor": ["fuerza_general", "movilidad", "resistencia"],
    "primera base": ["fuerza_general", "equilibrio"],
    "segunda base": ["agilidad", "coordinacion"],
    "tercera base": ["agilidad", "fuerza_general"],
    "shortstop": ["agilidad", "cambios_direccion"],
    "jardinero izquierdo": ["velocidad", "resistencia"],
    "jardinero central": ["velocidad", "resistencia"],
    "jardinero derecho": ["velocidad", "resistencia"],
  },

  // ─────────────────────────────────────────────
  // FUTBOL AMERICANO
  // ─────────────────────────────────────────────
  futbol_americano: {
    quarterback: ["precision", "estabilidad_tronco", "agilidad"],
    "running back": ["potencia", "aceleracion", "fuerza_general"],
    fullback: ["fuerza_general", "fuerza_maxima", "potencia"],
    "wide receiver": ["velocidad", "aceleracion", "agilidad"],
    "tight end": ["fuerza_general", "potencia"],
    "offensive tackle": ["fuerza_maxima", "fuerza_general"],
    "offensive guard": ["fuerza_maxima", "fuerza_general"],
    center: ["fuerza_general", "estabilidad_tronco"],
    "defensive end": ["fuerza_general", "potencia"],
    "defensive tackle": ["fuerza_maxima", "fuerza_general"],
    linebacker: ["fuerza_general", "resistencia", "cambios_direccion"],
    cornerback: ["velocidad", "aceleracion", "agilidad"],
    safety: ["velocidad", "resistencia", "cambios_direccion"],
    kicker: ["precision", "movilidad", "equilibrio"],
    punter: ["precision", "movilidad", "equilibrio"],
  },

  // ─────────────────────────────────────────────
  // RUGBY
  // ─────────────────────────────────────────────
  rugby: {
    "pilar izquierdo": ["fuerza_maxima", "fuerza_general", "estabilidad_tronco"],
    "pilar derecho": ["fuerza_maxima", "fuerza_general", "estabilidad_tronco"],
    talonador: ["fuerza_general", "equilibrio"],
    "segunda línea": ["fuerza_general", "resistencia"],
    "tercera línea ala": ["resistencia", "velocidad", "cambios_direccion"],
    "tercera línea centro": ["fuerza_general", "resistencia"],
    "medio melé": ["agilidad", "velocidad", "coordinacion"],
    apertura: ["coordinacion", "resistencia"],
    "centro interior": ["fuerza_general", "velocidad"],
    "centro exterior": ["fuerza_general", "velocidad"],
    ala: ["velocidad", "aceleracion"],
    zaguero: ["velocidad", "resistencia"],
  },

  // ─────────────────────────────────────────────
  // CICLISMO
  // ─────────────────────────────────────────────
  ciclismo: {
    sprinter: ["potencia_piernas", "aceleracion", "capacidad_anaerobica"],
    rodador: ["capacidad_aerobica", "resistencia"],
    escalador: ["capacidad_aerobica", "fuerza_resistencia"],
    contrarrelojista: ["capacidad_aerobica", "estabilidad_tronco"],
    clasicómano: ["resistencia", "fuerza_resistencia"],
    gregario: ["resistencia", "capacidad_aerobica"],
  },

  // ─────────────────────────────────────────────
  // ATLETISMO
  // ─────────────────────────────────────────────
  atletismo: {
    velocista: ["velocidad", "aceleracion", "potencia_piernas"],
    "medio fondista": ["capacidad_aerobica", "capacidad_anaerobica"],
    fondista: ["resistencia", "capacidad_aerobica"],
    saltador: ["salto", "potencia_piernas", "fuerza_general"],
    lanzador: ["fuerza_maxima", "potencia", "estabilidad_tronco"],
    marchador: ["resistencia", "capacidad_aerobica"],
    vallista: ["velocidad", "coordinacion", "agilidad"],
  },

  // ─────────────────────────────────────────────
  // NATACION
  // ─────────────────────────────────────────────
  natacion: {
    libre: ["capacidad_aerobica", "capacidad_anaerobica", "fuerza_general"],
    espalda: ["fuerza_general", "capacidad_aerobica"],
    braza: ["fuerza_general", "coordinacion"],
    mariposa: ["fuerza_general", "potencia", "capacidad_anaerobica"],
    estilos: ["resistencia", "tecnica_especifica"],
  },

  // ─────────────────────────────────────────────
  // BOXEO
  // ─────────────────────────────────────────────
  boxeo: {
    "peso mosca": ["velocidad", "capacidad_anaerobica", "agilidad"],
    "peso gallo": ["velocidad", "capacidad_anaerobica", "agilidad"],
    "peso pluma": ["velocidad", "resistencia", "agilidad"],
    "peso ligero": ["resistencia", "capacidad_anaerobica"],
    "peso welter": ["fuerza_general", "resistencia"],
    "peso medio": ["fuerza_general", "resistencia"],
    "peso semipesado": ["fuerza_general", "fuerza_maxima"],
    "peso pesado": ["fuerza_maxima", "fuerza_general"],
  },

  // ─────────────────────────────────────────────
  // MMA
  // ─────────────────────────────────────────────
  mma: {
    striker: ["capacidad_anaerobica", "velocidad", "potencia"],
    wrestler: ["fuerza_general", "fuerza_maxima", "resistencia"],
    grappler: ["fuerza_general", "estabilidad_tronco"],
    "jiu-jitsu": ["fuerza_general", "flexibilidad", "estabilidad_tronco"],
    "all-rounder": ["resistencia", "fuerza_general", "capacidad_anaerobica"],
  },

  // ─────────────────────────────────────────────
  // JUDO, TAEKWONDO, KARATE, LUCHA (combate)
  // ─────────────────────────────────────────────
  judo: {
    "categorías por peso": ["fuerza_general", "resistencia", "estabilidad_tronco"],
    "tachi-waza": ["agilidad", "equilibrio", "fuerza_general"],
    "ne-waza": ["fuerza_general", "estabilidad_tronco", "flexibilidad"],
  },

  taekwondo: {
    "categorías por peso": ["velocidad", "capacidad_anaerobica"],
    "luchador técnico": ["equilibrio", "coordinacion", "velocidad"],
    "luchador explosivo": ["potencia", "aceleracion", "capacidad_anaerobica"],
  },

  karate: {
    kumite: ["velocidad", "capacidad_anaerobica", "agilidad"],
    kata: ["flexibilidad", "coordinacion", "control_cuerpo"],
  },

  lucha: {
    grecorromana: ["fuerza_general", "fuerza_maxima", "estabilidad_tronco"],
    libre: ["fuerza_general", "resistencia"],
    "categorías por peso": ["fuerza_general", "resistencia"],
  },

  // ─────────────────────────────────────────────
  // OTROS (resumen genérico pero útil)
  // ─────────────────────────────────────────────

  padel: {
    drive: ["agilidad", "velocidad", "coordinacion"],
    "revés": ["agilidad", "velocidad", "coordinacion"],
  },

  tenis: {
    singles: ["velocidad", "agilidad", "capacidad_anaerobica"],
    dobles: ["agilidad", "coordinacion"],
    "servidor-volador": ["potencia", "salto", "velocidad"],
    "revés una mano": ["coordinacion", "estabilidad_tronco"],
    "revés dos manos": ["fuerza_general", "coordinacion"],
  },

  badminton: {
    singles: ["velocidad", "agilidad", "capacidad_anaerobica"],
    dobles: ["agilidad", "coordinacion"],
    "dobles mixtos": ["agilidad", "coordinacion"],
  },

  waterpolo: {
    portero: ["reflejos", "potencia_piernas", "movilidad"],
    boya: ["fuerza_general", "estabilidad_tronco"],
    defensa: ["resistencia", "fuerza_general"],
    exterior: ["resistencia", "velocidad"],
    lateral: ["resistencia", "velocidad"],
    delantero: ["potencia", "velocidad"],
  },

  triatlon: {
    nadador: ["capacidad_aerobica", "fuerza_resistencia"],
    ciclista: ["capacidad_aerobica", "fuerza_resistencia"],
    corredor: ["resistencia", "capacidad_aerobica"],
    "all-around": ["resistencia", "capacidad_aerobica"],
  },

  halterofilia: {
    arrancada: ["fuerza_maxima", "potencia", "movilidad"],
    "dos tiempos": ["fuerza_maxima", "potencia", "movilidad"],
    "categorías por peso": ["fuerza_maxima", "potencia"],
  },

  // Para el resto de deportes más "especiales" o técnicos
  // puedes ir afinando más adelante si ves que es necesario.
};

/**
 * Helper para obtener enfoques físicos de forma segura.
 * Devuelve [] si no hay deporte o posición configurados.
 */
const obtenerEnfoquesFisicos = (deporte, posicion) => {
  if (!deporte || !posicion) return [];

  const deporteKey = String(deporte).toLowerCase();
  const posicionKey = String(posicion).toLowerCase();

  const mapaDeporte = PERFILES_FISICOS_POR_DEPORTE[deporteKey];
  if (!mapaDeporte) return [];

  const enfoques = mapaDeporte[posicionKey];
  if (!Array.isArray(enfoques)) return [];

  return enfoques;
};

module.exports = {
  PERFILES_FISICOS_POR_DEPORTE,
  obtenerEnfoquesFisicos,
};
