import React, { useState } from 'react';
import styles from './Hydraulics.module.css';
import { calculateManning, calculatePipeHeadLoss } from './utils';

const Hydraulics = ({ onResult }) => {
    const [activeTab, setActiveTab] = useState('manning'); // 'manning' or 'pipe'

    // Manning Inputs
    const [manningInputs, setManningInputs] = useState({
        width: 3,
        depth: 1.5,
        slope: 0.001,
        n: 0.013
    });

    // Pipe Flow Inputs
    const [pipeInputs, setPipeInputs] = useState({
        length: 100,
        diameter: 0.5,
        flowRate: 0.2, // m3/s
        frictionFactor: 0.02
    });

    const [manningResults, setManningResults] = useState(null);
    const [pipeResults, setPipeResults] = useState(null);

    const handleCalculate = () => {
        if (activeTab === 'manning') {
            const res = calculateManning(
                manningInputs.width,
                manningInputs.depth,
                manningInputs.slope,
                manningInputs.n
            );
            setManningResults(res);
            if (onResult) onResult({ inputs: manningInputs, results: res, subType: 'Manning' });
        } else {
            const res = calculatePipeHeadLoss(
                pipeInputs.length,
                pipeInputs.diameter,
                pipeInputs.flowRate,
                pipeInputs.frictionFactor
            );
            setPipeResults(res);
            if (onResult) onResult({ inputs: pipeInputs, results: res, subType: 'Pipe Flow' });
        }
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'manning') {
            setManningInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setPipeInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Hydraulics & Water Resources</h2>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'manning' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('manning')}
                >
                    Open Channel Flow (Manning)
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'pipe' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('pipe')}
                >
                    Pipe Flow (Head Loss)
                </button>
            </div>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    {activeTab === 'manning' ? (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Channel Width (m)</label>
                                <input type="number" name="width" className={styles.input} value={manningInputs.width} onChange={(e) => handleInputChange(e, 'manning')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Flow Depth (m)</label>
                                <input type="number" name="depth" className={styles.input} value={manningInputs.depth} onChange={(e) => handleInputChange(e, 'manning')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Slope (S)</label>
                                <input type="number" name="slope" className={styles.input} value={manningInputs.slope} step="0.0001" onChange={(e) => handleInputChange(e, 'manning')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Manning's n</label>
                                <input type="number" name="n" className={styles.input} value={manningInputs.n} step="0.001" onChange={(e) => handleInputChange(e, 'manning')} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Pipe Length (m)</label>
                                <input type="number" name="length" className={styles.input} value={pipeInputs.length} onChange={(e) => handleInputChange(e, 'pipe')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Diameter (m)</label>
                                <input type="number" name="diameter" className={styles.input} value={pipeInputs.diameter} onChange={(e) => handleInputChange(e, 'pipe')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Flow Rate (m³/s)</label>
                                <input type="number" name="flowRate" className={styles.input} value={pipeInputs.flowRate} step="0.01" onChange={(e) => handleInputChange(e, 'pipe')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Friction Factor (f)</label>
                                <input type="number" name="frictionFactor" className={styles.input} value={pipeInputs.frictionFactor} step="0.001" onChange={(e) => handleInputChange(e, 'pipe')} />
                            </div>
                        </>
                    )}

                    <button className={styles.calculateButton} onClick={handleCalculate}>
                        Calculate
                    </button>
                </div>

                <div className={styles.resultsPanel}>
                    {activeTab === 'manning' ? (
                        manningResults ? (
                            <div className={styles.results}>
                                <h3>Flow Results</h3>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Discharge (Q)</span>
                                    <span className={styles.resultValue}>{manningResults.discharge.toFixed(3)} m³/s</span>
                                </div>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Velocity (V)</span>
                                    <span className={styles.resultValue}>{manningResults.velocity.toFixed(3)} m/s</span>
                                </div>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Hydraulic Radius</span>
                                    <span className={styles.resultValue}>{manningResults.hydraulicRadius.toFixed(3)} m</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                                Click calculate to see Flow
                            </div>
                        )
                    ) : (
                        pipeResults ? (
                            <div className={styles.results}>
                                <h3>Head Loss Results</h3>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Head Loss (hf)</span>
                                    <span className={styles.resultValue}>{pipeResults.headLoss.toFixed(3)} m</span>
                                </div>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Flow Velocity</span>
                                    <span className={styles.resultValue}>{pipeResults.velocity.toFixed(2)} m/s</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                                Click calculate to see Head Loss
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hydraulics;
