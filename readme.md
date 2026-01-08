# Minecraft Village Simulator (Browser Edition)

Live Demo: Click here to play

A Minecraft-inspired village simulator built entirely in Three.js.
Explore an infinite procedural terrain, fly in spectator mode, and watch villages with villagers, paths, trees, and fences come to life.

## 🎯 Features
## Terrain

- Procedurally generated hills and mountains

- Instanced blocks for high performance

- Grass, dirt, stone blocks

- Biome variations: plains, desert, snow

## Villages

- Procedurally placed villages per chunk

- Houses with sloped roofs, doors, and windows

- Paths connecting houses

- Fences surrounding village boundaries

- Trees generated around villages

## Villagers

Small cube entities representing villagers

- Path-following AI

- Enter and exit houses properly

- Avoid walking through walls

- Random wandering along village paths

## Camera & Controls

- Spectator camera (fly freely, no player model)

- WASD movement + Space (up) / Shift (down)

- Pointer-lock mouse look

## Visual Enhancements

- Subtle bloom/blur effect for softer block edges

- Lighting with directional sunlight and ambient light

## HUD

- FPS counter

- Camera position (x, y, z)

- Loaded chunk count

- Village count

- Random status text

## 🛠️ Installation
### Option 1: GitHub
```
Clone the repository: 

git clone https://github.com/attendance1978-wq/minecraft-village-simulator.git |


Open index.html in a modern browser (Chrome, Edge, Firefox). |

Note: Modules require serving over HTTP if loading locally. Use Live Server or any static server.

Option 2: Download ZIP

Download the ZIP of the repository from GitHub

Extract and open index.html in a modern browser

🕹️ Controls
Action	Key / Mouse
Move forward	W
Move backward	S
Move left	A
Move right	D
Move up	Space
Move down	Shift
Look around	Mouse movement
Lock pointer	Click on screen
⚙️ File Structure
/ (root)
│ index.html       # Main HTML page
│ style.css        # HUD styling
│ main.js          # Three.js scene, terrain, villages, villagers, AI
│ README.md        # This file

📦 Dependencies

Three.js
 (r158)

Stats.js
 (FPS monitoring)

Three.js post-processing modules:

EffectComposer

RenderPass

UnrealBloomPass

All dependencies are included via CDN in index.html.

🔮 Notes

Render distance is limited (RENDER_DISTANCE = 3) for performance

Villagers’ path-following AI is simplified for the browser

Biomes affect grass color and tree color

Terrain and villages are fully procedural; reloading generates a new world

🚀 Future Improvements

Villager animations (walking legs, idle gestures)

House interiors with furniture

Smooth terrain LOD (level-of-detail) for larger render distances

Dynamic day/night cycle and shadows

More biomes (forest, swamp, plains, desert variations)

📸 Screenshots

(Add screenshots or GIFs of villages, villagers, and terrain in action here)

🖥️ Live Demo

Open in a browser via GitHub Pages:

https://YOUR_USERNAME.github.io/minecraft-village-simulator/


Make sure to replace YOUR_USERNAME with your GitHub username.

License

This project is open-source and free to use.
Credit to Three.js for the 3D engine.
