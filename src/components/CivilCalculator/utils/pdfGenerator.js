import { jsPDF } from 'jspdf';

/**
 * Generate a PDF report from the chat history and calculator context.
 * @param {Array} messages - Chat history
 * @param {Object} contextData - Current calculator context (inputs, results, title)
 */
export const generatePDFReport = (messages, contextData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = margin;

    // Helper to add text and advance y
    const addText = (text, fontSize = 12, style = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);

        const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        doc.text(textLines, margin, y);
        y += textLines.length * (fontSize * 0.5); // Approximate line height

        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Helper to add a separator
    const addSeparator = () => {
        y += 5;
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    };

    // Header
    addText("Civil Engineering Calculator - AI Report", 18, 'bold', [15, 23, 42]);
    y += 5;
    addText(`Date: ${new Date().toLocaleString()}`, 10, 'normal', [100, 116, 139]);
    addSeparator();

    // Context Section (if available)
    if (contextData) {
        addText(`Context: ${contextData.title || 'General'}`, 14, 'bold', [56, 189, 248]);
        y += 5;

        // Inputs
        if (contextData.inputs) {
            addText("Inputs:", 12, 'bold');
            y += 2;
            Object.entries(contextData.inputs).forEach(([key, value]) => {
                addText(`- ${key}: ${value}`, 10);
            });
            y += 5;
        }

        // Results
        if (contextData.results) {
            addText("Results:", 12, 'bold');
            y += 2;
            Object.entries(contextData.results).forEach(([key, value]) => {
                // Handle nested objects if necessary, simplistic for now
                if (typeof value === 'object' && value !== null) return;
                const displayValue = typeof value === 'number' ? value.toFixed(3) : value;
                addText(`- ${key}: ${displayValue}`, 10);
            });
            y += 5;
        }
        addSeparator();
    }

    // Chat History Section
    addText("AI Consultation Log", 14, 'bold', [56, 189, 248]);
    y += 5;

    messages.filter(m => m.role !== 'system').forEach(msg => {
        const role = msg.role === 'user' ? 'You' : 'AI Assistant';
        const color = msg.role === 'user' ? [15, 23, 42] : [71, 85, 105];

        addText(`${role}:`, 11, 'bold', color);
        y += 2;

        // Clean markdown basics slightly (remove bold stars for readability in basic PDF text)
        // Ideally a markdown-to-pdf parser is better, but simple text strip works for now.
        const cleanContent = msg.content.replace(/\*\*/g, '').replace(/`/g, '');
        addText(cleanContent, 10, 'normal', [51, 65, 85]);
        y += 8;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save
    doc.save(`Engineering_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
