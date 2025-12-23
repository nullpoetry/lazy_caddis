// gassed_indicator.c : Compiles to WASM using Clang --target=wasm32-wasi
#include <stdint.h>

// Assumes a shared memory buffer managed by p5.js/Mojo
extern uint32_t* screen_buffer; 
extern int SCREEN_WIDTH;

// The color of the bubble (silvery white: RRGGBB)
#define BUBBLE_COLOR 0xFFD700FF // Gold nugget color for the 'jeweler' look

void render_gassed_indicator(int status_on) {
    if (!status_on) return;

    // Position the bubble at the 'head' of the caddis case
    int start_x = 50;
    int start_y = 50;

    // Simple 3x3 pixel cluster (the 'jeweler's inset')
    for (int dy = 0; dy < 3; dy++) {
        for (int dx = 0; dx < 3; dx++) {
            int x = start_x + dx;
            int y = start_y + dy;
            if (x >= 0 && x < SCREEN_WIDTH) {
                // Set the pixel color directly in the memory buffer
                screen_buffer[y * SCREEN_WIDTH + x] = BUBBLE_COLOR;
            }
        }
    }
}
