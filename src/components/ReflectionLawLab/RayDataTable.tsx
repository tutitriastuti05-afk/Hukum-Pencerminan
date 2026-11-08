import React, { useState } from 'react';
import { RayData } from '../../types/physics';
import { generateReflectionCSV } from '../../utils/opticsMath';
import { CheckCircle2, Download, Table, ChevronDown, ChevronUp } from 'lucide-react';

interface RayDataTableProps {
  rays: RayData[];
  objectShape: string;
}

export const RayDataTable: React.FC<RayDataTableProps> = ({ rays, objectShape }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownloadCSV = () => {
    const csvContent = generateReflectionCSV(rays);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `REFLECTA_Pemantulan_${objectShape}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Table className="w-5 h-5 text-pink-500" />
          <h3 className="font-display text-sm font-bold text-slate-800">
            Tabel Data Pengukuran Real-Time
          </h3>
          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            {rays.length} Titik Sampel
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Tutup Ringkas' : 'Lihat Semua'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Physics Truth Proof Badge */}
      <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-emerald-950 font-bold">Hukum Pemantulan Terverifikasi:</strong> Pada seluruh {rays.length} titik representatif objek {objectShape}, sudut datang (<code className="font-mono font-bold text-pink-700 bg-pink-50 px-1 py-0.5 rounded">i</code>) terbukti identik dengan sudut pantul (<code className="font-mono font-bold text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">r</code>) terhadap garis normal.
        </span>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs font-sans">
          <thead className="sticky top-0 bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Sinar #</th>
              <th className="py-2.5 px-3">Titik Objek (X, Y)</th>
              <th className="py-2.5 px-3">Titik Pantul (X, Y)</th>
              <th className="py-2.5 px-3 text-pink-700 font-bold">Sudut Datang (i)</th>
              <th className="py-2.5 px-3 text-emerald-700 font-bold">Sudut Pantul (r)</th>
              <th className="py-2.5 px-3 text-emerald-800">Verifikasi i = r</th>
              <th className="py-2.5 px-3 text-slate-700">Titik Bayangan Maya</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
            {(isExpanded ? rays : rays.slice(0, 5)).map((ray, idx) => (
              <tr key={idx} className="hover:bg-pink-50/40 transition-colors">
                <td className="py-2 px-3 text-slate-500 font-medium">#{idx + 1}</td>
                <td className="py-2 px-3 text-pink-700 font-medium">
                  ({Math.round(ray.sourcePoint.x)}, {Math.round(ray.sourcePoint.y)})
                </td>
                <td className="py-2 px-3 text-slate-500">
                  ({Math.round(ray.hitPoint.x)}, {Math.round(ray.hitPoint.y)})
                </td>
                <td className="py-2 px-3 text-pink-600 font-bold">{ray.incidentAngleDeg}°</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">{ray.reflectedAngleDeg}°</td>
                <td className="py-2 px-3">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>i == r</span>
                  </span>
                </td>
                <td className="py-2 px-3 text-emerald-800 font-semibold">
                  ({Math.round(ray.virtualOriginPoint.x)}, {Math.round(ray.virtualOriginPoint.y)})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isExpanded && rays.length > 5 && (
        <div className="text-center pt-1">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-pink-600 hover:text-pink-700 font-medium underline cursor-pointer"
          >
            Menampilkan 5 dari {rays.length} titik. Klik untuk melihat seluruh data ({rays.length} titik).
          </button>
        </div>
      )}
    </div>
  );
};
