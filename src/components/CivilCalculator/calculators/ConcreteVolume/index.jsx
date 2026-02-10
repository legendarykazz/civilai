import React, { useState } from 'react';
import styles from './ConcreteVolume.module.css';
import { calculateConcreteVolume } from './utils';

const ConcreteVolume = ({ onResult }) => {
    const [inputs, setInputs] = useState({
        length: 10,
        width: 5,
        depth: 0.15,
        quantity: 1,
        wastage: 5
    });

    const [results, setResults] = useState(null);

    const handleCalculate = () => {
        const res = calculateConcreteVolume(
            inputs.length,
            inputs.width,
            inputs.depth,
            inputs.quantity,
            inputs.wastage
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
            <h2 className={styles.title}>Concrete Volume Estimator</h2>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Length (m)</label>
                        <input type="number" name="length" className={styles.input} value={inputs.length} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Width (m)</label>
                        <input type="number" name="width" className={styles.input} value={inputs.width} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Depth/Thickness (m)</label>
                        <input type="number" name="depth" className={styles.input} value={inputs.depth} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quantity (No. of members)</label>
                        <input type="number" name="quantity" className={styles.input} value={inputs.quantity} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Wastage %</label>
                        <input type="number" name="wastage" className={styles.input} value={inputs.wastage} onChange={handleInputChange} />
                    </div>

                    <button className={styles.calculateButton} onClick={handleCalculate}>
                        Calculate Volume
                    </button>
                </div>

                <div className={styles.resultsPanel}>
                    {results ? (
                        <div className={styles.results}>
                            <h3>Estimation Results</h3>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Wet Volume</span>
                                <span className={styles.resultValue}>{results.wetVolume.toFixed(3)} m³</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Dry Volume (+54%)</span>
                                <span className={styles.resultValue}>{results.dryVolume.toFixed(3)} m³</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Total with Wastage</span>
                                <span className={styles.resultValue}>{results.totalVolume.toFixed(3)} m³</span>
                            </div>

                            <h4 style={{ marginTop: '1rem', color: '#64748b' }}>Material Breakdown (1:2:4 Mix)</h4>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Cement (50kg Bags)</span>
                                <span className={styles.resultValue}>{Math.ceil(results.materials.cementBags)} bags</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Sand (m³)</span>
                                <span className={styles.resultValue}>{results.materials.sand.toFixed(2)} m³</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>Granite (m³)</span>
                                <span className={styles.resultValue}>{results.materials.granite.toFixed(2)} m³</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                            Click calculate to see estimate
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConcreteVolume;
