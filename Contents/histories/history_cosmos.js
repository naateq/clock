// var hist:HistoryEvent[]
// https://en.wikipedia.org/wiki/Big_History
// https://en.wikipedia.org/wiki/Cosmic_Calendar
// Also see extinctions https://en.wikipedia.org/wiki/Extinction_event

var history_of_cosmos = {
    title:      'History of the Cosmos',
    begins:     '13.8 BYA',
    ends:       undefined,
    speed:      1800,
    eventList:  undefined
};
var histories = histories || {};
histories['cosmos'] = history_of_cosmos;

history_of_cosmos.eventList = [

    { render: true, year: '13.8 bya',    msg: 'Big Bang - Time and Space Begins', speed: 0 },
    { render: true, year: '12.85 bya',   msg: 'First Galaxies', speed: null },
    { render: true, year: '11 bya', msg: 'Milky Way Galaxy', speed: null },
    { render: true, year: '4.57 bya', msg: 'Solar System', speed: null },
    { render: true, year: '4.4 bya', msg: 'Oldest Rocks on Earth', speed: null },
    { render: true, year: '4.1 bya', msg: 'Biotic Material', speed: null },
    { render: true, year: '3.8 bya', msg: 'First Life', speed: null },
    { render: true, year: '3.4 bya', msg: 'Photosynthesis', speed: null },
    { render: true, year: '2.4 bya', msg: 'Oxygenation (Extinction)', speed: 0, url: 'https://en.wikipedia.org/wiki/Great_Oxygenation_Event#/media/File:Black-band_ironstone_(aka).jpg'},
    { render: true, year: '2 bya', msg: 'Eukaryotes (nucleus)', speed: null },
    { render: true, year: '800 mya', msg: 'Multicellular Life', speed: null },
    { render: true, year: '550 mya', msg: 'Anthropods (insects ancestors)', speed: null },
    { render: true, year: '500 mya', msg: 'Fish', speed: null },
    { render: true, year: '450 mya', msg: 'EXTINCTION-1: 70%; Gamma Rays+Other', speed: 0, url: '' },
    { render: true, year: '450 mya', msg: 'Land Plants', speed: null },
    { render: true, year: '400 mya', msg: 'Insects', speed: null },
    { render: true, year: '375 mya', msg: 'EXTINCTION-2: 70%; slow', speed: 0, url: '' },
    { render: true, year: '360 mya', msg: 'Amphibians (Frogs)', speed: null },
    { render: true, year: '300 mya', msg: 'Reptiles (Lizards, Snakes, Turtles)', speed: null },
    { render: true, year: '252 mya', msg: 'EXTINCTION-3: 96%; Low Oxygen', speed: 0, url: 'https://en.wikipedia.org/wiki/Permian%E2%80%93Triassic_extinction_event' },
    { render: true, year: '230 mya', msg: 'Dinosaurs', speed: null, url: 'https://en.wikipedia.org/wiki/Dinosaur#/media/File:Dinosauria_montage_2.jpg'},
    { render: true, year: '201 mya', msg: 'EXTINCTION-4: 70%; Volcanic activity', speed: null, url: '' },
    { render: true, year: '200 mya', msg: 'Mammals (Milk, Yogurt)', speed: null },
    { render: true, year: '150 mya', msg: 'Birds (Dinosaur birds) 10k living species', speed: null, url: 'https://en.wikipedia.org/wiki/Dinosaur#/media/File:Dino_bird_h.jpg' },
    { render: true, year: '130 mya', msg: 'Flowers', speed: null, url: 'https://en.wikipedia.org/wiki/Flower#/media/File:Flower_poster_2.jpg' },
    { render: true, year: '65 mya', msg: 'EXTINCTION-5: 75%; Meteorite + volcanic', speed: null },
    { render: true, year: '65 mya', msg: 'Primates', speed: null },
    { render: true, year: '15 mya', msg: 'Apes (Not Monkeys)', speed: null },
    
    { render: true, year: '12.3 mya', msg: 'Homonids', speed: null },
    { render: true, year: '2.5 mya', msg: 'REVOLUTION: Stone Tools', speed: 1 },
    { render: true, year: '400 kya', msg: 'REVOLUTION: Fire Domestication', speed: 1 },
    { render: true, year: '220 kya', msg: 'Modern Humans', speed: null },
    { render: true, year: '110 kya', msg: 'Global Glaciation - Ice Age', speed: null },
    { render: true, year: '35 kya', msg: 'Cave Painting', speed: null },
    { render: true, year: '10,500 bc', msg: 'End of Ice Age', speed: 1 },
    { render: true, year: '10,000 bc', msg: 'REVOLUTION: Agriculture', speed: 0 },
    { render: true, year: '6,300 bc', msg: 'Doggerland Flooding - Quiz', speed: 0, url:'https://www.google.com/maps/place/England,+UK/' },

    { render: true, year: '4,000 bc', msg: '', speed: 0 },
    { render: true, year: '3,500 bc', msg: 'REVOLUTION: Early Bronze Age', speed: 0 },
    { render: true, year: '3,000 bc', msg: 'Sumer, Egyp, Indus Valley - Gilgamesh', speed: 0 },
    { render: true, year: '2,500 bc', msg: 'REVOLUTION: Alphabets, Wheel, Akkadian Empire', speed: 0 },
    { render: true, year: '2,000 bc', msg: 'Hammurabi, Egyp Middle Kingdom', speed: 0 },
 
    { render: true, year: '1,500 bc', msg: 'REVOLUTION: Late Bronze Age', speed: 0 },
    { render: true, year: '1,000 bc', msg: 'REVOLUTION: Iron Age', speed: 0 },
    { render: true, year: '500 bc', msg: 'Age of Great Thinkers', speed: 0, notes: 'Buddha, Mahavira, Zoroaster, Confucius, Qin Dynasty, Classical Greece, Ashokan Empire, Vedas Completed, Euclidean geometry, Archimedean Physics, Roman Republic' },
    { render: true, year: '4 AD', msg: 'Christ, Roman Empire, Gupta Empire, Zero', speed: 0 },

    { render: true, year: '650 AD', msg: 'Islam, Byzantine, Song (China), Maya', speed: 0 },
    { render: true, year: '1250 AD', msg: 'Mongols Empire, ', speed: 0 },
    { render: true, year: '1492 AD', msg: 'America re-Discovered!', speed: 0 },
    { render: true, year: '1674 AD', msg: 'Marathas Empire', speed: 0 },

];
