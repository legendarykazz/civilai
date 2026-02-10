/**
 * Transportation Engineering Utility Functions
 */

/**
 * Calculate Stopping Sight Distance (SSD)
 * SSD = Reaction Distance + Braking Distance
 * dr = 0.278 * V * t
 * db = (V^2) / (254 * (f +/- G))
 * 
 * @param {number} speed - Design Speed (km/h)
 * @param {number} reactionTime - Perception-Reaction Time (sec) (default 2.5s)
 * @param {number} grade - Grade of road (decimal, e.g., 0.03 for 3%) (default 0)
 * @param {number} friction - Coefficient of friction (default 0.35)
 */
export const calculateSSD = (speed, reactionTime = 2.5, grade = 0, friction = 0.35) => {
    // Reaction Distance (dr) in meters
    const dr = 0.278 * speed * reactionTime;

    // Braking Distance (db) in meters
    // Formula: V^2 / (254 * (f + G))
    // Note: 254 is the constant for metric units (derived from 2 * g * conversion factors)
    const db = (Math.pow(speed, 2)) / (254 * (friction + grade));

    return {
        reactionDistance: dr,
        brakingDistance: db,
        totalSSD: dr + db
    };
};

/**
 * Calculate Super-elevation (e)
 * e + f = V^2 / (127 * R)
 * e = (V^2 / (127 * R)) - f
 * 
 * @param {number} speed - Design Speed (km/h)
 * @param {number} radius - Radius of curve (m)
 * @param {number} friction - Side friction factor (default 0.15)
 */
export const calculateSuperElevation = (speed, radius, friction = 0.15) => {
    const requiredE = (Math.pow(speed, 2) / (127 * radius)) - friction;

    // Convert to percentage
    return {
        superElevationDecimal: requiredE,
        superElevationPercent: requiredE * 100
    };
};
