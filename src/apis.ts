// apis.js
// Archivo con URLs de APIs gratuitas útiles para tu bot de WhatsApp

// -----------------------
// 1️⃣ Divertidas / Entretenimiento
// -----------------------

// Devuelve chistes de varias categorías (programación, misc, etc.)
export const JOKE_API = "https://v2.jokeapi.dev/joke/Any";

// Devuelve consejos random
export const ADVICE_API = "https://api.adviceslip.com/advice";

// Devuelve datos curiosos sobre gatos
export const CAT_FACTS_API = "https://catfact.ninja/fact";

// Devuelve imágenes aleatorias de perros
export const DOG_CEO_API = "https://dog.ceo/api/breeds/image/random";

// Curiosidades sobre números (fechas, matemáticas, trivia)
export const NUMBERS_API = "http://numbersapi.com/random";

// -----------------------
// 2️⃣ Información / Datos útiles
// -----------------------

// Información completa de países (capital, población, moneda, etc.)
export const REST_COUNTRIES_API = "https://restcountries.com/v3.1/all";

// Clima actual y pronóstico (requiere API Key gratuita)
export const OPEN_WEATHER_MAP_API = "https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}";

// Días festivos por país
export const PUBLIC_HOLIDAY_API = "https://date.nager.at/Api/v2/PublicHolidays/{YEAR}/{COUNTRY_CODE}";

// Información geográfica (ciudades, países, códigos postales)
export const GEONAMES_API = "http://api.geonames.org/{SERVICE}?username={USERNAME}&{PARAMS}";

// -----------------------
// 3️⃣ Noticias / Actualidad
// -----------------------

// Noticias por país y categoría (requiere API Key gratuita)
export const NEWS_API = "https://newsapi.org/v2/top-headlines?country={COUNTRY}&apiKey={API_KEY}";

// Noticias del diario The Guardian
export const GUARDIAN_API = "https://content.guardianapis.com/search?api-key={API_KEY}";

// Noticias en tiempo real
export const CURRENTS_API = "https://api.currentsapi.services/v1/latest-news?apiKey={API_KEY}";

// -----------------------
// 4️⃣ Curiosidades / Cultura general
// -----------------------

// Preguntas de trivia / quiz
export const OPEN_TRIVIA_API = "https://opentdb.com/api.php?amount=1";

// Simula mazos de cartas (ideal juegos o trivias)
export const DECK_OF_CARDS_API = "https://deckofcardsapi.com/api/deck/new/draw/?count=1";

// Información sobre Pokémon
export const POKEAPI = "https://pokeapi.co/api/v2/pokemon/{POKEMON_NAME}";

// -----------------------
// 5️⃣ Utilidades / Prácticas
// -----------------------

// Detecta ubicación por IP
export const IP_GEOLOCATION_API = "http://ip-api.com/json/{IP_ADDRESS}";

// Genera códigos QR
export const QR_CODE_API = "https://api.qrserver.com/v1/create-qr-code/?data={TEXT}&size=150x150";

// Cotización de monedas
export const EXCHANGE_RATE_API = "https://api.exchangerate.host/latest?base={BASE}&symbols={SYMBOLS}";

// Definiciones, sinónimos, antónimos
export const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/{WORD}";
