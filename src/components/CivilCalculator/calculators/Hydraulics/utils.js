/**
 * Hydraulics Engineering Utility Functions
 */

/**
 * Calculate Open Channel Flow (Manning's Equation)
 * Q = (1/n) * A * R^(2/3) * S^(1/2)  (SI Units)
 * V = (1/n) * R^(2/3) * S^(1/2)
 * 
 * @param {number} width - Channel width (m) (Assuming rectangular for simplicity initially)
 * @param {number} depth - Flow depth (m)
 * @param {number} slope - Slope of channel bed (decimal)
 * @param {number} n - Manning's roughness coefficient
 */
export const calculateManning = (width, depth, slope, n = 0.013) => {
    const area = width * depth;
    const perimeter = width + (2 * depth);
    const hydraulicRadius = area / perimeter;

    // Velocity (m/s)
    const velocity = (1 / n) * Math.pow(hydraulicRadius, 2 / 3) * Math.pow(slope, 0.5);

    // Discharge (m^3/s)
    const discharge = area * velocity;

    return {
        area: area,
        perimeter: perimeter,
        hydraulicRadius: hydraulicRadius,
        velocity: velocity,
        discharge: discharge
    };
};

/**
 * Calculate Pipe Flow Head Loss (Darcy-Weisbach)
 * h_f = f * (L/D) * (V^2 / 2g)
 * 
 * @param {number} length - Pipe length (m)
 * @param {number} diameter - Pipe diameter (m)
 * @param {number} flowRate - Flow Rate (m^3/s)
 * @param {number} frictionFactor - Darcy friction factor (f) (default 0.02)
 */
export const calculatePipeHeadLoss = (length, diameter, flowRate, frictionFactor = 0.02) => {
    const g = 9.81;
    const area = Math.PI * Math.pow(diameter / 2, 2);
    const velocity = flowRate / area;

    const headLoss = frictionFactor * (length / diameter) * (Math.pow(velocity, 2) / (2 * g));

    return {
        velocity: velocity,
        headLoss: headLoss
    };
};
