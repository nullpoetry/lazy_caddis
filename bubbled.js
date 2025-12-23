// caddis_lazy_view.js (Runs in the Browser via <script type="module">)

import p5 from 'p5';
import DOMPurify from 'dompurify'; // Essential v3.2.4+ patch

// Define the size of our 'caddis cases' (the tiles)
const TILE_SIZE = 64; 

// --- WASM BRIDGE ---
// Assumed WASM Module functions (must be defined when linking the C/Mojo WASM)
// We need a way to access the shared memory buffer from JS to C and back.
// In a real Emscripten environment, you would use Module._function_name or ccall/cwrap.
// For this example, we mock the call:
const render_gassed_indicator_wasm = (status_on) => {
    // In a real app, this calls your compiled C code directly within the WASM sandbox.
    console.log(`WASM Module called: rendering gassed indicator status: ${status_on}`);
    // Your C code (gassed_indicator.c) manipulates a shared pixel buffer.
};

const sketch = (p) => {
    let tiles = [];
    p.setup = () => {
        p.createCanvas(800, 600).parent('canvas-container');
        p.noSmooth(); // Keep the crisp 90s CAD look
        generateTiles(800, 600);
    };
    
    p.draw = () => {
        p.background(50); // Dark gray CAD background
        // Render the "Damascene" grid (the base Cased Caddis logic)
        for (let tile of tiles) {
            // Simplified rendering for the CAD view
            p.stroke(20);
            p.fill(80);
            p.rect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
        }

        // Check the status of the worker node
        const node_is_active = true; // Placeholder from your nuloomshell status
        if (node_is_active) {
            // Call the C WASM function to "draw the bubble"
            render_gassed_indicator_wasm(1); 
            
            // --- The "Jeweler" Inset (Manual JS for visual confirmation) ---
            // The 3x3 or 4x3 pixel cluster logic
            const status_color = p.color(255, 215, 0); // Gold nugget color
            const cluster_size = 3; // Using your 3x3 size

            // This is the manual JS rendering of the C code output
            p.push();
            p.translate(50, 50); // The position from your C code
            for (let dy = 0; dy < cluster_size; dy++) {
                for (let dx = 0; dx < cluster_size; dx++) {
                    p.fill(status_color);
                    // Use a specific pixel size for a retro CAD look
                    p.noStroke();
                    p.rect(dx * 4, dy * 4, 4, 4); 
                }
            }
            p.pop();

            // Add a sanitized label for compliance
            const status_label = DOMPurify.sanitize("Status: Gassed Up (Shield Active)", {USE_PROFILES: {html: true}});
            p.fill(255);
            p.text(status_label, 50, 100);
        }
    };
    
    function generateTiles(width, height) {
        for (let y = 0; y < height; y += TILE_SIZE) {
            for (let x = 0; x < width; x += TILE_SIZE) {
                tiles.push({ x: x, y: y, state: 0 }); // Base state
            }
        }
    }
};

// Mount the sketch
new p5(sketch);
