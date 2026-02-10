/**
 * Geotechnical & Dams Engineering Utility Functions
 */

/**
 * Calculate forces on a Gravity Dam (Simplified)
 * Models a triangular profile dam with vertical upstream face.
 * 
 * @param {number} fluidDensity - Density of water (kg/m^3) (default 1000)
 * @param {number} damDensity - Density of dam material (kg/m^3) (default 2400)
 * @param {number} height - Height of water/dam (m)
 * @param {number} baseWidth - Base width of dam (m)
 * @param {number} upliftFactor - Uplift pressure reduction factor (0 to 1) (default 1.0 for full uplift)
 */
export const calculateDamAnalysis = (height, baseWidth, fluidDensity = 1000, damDensity = 2400, upliftFactor = 0.5) => {
    const g = 9.81;

    // 1. Hydrostatic Force (P) acting horizontally
    // P = 0.5 * rho_w * g * h^2
    const P = 0.5 * fluidDensity * g * Math.pow(height, 2) / 1000; // kN per meter length of dam

    // 2. Self Weight of Dam (W) acting vertically
    // triangular profile: Area = 0.5 * b * h
    const area = 0.5 * baseWidth * height;
    const W = area * damDensity * g / 1000; // kN per meter length

    // 3. Uplift Force (U) acting vertically upwards (Simplified triangular distribution)
    // U = 0.5 * c * rho_w * g * h * b
    const U = 0.5 * upliftFactor * fluidDensity * g * height * baseWidth / 1000; // kN per meter length

    // Stability Analysis

    // Stabilizing Moment (Ms) about the toe (downstream point)
    // Weight acts at b/3 from heel (upstream), so 2b/3 from toe.
    const momentArmW = (2 / 3) * baseWidth;
    const Ms = W * momentArmW;

    // Overturning Moment (Mo) due to Hydrostatic Force
    // P acts at h/3 from base.
    const momentArmP = height / 3;
    const Mo = P * momentArmP;

    // Overturning Moment due to Uplift
    const momentArmU = (2 / 3) * baseWidth;
    const Mu = U * momentArmU;

    // Factor of Safety against Overturning = Sum(Stabilizing Moments) / Sum(Overturning Moments including Uplift ones)
    const factorOfSafetyOverturning = Ms / (Mo + Mu);

    // Sliding Stability
    // F.S. = (mu * (W - U)) / P
    const mu = 0.65; // Coefficient of friction concrete-rock
    const factorOfSafetySliding = (mu * (W - U)) / P;

    return {
        hydrostaticForce: P,
        selfWeight: W,
        upliftForce: U,
        overturningMoment: Mo + Mu,
        stabilizingMoment: Ms,
        fsOverturning: factorOfSafetyOverturning,
        fsSliding: factorOfSafetySliding
    };
};
