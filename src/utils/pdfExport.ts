import { SavedReport, SupportedLanguage, UserProfile } from '../types';
import { getLocalizedTestName, getLocalizedCategory, getLocalizedExplanation } from './language';

const esc = (value: unknown): string =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export function exportDoctorSummaryPDF(
    report: SavedReport,
    userEmail: string,
    lang: SupportedLanguage,
    options?: { userProfile?: UserProfile | null; questions?: string[] }
) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to generate the printable doctor summary.');
        return;
    }

    const abnormalResults = report.results.filter((r) => r.classification !== 'Normal');
    const userProfile = options?.userProfile;
    const questions = options?.questions;

    const conditionsList = [
        ...(userProfile?.chronicConditions || []),
        userProfile?.otherChronicConditions
    ].filter(Boolean);

    const hasContext = Boolean(
        userProfile && (
            conditionsList.length > 0 ||
            userProfile.medications ||
            userProfile.allergies ||
            userProfile.primaryDoctorName
        )
    );

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Aperio Health — Clinical Summary - ${esc(report.label)}</title>
        <style>
            @page {
                size: portrait;
                margin: 10mm 12mm;
            }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; padding: 20px; margin: 0; font-size: 11px; line-height: 1.3; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 18px; font-weight: bold; color: #0f172a; }
            .subtitle { font-size: 11px; color: #64748b; margin-top: 2px; }
            .meta { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; font-size: 11px; margin-bottom: 12px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
            .patient-context { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 6px; font-size: 10.5px; margin-bottom: 12px; }
            .context-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; color: #166534; }
            .agenda-section { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 3px solid #0d9488; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; }
            .disclaimer { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; padding: 6px 10px; font-size: 10px; margin-bottom: 12px; border-radius: 6px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
            th { background-color: #f1f5f9; text-align: left; padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-weight: bold; text-transform: uppercase; font-size: 9.5px; color: #475569; }
            td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
            .status-high { color: #9f1239; font-weight: bold; background: #ffe4e6; padding: 1px 6px; border-radius: 10px; font-size: 9.5px; }
            .status-low { color: #92400e; font-weight: bold; background: #fef3c7; padding: 1px 6px; border-radius: 10px; font-size: 9.5px; }
            .status-normal { color: #065f46; font-weight: bold; background: #d1fae5; padding: 1px 6px; border-radius: 10px; font-size: 9.5px; }
            .explanation-box { background: #f8fafc; border-left: 2px solid #0d9488; padding: 4px 8px; font-size: 10px; color: #334155; margin-top: 4px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 9.5px; color: #94a3b8; text-align: center; margin-top: 15px; }
            @media print {
                .no-print { display: none !important; }
                body { padding: 0 !important; margin: 0 !important; }
                tr { page-break-inside: avoid; }
                .patient-context, .agenda-section, .meta, .disclaimer { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="no-print" style="text-align: right; margin-bottom: 12px;">
            <button onclick="window.print()" style="background: #0d9488; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Print / Save as PDF
            </button>
        </div>

        <div class="header">
            <div>
                <div class="title">Aperio Health — Clinical Summary Report</div>
                <div class="subtitle">Prepared for Doctor Review & Patient Literacy</div>
            </div>
            <div style="font-size: 11px; color: #64748b; text-align: right;">
                Generated: ${new Date().toLocaleDateString()}
            </div>
        </div>

        <div class="disclaimer">
            <strong>Medical Disclaimer:</strong> This summary is generated for educational and communication purposes only. It does not constitute a medical diagnosis or treatment plan. Please review clinical values against official laboratory instruments.
        </div>

        <div class="meta">
            <div class="meta-grid">
                <div><strong>Patient Account:</strong> ${esc(userEmail)}</div>
                <div><strong>Report Source:</strong> ${esc(report.label)}</div>
                <div><strong>Report Date:</strong> ${esc(report.date)}</div>
                <div><strong>Sample Context:</strong> ${
                    (report.sampleCondition?.toLowerCase() === 'non-fasting')
                        ? 'Non-Fasting / Random'
                        : (report.sampleCondition?.toLowerCase() === 'post-exercise')
                        ? 'Post-Strenuous Workout'
                        : 'Fasting (8-12h)'
                }</div>
                <div><strong>Total Flagged Abnormalities:</strong> ${abnormalResults.length} parameter(s)</div>
            </div>
        </div>

        ${hasContext ? `
        <div class="patient-context">
            <div style="font-weight: bold; font-size: 10px; color: #14532d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                📋 Active Patient Clinical Context & Medical History
            </div>
            <div class="context-grid">
                ${conditionsList.length > 0 ? `<div><strong>Known Conditions:</strong> ${conditionsList.join(', ')}</div>` : ''}
                ${userProfile?.medications ? `<div><strong>Current Medications:</strong> ${userProfile.medications}</div>` : ''}
                ${userProfile?.allergies ? `<div><strong>Known Allergies:</strong> ${userProfile.allergies}</div>` : ''}
                ${userProfile?.primaryDoctorName ? `<div><strong>Primary Physician:</strong> ${userProfile.primaryDoctorName} ${userProfile.primaryDoctorContact ? `(${userProfile.primaryDoctorContact})` : ''}</div>` : ''}
            </div>
        </div>
        ` : ''}

        ${questions && questions.length > 0 ? `
        <div class="agenda-section">
            <div style="font-weight: bold; font-size: 10px; color: #0f172a; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                💬 Key Questions Prepared for Doctor Consultation
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 10px; color: #334155; line-height: 1.35;">
                ${questions.map((q) => `<li style="margin-bottom: 2px;">${esc(q)}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <h3 style="font-size: 13px; margin-top: 10px; margin-bottom: 8px; color: #0f172a;">Laboratory Test Parameters</h3>

        <table>
            <thead>
                <tr>
                    <th>Category & Test Name</th>
                    <th>Measured Value</th>
                    <th>Reference Range</th>
                    <th>Status</th>
                    <th>Urgency Level</th>
                </tr>
            </thead>
            <tbody>
                ${report.results.map((r) => {
                    const testName = getLocalizedTestName(r.testId, lang);
                    const catName = getLocalizedCategory(r.category, lang);
                    const explanation = getLocalizedExplanation(r.testId, r.classification, lang);
                    const badgeClass = r.classification === 'High' ? 'status-high' : r.classification === 'Low' ? 'status-low' : 'status-normal';

                    return `
                    <tr>
                        <td>
                            <strong>${esc(testName)}</strong>
                            <div style="font-size: 9.5px; color: #64748b;">${esc(catName)}</div>
                            ${explanation ? `<div class="explanation-box">${esc(explanation)}</div>` : ''}
                        </td>
                        <td style="font-weight: bold;">${esc(r.measuredValue)} ${esc(r.unit)}</td>
                        <td style="color: #64748b;">${esc(r.referenceMin)} – ${esc(r.referenceMax)} ${esc(r.unit)}</td>
                        <td><span class="${badgeClass}">${esc(r.classification)}</span></td>
                        <td>${r.urgency === 'Doctor' ? 'Discuss Soon' : r.urgency === 'Monitor' ? 'Worth Monitoring' : 'Normal'}</td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>

        <div class="footer">
            Aperio Health | Not a substitute for professional medical advice | Confidential Patient Summary
        </div>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
