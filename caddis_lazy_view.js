// caddis_lazy_view.js (Runs in the Browser via <script type="module">)

import p5 from 'p5';

// Define the size of our 'caddis cases' (the tiles)
const TILE_SIZE = 64; 

// This function will be provided by your Mojo/C WASM module
// extern uint32_t render_caddis_case(int x, int y, int size, int state);
// We assume a JS function wraps the WASM call:
const render_caddis_case_wasm = (x, y, s, state) => {
    // Call to your compiled C/Mojo WASM here to get pixel data
    // Return a canvas or image data
    // console.log(`Rendering case at ${x}, ${y}`); 
    return null; 
};


const sketch = (p) => {
    let tiles = [];
    p.setup = () => {
        const container = p.createCanvas(p.windowWidth, p.windowHeight).parent('canvas-container');
        // Setup a large, virtual area that we will scroll through
        p.select('canvas').style('overflow', 'scroll'); 
        p.noSmooth(); // Keep the crisp 90s look
        generateTiles(1000, 1000); // Generate a 1000x1000 grid of potential tiles

        // *** The Lazy Load Observer ***
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tile = tiles[entry.target.dataset.id];
                    // Call the WASM function ONLY when the tile is visible
                    render_caddis_case_wasm(tile.x, tile.y, TILE_SIZE, tile.state);
                    observer.unobserve(entry.target); // Stop observing once rendered
                }
            });
        }, { root: document.querySelector('#canvas-container') });

        // Observe all tile placeholders
        tiles.forEach((tile, index) => {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.left = `${tile.x}px`;
            el.style.top = `${tile.y}px`;
            el.style.width = `${TILE_SIZE}px`;
            el.style.height = `${TILE_SIZE}px`;
            el.dataset.id = index;
            document.getElementById('canvas-container').appendChild(el);
            observer.observe(el);
        });
    };
    
    // Function to simulate a large grid of potential cased caddis nodes
    function generateTiles(width, height) {
        for (let y = 0; y < height; y += TILE_SIZE) {
            for (let x = 0; x < width; x += TILE_SIZE) {
                tiles.push({ x: x, y: y, state: p.random([0,1,2,3,4]) }); // 0-4 states
            }
        }
    }
};

new p5(sketch);
