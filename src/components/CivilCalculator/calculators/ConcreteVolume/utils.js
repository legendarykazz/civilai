/**
 * Calculate Concrete Volume and Material Estimate
 */
export const calculateConcreteVolume = (length, width, depth, quantity, wastagePercent) => {
    const wetVolume = length * width * depth * quantity;
    const wastageFactor = 1 + (wastagePercent / 100);
    const totalWetVolume = wetVolume * wastageFactor; // Wet volume required on site

    // Dry Volume conversion factors (Dry volume is normally ~1.54 times wet volume due to voids)
    const dryVolumeFactor = 1.54;
    const totalDryVolume = totalWetVolume * dryVolumeFactor;

    // Mix Ratio 1:2:4 (M15 Grade approx) - Standard for simple works
    // Sum of ratios = 1 + 2 + 4 = 7
    const ratioSum = 7;

    const cementVolume = (1 / ratioSum) * totalDryVolume;
    const sandVolume = (2 / ratioSum) * totalDryVolume;
    const graniteVolume = (4 / ratioSum) * totalDryVolume;

    // Cement density ~ 1440 kg/m3. 1 bag = 50kg. Volume of 1 bag = 0.0347 m3
    const cementBags = cementVolume / 0.0347;

    return {
        wetVolume: wetVolume,
        totalVolume: totalWetVolume,
        dryVolume: totalDryVolume,
        materials: {
            cementVolume: cementVolume,
            cementBags: cementBags,
            sand: sandVolume,
            granite: graniteVolume
        }
    };
};
