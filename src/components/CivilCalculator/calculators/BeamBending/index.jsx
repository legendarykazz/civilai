import React, { useState, useEffect } from 'react';
import styles from './BeamBending.module.css';
import { calculateBeam } from './utils';

const BeamBending = ({ onResult }) => {
    const [inputs, setInputs] = useState({
        length: 5,
        load: 10,
        supportType: 'simplySupported',
        loadType: 'point',
        E: 200,
        I: 5000
    });

    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newInputs = {
            ...inputs,
            [name]: name === 'supportType' || name === 'loadType' ? value : parseFloat(value)
        };
        setInputs(newInputs);
    };

    const handleCalculate = () => {
        const res = calculateBeam(
            inputs.length,
            inputs.load,
            inputs.supportType,
            inputs.loadType,
            inputs.E,
            inputs.I
        );
        setResults(res);

        if (onResult) {
            onResult({
                inputs: inputs,
                results: res
            });
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Simple Beam Analysis</h2>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Support Type</label>
                        <select
                            name="supportType"
                            className={styles.select}
                            value={inputs.supportType}
                            onChange={handleInputChange}
                        >
                            <option value="simplySupported">Simply Supported</option>
                            <option value="cantilever">Cantilever</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Load Type</label>
                        <select
                            name="loadType"
                            className={styles.select}
                            value={inputs.loadType}
                            onChange={handleInputChange}
                        >
                            <option value="point">Point Load (Center/End)</option>
                            <option value="udl">Uniformly Distributed Load</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Length (m)</label>
                        <input
                            type="number"
                            name="length"
                            className={styles.input}
                            value={inputs.length}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Load ({inputs.loadType === 'point' ? 'kN' : 'kN/m'})</label>
                        <input
                            type="number"
                            name="load"
                            className={styles.input}
                            value={inputs.load}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button className={styles.calculateButton} onClick={handleCalculate}>
                        Calculate
                    </button>
                </div>

                <div className={styles.resultsPanel}>
                    {results ? (
                        <div className={styles.results}>
                            <h3>Results</h3>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Reaction A (Ra)</span>
                                <span className={styles.resultValue}>{results.reactionA.toFixed(2)} kN</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Reaction B (Rb)</span>
                                <span className={styles.resultValue}>{results.reactionB.toFixed(2)} kN</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Max Shear Force</span>
                                <span className={styles.resultValue}>{results.maxShear.toFixed(2)} kN</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Max Bending Moment</span>
                                <span className={styles.resultValue}>{results.maxMoment.toFixed(2)} kNm</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Max Deflection</span>
                                <span className={styles.resultValue}>{results.maxDeflection.toFixed(4)} mm</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                            Click calculate to see results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeamBending;
