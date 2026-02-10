/**
 * Calculate beam properties based on support and load type.
 */
export const calculateBeam = (length, load, supportType, loadType, E = 200, I = 5000) => {
    const E_kPa = E * 1e6;
    const I_m4 = I * 1e-8;
    const EI = E_kPa * I_m4; // kN*m^2

    let results = {
        reactionA: 0,
        reactionB: 0,
        maxShear: 0,
        maxMoment: 0,
        maxDeflection: 0,
        momentFunction: null,
        shearFunction: null,
    };

    if (supportType === 'simplySupported') {
        if (loadType === 'point') {
            results.reactionA = load / 2;
            results.reactionB = load / 2;
            results.maxShear = load / 2;
            results.maxMoment = (load * length) / 4;
            results.maxDeflection = (load * Math.pow(length, 3)) / (48 * EI);
        } else if (loadType === 'udl') {
            const totalLoad = load * length;
            results.reactionA = totalLoad / 2;
            results.reactionB = totalLoad / 2;
            results.maxShear = totalLoad / 2;
            results.maxMoment = (load * Math.pow(length, 2)) / 8;
            results.maxDeflection = (5 * load * Math.pow(length, 4)) / (384 * EI);
        }
    } else if (supportType === 'cantilever') {
        if (loadType === 'point') {
            results.reactionA = load;
            results.reactionB = 0;
            results.maxShear = load;
            results.maxMoment = load * length;
            results.maxDeflection = (load * Math.pow(length, 3)) / (3 * EI);
        } else if (loadType === 'udl') {
            const totalLoad = load * length;
            results.reactionA = totalLoad;
            results.reactionB = 0;
            results.maxShear = totalLoad;
            results.maxMoment = (load * Math.pow(length, 2)) / 2;
            results.maxDeflection = (load * Math.pow(length, 4)) / (8 * EI);
        }
    }

    return results;
};
