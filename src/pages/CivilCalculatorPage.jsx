import React, { useState } from 'react';
import { CivilAIProvider } from '../components/CivilCalculator/context/CivilAIContext';
import BeamBending from '../components/CivilCalculator/calculators/BeamBending';
import ConcreteVolume from '../components/CivilCalculator/calculators/ConcreteVolume';
import Dams from '../components/CivilCalculator/calculators/Dams';
import Hydraulics from '../components/CivilCalculator/calculators/Hydraulics';
import Roads from '../components/CivilCalculator/calculators/Roads';
import ChatInterface from '../components/CivilCalculator/AI/ChatInterface';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalculatorContent = () => {
    const [activeCalculator, setActiveCalculator] = useState('beam');
    const [contextData, setContextData] = useState(null);

    const handleCalculatorResult = (data) => {
        setContextData({
            title: activeCalculator,
            ...data
        });
    };

    const renderCalculator = () => {
        switch (activeCalculator) {
            case 'beam': return <BeamBending onResult={handleCalculatorResult} />;
            case 'concrete': return <ConcreteVolume onResult={handleCalculatorResult} />;
            case 'dams': return <Dams onResult={handleCalculatorResult} />;
            case 'hydraulics': return <Hydraulics onResult={handleCalculatorResult} />;
            case 'roads': return <Roads onResult={handleCalculatorResult} />;
            default: return <BeamBending onResult={handleCalculatorResult} />;
        }
    };

    return (
        <div className="p-6 relative min-h-screen bg-[var(--bg-primary)]">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] font-medium" title="Exit to Main Dashboard">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Exit to Dashboard</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary, #1e293b)]">Civil Engineering Suite</h1>
                        <p className="text-[var(--text-secondary, #64748b)]">Nigerian Standards (BS 8110 / BS 6399)</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Internal Sidebar for Calculators */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    {[
                        { id: 'beam', label: 'Beam Analysis' },
                        { id: 'concrete', label: 'Concrete Volume' },
                        { id: 'dams', label: 'Dam Stability' },
                        { id: 'hydraulics', label: 'Hydraulics' },
                        { id: 'roads', label: 'Roads & SSD' }
                    ].map(calc => (
                        <button
                            key={calc.id}
                            onClick={() => setActiveCalculator(calc.id)}
                            className={`p-4 text-left rounded-lg transition-all font-medium ${activeCalculator === calc.id
                                ? 'bg-[var(--primary, #0ea5e9)] text-white shadow-lg'
                                : 'bg-[var(--bg-secondary, #ffffff)] text-[var(--text-secondary, #64748b)] hover:bg-[var(--bg-tertiary, #f1f5f9)] hover:text-[var(--text-primary, #1e293b)]'
                                }`}
                        >
                            {calc.label}
                        </button>
                    ))}
                </div>

                {/* Main Calculator Area */}
                <div className="flex-1">
                    {renderCalculator()}
                </div>
            </div>

            <ChatInterface contextData={contextData} />
        </div>
    );
};

const CivilCalculatorPage = () => {
    return (
        <CivilAIProvider>
            <CalculatorContent />
        </CivilAIProvider>
    );
};

export default CivilCalculatorPage;
