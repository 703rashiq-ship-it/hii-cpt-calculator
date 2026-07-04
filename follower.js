// follower.js
const follower = document.getElementById('poke-follower');

// Track mouse and main figure
let mouseX = window.innerWidth / 3;
let mouseY = window.innerHeight / 3;
let currentX = window.innerWidth / 3;
let currentY = window.innerHeight / 3;
let isMouseMoving = false;

// --- TRAIL SETUP ---
const trailCount = 25; // How many dots make up the tail
const trails = [];

// Generate the trail elements dynamically
for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'poke-trail';
    document.body.appendChild(dot);
    
    // Store the element and its current position
    trails.push({
        element: dot,
        x: currentX,
        y: currentY
    });
}

// Update mouse coordinates
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!isMouseMoving) {
        follower.style.opacity = '1';
        trails.forEach(t => t.element.style.opacity = '1');
        isMouseMoving = true;
    }
});

// Hide everything if the mouse leaves the window
document.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
    trails.forEach(t => t.element.style.opacity = '0');
    isMouseMoving = false;
});

function animate() {
    const speed = 0.1; // Speed of the main figure
    
    // 1. Move the main figure towards the mouse
    currentX += (mouseX - currentX) * speed;
    currentY += (mouseY - currentY) * speed;
    
    const scaleX = (mouseX - currentX) < 0 ? -1 : 1;
    follower.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%)) scaleX(${scaleX})`;
    
    // 2. Move the trail dots
    // The first dot follows the main figure. The next dot follows the previous dot, and so on.
    let targetX = currentX;
    let targetY = currentY;
    
    trails.forEach((trail, index) => {
        // The dots move slightly faster than the main figure so they stay connected
        const trailSpeed = 0.6; 
        
        trail.x += (targetX - trail.x) * trailSpeed;
        trail.y += (targetY - trail.y) * trailSpeed;
        
        // Shrink and fade the dots the further back in the tail they are
        const sizeScale = 1 - (index / trailCount);
        const opacity = 1 - (index / trailCount);
        
        trail.element.style.transform = `translate(calc(${trail.x}px - 50%), calc(${trail.y}px - 50%)) scale(${sizeScale})`;
        // Only apply fading opacity if the mouse is on screen
        if (isMouseMoving) {
             trail.element.style.opacity = opacity;
        }
        
        // The current dot becomes the target for the next dot in the loop
        targetX = trail.x;
        targetY = trail.y;
    });
    
    requestAnimationFrame(animate);
}

// Start the loop
animate();
// --- FALLING PARTICLES (SIDES ONLY) ---

function spawnParticle() {
    // 1. Create the particle element
    const particle = document.createElement('div');
    particle.className = 'falling-particle';
    
    // 2. Decide if it falls on the left or right side
    const isLeft = Math.random() > 0.5;
    
    // 3. Calculate exact horizontal position
    // Left: between 0% and 15% of the screen width
    // Right: between 85% and 100% of the screen width
    const randomPosition = Math.random() * 15; 
    const xPos = isLeft ? randomPosition : (85 + randomPosition);
    
    particle.style.left = `${xPos}vw`;
    
    // 4. Randomize the fall speed and size so it looks natural
    const fallDuration = 4 + Math.random() * 5; // Takes 4 to 9 seconds to fall
    const scale = 0.5 + Math.random() * 1; // Random size between 0.5x and 1.5x
    
    particle.style.animationDuration = `${fallDuration}s`;
    particle.style.transform = `scale(${scale})`;
    
    // 5. Add to the webpage
    document.body.appendChild(particle);
    
    // 6. Clean up: Remove the particle from the HTML once it finishes falling
    // This is crucial to prevent the webpage from lagging over time
    setTimeout(() => {
        particle.remove();
    }, fallDuration * 1000);
}

// Spawn a new particle every 400 milliseconds
setInterval(spawnParticle, 400);
