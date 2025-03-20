# Wyvern's Quest

A browser-based fantasy RPG with turn-based combat, crafting, and procedural dungeons.

## Features

- Character creation with 4 races and 4 classes
- Turn-based combat system
- Procedural dungeon generation
- Inventory and crafting system
- Quest tracking
- Save/load functionality

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wyverns-quest.git
cd wyverns-quest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## Tech Stack

- Frontend: Vanilla JavaScript, HTML5, CSS3
- Backend: Node.js with Express
- Database: MongoDB (coming in V3)

## Project Structure

```
wyverns-quest/
├── index.html          # Main game interface
├── styles.css         # Game styling
├── scripts/
│   ├── main.js       # Game state management
│   ├── character.js  # Character creation/management
│   ├── dungeon.js    # Dungeon generation
│   ├── combat.js     # Combat system
│   ├── inventory.js  # Inventory management
│   ├── quests.js     # Quest system
│   ├── audio.js      # Sound management
│   └── ui.js         # UI interactions
└── server.js         # Express server
```

## License

MIT
