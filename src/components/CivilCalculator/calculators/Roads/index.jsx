import React, { useState } from 'react';
import styles from './Roads.module.css';
import { calculateSSD, calculateSuperElevation } from './utils';

const Roads = ({ onResult }) => {
    const [activeTab, setActiveTab] = useState('ssd'); // 'ssd' or 'superelevation'

    // SSD Inputs
    const [ssdInputs, setSSDInputs] = useState({
        speed: 80,
        reactionTime: 2.5,
        grade: 0,
        friction: 0.35
    });

    // Super-elevation Inputs
    const [seInputs, setSEInputs] = useState({
        speed: 80,
        radius: 300,
        friction: 0.15
    });

    const [ssdResults, setSSDResults] = useState(null);
    const [seResults, setSEResults] = useState(null);

    const handleCalculate = () => {
        if (activeTab === 'ssd') {
            const res = calculateSSD(
                ssdInputs.speed,
                ssdInputs.reactionTime,
                ssdInputs.grade,
                ssdInputs.friction
            );
            setSSDResults(res);
            if (onResult) onResult({ inputs: ssdInputs, results: res, subType: 'SSD' });
        } else {
            const res = calculateSuperElevation(
                seInputs.speed,
                seInputs.radius,
                seInputs.friction
            );
            setSEResults(res);
            if (onResult) onResult({ inputs: seInputs, results: res, subType: 'Super-elevation' });
        }
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'ssd') {
            setSSDInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setSEInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Transportation Engineering</h2>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'ssd' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('ssd')}
                >
                    Stopping Sight Distance
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'superelevation' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('superelevation')}
                >
                    Super-elevation
                </button>
            </div>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    {activeTab === 'ssd' ? (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Design Speed (km/h)</label>
                                <input type="number" name="speed" className={styles.input} value={ssdInputs.speed} onChange={(e) => handleInputChange(e, 'ssd')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Reaction Time (sec)</label>
                                <input type="number" name="reactionTime" className={styles.input} value={ssdInputs.reactionTime} onChange={(e) => handleInputChange(e, 'ssd')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Road Grade (decimal, e.g. 0.03 for 3%)</label>
                                <input type="number" name="grade" className={styles.input} value={ssdInputs.grade} step="0.01" onChange={(e) => handleInputChange(e, 'ssd')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Coefficient of Friction</label>
                                <input type="number" name="friction" className={styles.input} value={ssdInputs.friction} step="0.01" onChange={(e) => handleInputChange(e, 'ssd')} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Design Speed (km/h)</label>
                                <input type="number" name="speed" className={styles.input} value={seInputs.speed} onChange={(e) => handleInputChange(e, 'se')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Curve Radius (m)</label>
                                <input type="number" name="radius" className={styles.input} value={seInputs.radius} onChange={(e) => handleInputChange(e, 'se')} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Side Friction Factor (f)</label>
                                <input type="number" name="friction" className={styles.input} value={seInputs.friction} step="0.01" onChange={(e) => handleInputChange(e, 'se')} />
                            </div>
                        </>
                    )}

                    <button className={styles.calculateButton} onClick={handleCalculate}>
                        Calculate
                    </button>
                </div>

                <div className={styles.resultsPanel}>
                    {activeTab === 'ssd' ? (
                        ssdResults ? (
                            <div className={styles.results}>
                                <h3>SSD Results</h3>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Total SSD</span>
                                    <span className={styles.resultValue}>{ssdResults.totalSSD.toFixed(2)} m</span>
                                </div>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Reaction Dist.</span>
                                    <span className={styles.resultValue}>{ssdResults.reactionDistance.toFixed(2)} m</span>
                                </div>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Braking Dist.</span>
                                    <span className={styles.resultValue}>{ssdResults.brakingDistance.toFixed(2)} m</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                                Click calculate to see SSD
                            </div>
                        )
                    ) : (
                        seResults ? (
                            <div className={styles.results}>
                                <h3>Super-elevation Results</h3>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Required e (%)</span>
                                    <span className={styles.resultValue}>{seResults.superElevationPercent.toFixed(2)} %</span>
                                </div>
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Required e (decimal)</span>
                                    <span className={styles.resultValue}>{seResults.superElevationDecimal.toFixed(4)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.results} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary, #64748b)' }}>
                                Click calculate to see Super-elevation
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Roads;
