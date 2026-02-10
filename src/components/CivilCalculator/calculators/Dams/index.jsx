import React, { useState } from 'react';
import styles from './Dams.module.css';
import { calculateDamAnalysis } from './utils';

const Dams = ({ onResult }) => {
    const [inputs, setInputs] = useState({
        fluidDensity: 1000,
        damDensity: 2400,
        height: 10,
        baseWidth: 8,
        upliftFactor: 0.5
    });

    const [results, setResults] = useState(null);

    const handleCalculate = () => {
        const res = calculateDamAnalysis(
            inputs.height,
            inputs.baseWidth,
            inputs.fluidDensity,
            inputs.damDensity,
            inputs.upliftFactor
        );
        setResults(res);
        if (onResult) {
            onResult({
                inputs: inputs,
                results: res
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gravity Dam Stability Analysis</h2>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Dam Height (m)</label>
                        <input type="number" name="height" className={styles.input} value={inputs.height} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Base Width (m)</label>
                        <input type="number" name="baseWidth" className={styles.input} value={inputs.baseWidth} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Water Density (kg/m³)</label>
                        <input type="number" name="fluidDensity" className={styles.input} value={inputs.fluidDensity} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Material Density (kg/m³)</label>
                        <input type="number" name="damDensity" className={styles.input} value={inputs.damDensity} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Uplift Factor (0-1)</label>
                        <input type="number" name="upliftFactor" className={styles.input} value={inputs.upliftFactor} step="0.1" max="1" min="0" onChange={handleInputChange} />
                    </div>

                    <button className={styles.calculateButton} onClick={handleCalculate}>
                        Analyze Stability
                    </button>
                </div>

                <div className={styles.resultsPanel}>
                    {results ? (
                        <div className={styles.results}>
                            <h3>Key Forces (per meter length)</h3>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Hydrostatic Force (P)</span>
                                <span className={styles.resultValue}>{results.hydrostaticForce.toFixed(2)} kN</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Self Weight (W)</span>
                                <span className={styles.resultValue}>{results.selfWeight.toFixed(2)} kN</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Uplift Force (U)</span>
                                <span className={styles.resultValue}>{results.upliftForce.toFixed(2)} kN</span>
                            </div>

                            <h3 style={{ marginTop: '1.5rem' }}>Stability Checks</h3>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>F.S. Overturning</span>
                                <span className={`${styles.resultValue} ${results.fsOverturning > 1.5 ? styles.safe : styles.unsafe}`} style={{ color: results.fsOverturning > 1.5 ? '#10b981' : '#ef4444' }}>
                                    {results.fsOverturning.toFixed(2)} {results.fsOverturning > 1.5 ? '(Safe)' : '(Unsafe)'}
                                </span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>F.S. Sliding</span>
                                <span className={`${styles.resultValue} ${results.fsSliding > 1.5 ? styles.safe : styles.unsafe}`} style={{ color: results.fsSliding > 1.5 ? '#10b981' : '#ef4444' }}>
                                    {results.fsSliding.toFixed(2)} {results.fsSliding > 1.5 ? '(Safe)' : '(Unsafe)'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                            Click analyze to see Results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dams;
