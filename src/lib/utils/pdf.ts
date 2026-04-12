// src/lib/utils/pdf.ts
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateTicketPDF(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        // Capturer l'élément avec une haute résolution
        const canvas = await html2canvas(element, {
            scale: 2, // Haute qualité
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Créer le PDF (Format A5 paysage ou personnalisé)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [canvas.width * 0.264583, canvas.height * 0.264583] // Adapter à la taille du canvas
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save(filename);
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        throw error;
    }
}
