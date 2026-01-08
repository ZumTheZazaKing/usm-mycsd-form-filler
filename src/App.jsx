import { PDFDocument, StandardFonts } from "pdf-lib";
import { useState } from "react";
import Logos from './assets/logos.png';

function App() {

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        id: "",
        matrixNo: "",
        school: "",
        studyYear: "",
        tajuk: "",
        peranan: "",
        eventDate: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const fillForm = async (e) => {
        e.preventDefault();

        const formURL = '/mycsd-form-latest.pdf';
        const existingPdfBytes = await fetch(formURL).then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.getPage(0);
        const { height } = page.getSize();
        const textSize = 8;
        const lineHeight = 7;

        // --- Improved Helper Function ---
        const drawWrappedText = (text, x, y, maxWidth) => {
            if (!text) return;

            // 1. Split text into lines
            const words = text.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = font.widthOfTextAtSize(currentLine + ' ' + word, textSize);
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);

            // 2. Adjust Start Y (Bottom Anchoring)
            // If we have 2 lines, we move the start UP by 1 line height.
            // This ensures the LAST line always sits on the original Y (the form line).
            const startY = y + ((lines.length - 1) * lineHeight);

            // 3. Draw lines
            lines.forEach((line, index) => {
                page.drawText(line, {
                    x: x,
                    y: startY - (index * lineHeight), // Move down for subsequent lines
                    size: textSize - (lines.length > 0 ? 1 : 0),
                    font: font,
                });
            });
        };

        // --- Drawing Fields ---

        drawWrappedText(formData.name, 98, height - 98, 240);
        drawWrappedText(formData.school, 132, height - 133, 200);

        // 3. Simple Fields (No wrapping needed usually)
        page.drawText(formData.phone, { x: 120, y: height - 115, size: textSize, font: font });
        page.drawText(formData.id, { x: 385, y: height - 98, size: textSize, font: font });
        page.drawText(formData.matrixNo, { x: 385, y: height - 115, size: textSize, font: font });
        page.drawText(formData.studyYear, { x: 385, y: height - 133, size: textSize, font: font });

        // 4. Complex Fields (Wrapped)
        drawWrappedText(formData.tajuk, 267, height - 151, 310);
        drawWrappedText(formData.peranan, 271, height - 169, 270);

        // 5. Dates
        page.drawText(formData.eventDate, { x: 195, y: height - 187, size: textSize, font: font });
        page.drawText(new Date().toLocaleDateString(), {
            x: 175,
            y: height - 267,
            size: textSize,
            font: font
        });

        // --- Saving & Downloading ---
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute('target', '_blank');
        // link.download = `MyCSD_${formData.name.replace(/\s+/g, '_') || 'Form'}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    return (
        <main className="p-3 min-h-screen bg-white flex flex-col items-center gap-3">
            <img src={Logos} alt="" />
            <h1 className="font-semibold text-2xl uppercase">MyCSD Form Filler</h1>
            <p className="w-[90vw] md:w-[70vw] text-center">
                Too lazy to fill in the MyCSD form to get your sweet sweet MyCSD?
                Just put in your details below and hit generate!<br />
                (You still have to print it out, sign it and bring it to BHEPA, but hey! It helps)<br />
                <b>The form will be updated accordingly</b>
            </p>
            <form onSubmit={fillForm} className={"p-4 bg-slate-100 grid sm:grid-cols-2 grid-cols-1 gap-3 shadow-lg rounded-sm w-[90vw] md:w-[70vw]"}>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Nama</label>
                    <input name={'name'} value={formData.name} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">No. K/P / Pasport</label>
                    <input name={'id'} value={formData.id} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">No. Tel. Bimbit</label>
                    <input name={'phone'} value={formData.phone} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="number" />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">No. Matrik</label>
                    <input name={'matrixNo'} value={formData.matrixNo} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Pusat Pengajian</label>
                    <input name={'school'} value={formData.school} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Tahun Pengajian</label>
                    <input name={'studyYear'} value={formData.studyYear} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>

                {/* ADDED sm:col-span-2 HERE to make Tajuk full width */}
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Tajuk Program / Aktiviti / Pertandingan / Anugerah</label>
                    <input name={'tajuk'} value={formData.tajuk} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>

                {/* These two now sit nicely side-by-side */}
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Peranan <small>(Cth: Peserta)</small></label>
                    <input name={'peranan'} value={formData.peranan} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text" />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Tarikh Penyertaan</label>
                    <input name={'eventDate'} value={formData.eventDate} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="date" />
                </div>

                <div className={'col-span-1 sm:col-span-2 flex flex-col items-center mt-2'}>
                    <button type={"submit"} className={'bg-green-600 cursor-pointer text-white p-2 px-4 shadow-sm rounded hover:bg-green-700 transition-colors'}>
                        Generate PDF
                    </button>
                </div>
            </form>

            <footer className={'text-gray-400'}>
                <small>&copy;{new Date().getFullYear()} ZumTheZazaKing</small>
            </footer>
        </main>
    )
}

export default App