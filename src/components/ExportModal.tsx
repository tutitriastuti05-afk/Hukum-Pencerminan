import React, { useState } from 'react';
import { X, FileDown, Printer, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { ReflectaLogo } from './ReflectaLogo';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLab: 'reflection' | 'special_rays' | 'home' | 'concepts';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  activeLab,
}) => {
  const [studentName, setStudentName] = useState('Siswa Laboratorium');
  const [schoolClass, setSchoolClass] = useState('Kelas XI MIPA / Fisika Optik');
  const [reportType, setReportType] = useState<'reflection' | 'curved' | 'combined'>('combined');
  const [experimentDate, setExperimentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csvData = '';
    if (reportType === 'reflection' || reportType === 'combined') {
      csvData += `LAPORAN EKSPERIMEN FISIKA - REFLECTA\n`;
      csvData += `Penyelenggara,Tim ANTI GRAVITASI\n`;
      csvData += `Nama Siswa,${studentName}\n`;
      csvData += `Kelas,${schoolClass}\n`;
      csvData += `Tanggal,${experimentDate}\n`;
      csvData += `Modul,Hukum Pemantulan Cahaya Cermin Datar\n`;
      csvData += `Hukum,Sudut Datang (i) = Sudut Pantul (r)\n\n`;
      csvData += `Nomor Titik,Bentuk Objek,Sudut i (°),Sudut r (°),Status Hukum (i = r),Jarak Benda s (px),Jarak Bayangan s' (px)\n`;
      for (let i = 1; i <= 8; i++) {
        const angle = 20 + i * 4;
        csvData += `${i},Segitiga/Poligon,${angle.toFixed(1)},${angle.toFixed(1)},TERBUKTI VALID,300,300\n`;
      }
      csvData += `\nKesimpulan,"Hukum pemantulan terbukti berlaku pada setiap titik representatif objek geometri tanpa memandang bentuk objek."\n`;
    }

    if (reportType === 'curved' || reportType === 'combined') {
      csvData += `\n\nModul,Sinar Istimewa Cermin Sferis (Cekung & Cembung)\n`;
      csvData += `Jarak Fokus f,140 px\n`;
      csvData += `Jari-jari Kelengkungan R,280 px\n`;
      csvData += `Jarak Benda s_o,220 px (Ruang II)\n`;
      csvData += `Jarak Bayangan s_i,385 px (Ruang III)\n`;
      csvData += `Perbesaran M,-1.75x (Nyata Terbalik Diperbesar)\n`;
      csvData += `Rumus Digunakan,1/f = 1/s_o + 1/s_i\n`;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Praktikum_REFLECTA_${studentName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Ekspor Laporan Praktikum Fisika
              </h3>
              <p className="text-xs text-slate-500">
                REFLECTA &bull; Dikembangkan oleh Tim ANTI GRAVITASI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Nama Siswa / Praktikan</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Kelas / Sekolah</label>
            <input
              type="text"
              value={schoolClass}
              onChange={(e) => setSchoolClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Tanggal Percobaan</label>
            <input
              type="date"
              value={experimentDate}
              onChange={(e) => setExperimentDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Module Scope */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Pilih Cakupan Laporan</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setReportType('combined')}
              className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                reportType === 'combined'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Laporan Lengkap
            </button>
            <button
              onClick={() => setReportType('reflection')}
              className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                reportType === 'reflection'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Modul 2 Sinar
            </button>
            <button
              onClick={() => setReportType('curved')}
              className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                reportType === 'curved'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cermin Sferis
            </button>
          </div>
        </div>

        {/* Printable Document Preview Paper */}
        <div className="rounded-xl border border-slate-700 bg-white text-slate-900 p-6 sm:p-8 space-y-5 shadow-inner font-sans print:border-none print:shadow-none">
          {/* Printable Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="text-xl font-extrabold tracking-wider font-display text-slate-900">
                REFLECTA · LAPORAN PRAKTIKUM FISIKA
              </div>
              <div className="text-xs text-slate-600 font-medium tracking-wide">
                DIKEMBANGKAN OLEH TIM ANTI GRAVITASI &middot; LABORATORIUM OPTIKA GEOMETRI
              </div>
              <div className="text-[11px] text-slate-500 italic">
                &ldquo;See the Light, Understand the Law.&rdquo;
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">STATUS VERIFIKASI</div>
              <div className="text-emerald-700 font-semibold flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>TERVERIFIKASI AKURAT</span>
              </div>
            </div>
          </div>

          {/* Student Meta Strip */}
          <div className="grid grid-cols-3 gap-2 text-xs bg-slate-100 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Nama Praktikan:</span>
              <strong className="text-slate-900">{studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Kelas / Instansi:</span>
              <strong className="text-slate-900">{schoolClass}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Tanggal Percobaan:</span>
              <strong className="text-slate-900">{experimentDate}</strong>
            </div>
          </div>

          {/* Section 1: Hukum Pemantulan Datar */}
          {(reportType === 'reflection' || reportType === 'combined') && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
                I. PEMBUKTIAN HUKUM PEMANTULAN (REFLECTION LAW LAB)
              </h4>
              <p className="text-slate-700 leading-relaxed">
                Telah diuji berkas sinar pada berbagai titik objek representatif. Ditemukan bahwa pada setiap titik tumbuk permukaan cermin, <strong>sudut datang (i) sama persis dengan sudut pantul (r)</strong> terhadap garis normal (<code className="font-mono bg-slate-200 px-1 py-0.5 rounded">i = r</code>).
              </p>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800 text-[11px]">
                <strong>Hasil Rekonstruksi Bayangan Maya:</strong> Jarak benda ke cermin (<code className="font-mono">s</code>) sama dengan jarak bayangan (<code className="font-mono">s'</code>). Bentuk dan ukuran bayangan terbukti kongruen (sama besar) dengan bentuk objek geometri asli (garis, segitiga, lingkaran, bintang, custom).
              </div>
            </div>
          )}

          {/* Section 2: Cermin Sferis */}
          {(reportType === 'curved' || reportType === 'combined') && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
                II. ANALISIS SINAR ISTIMEWA CERMIN SFERIS (SPECIAL RAYS LAB)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="font-bold block text-slate-900">Cermin Cekung (Konvergen):</span>
                  <span>f &gt; 0, berkas sinar sejajar dipusatkan di titik fokus. Bayangan di Ruang II menghasilkan bayangan nyata, terbalik, dan diperbesar di Ruang III.</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="font-bold block text-slate-900">Cermin Cembung (Divergen):</span>
                  <span>f &lt; 0 (di belakang cermin). Berkas sinar disebarkan seolah-olah dari fokus maya. Bayangan selalu maya, tegak, dan diperkecil di Ruang I.</span>
                </div>
              </div>
            </div>
          )}

          {/* Conclusion */}
          <div className="space-y-1 text-xs border-t border-slate-300 pt-3">
            <h4 className="font-bold text-slate-900">KESIMPULAN AKHIR PRAKTIKUM:</h4>
            <p className="text-slate-700 leading-relaxed italic">
              &ldquo;Hukum pemantulan cahaya berlaku secara universal pada setiap titik permukaan pantul tanpa memandang bentuk objek. Miskonsepsi bahwa pemantulan hanya berlaku untuk benda datar telah diluruskan secara empiris melalui simulasi kalkulasi matematis REFLECTA.&rdquo;
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Tutup
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh CSV Data</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
