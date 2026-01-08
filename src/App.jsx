import { PDFDocument } from "pdf-lib"
import {useState} from "react";
import Logos from './assets/logos.png'

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

    const fillForm = async(e) => {
        e.preventDefault();

        const formURL = '/mycsd-form-latest.pdf';
        const existingPdfBytes = await fetch(formURL).then(res => res.arrayBuffer())

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPage(0)
        const { height } = page.getSize()

        page.drawText(formData.name, {
            x: 98,
            y: height - 98,
            size: 8,
        });
        page.drawText(formData.phone, {
            x: 120,
            y: height - 115,
            size: 8,
        });
        page.drawText(formData.school, {
            x: 132,
            y: height - 133,
            size: 8,
        });
        page.drawText(formData.id, {
            x: 385,
            y: height - 98,
            size: 8,
        });
        page.drawText(formData.matrixNo, {
            x: 385,
            y: height - 115,
            size: 8,
        });
        page.drawText(formData.studyYear, {
            x: 385,
            y: height - 133,
            size: 8,
        });
        page.drawText(formData.tajuk, {
            x: 267,
            y: height - 151,
            size: 8,
        });
        page.drawText(formData.peranan, {
            x: 271,
            y: height - 169,
            size: 8,
        });
        page.drawText(formData.eventDate, {
            x: 195,
            y: height - 187,
            size: 8,
        });
        page.drawText(new Date().toLocaleDateString(), {
            x: 175,
            y: height - 267,
            size: 8,
        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute('target', '_blank');
        link.click();

        URL.revokeObjectURL(link.href)
    }

    return (
        <main className="p-3 min-h-screen bg-white flex flex-col items-center gap-3">
            <img src={Logos} alt=""/>
            <h1 className="font-semibold text-2xl uppercase">MyCSD Form Filler</h1>
            <p className="w-[90vw] md:w-[70vw] text-center">
                Too lazy to fill in the MyCSD form to get your sweet sweet MyCSD?
                Just put in your details below and hit generate!<br/>
                (You still have to print it out, sign it and bring it to BHEPA, but hey! It helps)<br/>
                <b>The form will be updated accordingly</b>
            </p>
            <form onSubmit={fillForm} className={"p-4 bg-slate-100 grid sm:grid-cols-2 grid-cols-1 gap-3 shadow-lg rounded-sm w-[90vw] md:w-[70vw]"}>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Nama</label>
                    <input name={'name'} value={formData.name} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">No. K/P / Pasport</label>
                    <input name={'id'} value={formData.id} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">No. Tel. Bimbit</label>
                    <input name={'phone'} value={formData.phone} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="number"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">No. Matrik</label>
                    <input name={'matrixNo'} value={formData.matrixNo} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Pusat Pengajian</label>
                    <input name={'school'} value={formData.school} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Tahun Pengajian</label>
                    <input name={'studyYear'} value={formData.studyYear} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Tajuk Program / Aktiviti / Pertandingan / Anugerah</label>
                    <input name={'tajuk'} value={formData.tajuk} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Peranan <small>(Cth: Keahlian; Peserta; Johan; Penerima Anugerah dll)</small></label>
                    <input name={'peranan'} value={formData.peranan} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="text"/>
                </div>
                <div className={'flex flex-col gap-2'}>
                    <label htmlFor="">Tarikh Penyertaan / Kemenangan</label>
                    <input name={'eventDate'} value={formData.eventDate} onChange={handleChange} className={'bg-white p-2 shadow-sm rounded'} type="date"/>
                </div>
                <div className={'col-span-2 flex flex-col items-center mt-2'}>
                    <button type={"submit"} className={'bg-green-600 cursor-pointer text-white p-2 px-4 shadow-sm rounded'} onClick={() => {}}>
                        Generate
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
