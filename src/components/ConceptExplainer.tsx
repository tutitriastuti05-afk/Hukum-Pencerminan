import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, ArrowRight, BookOpen, CheckCircle2, XCircle } from 'lucide-react';

interface ConceptExplainerProps {
  onGoToLab: (lab: 'reflection' | 'special_rays') => void;
}

export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({ onGoToLab }) => {
  const [selectedTopic, setSelectedTopic] = useState<'reflection' | 'curved' | 'misconceptions'>('misconceptions');

  const misconceptions = [
    {
      id: 1,
      myth: 'Hukum pemantulan cahaya hanya berlaku untuk objek datar atau cermin datar.',
      truth: 'Hukum pemantulan (i = r) berlaku pada SETIAP TITIK permukaan pantul, apapun bentuk objeknya.',
      explanation:
        'Hukum pemantulan bersifat lokal pada setiap titik singgung. Ketika sebuah objek berbentuk segitiga, lingkaran, bintang, atau bahkan cermin cekung dan cembung, setiap berkas sinar cahaya yang menumbuk permukaan cermin akan memantul dengan sudut datang yang sama persis dengan sudut pantul terhadap garis normal tegak lurus pada titik tersebut (i = r).',
      recommendedLab: 'reflection' as const,
    },
    {
      id: 2,
      myth: 'Ukuran bayangan kita di cermin datar akan mengecil ketika kita berjalan mundur menjauh dari cermin.',
      truth: 'Ukuran fisik bayangan (h\') selalu konstan dan tepat sama dengan tinggi benda asli (h\' = h).',
      explanation:
        'Jarak bayangan selalu sama dengan jarak benda terhadap cermin (s\' = s). Ketika Anda mundur, bayangan tampak lebih kecil semata-mata karena sudut pandang visual mata (subtended angle) mengecil terhadap retina mata kita, persis seperti pohon di kejauhan yang tampak kecil tapi ukuran fisiknya tidak berubah!',
      recommendedLab: 'reflection' as const,
    },
    {
      id: 3,
      myth: 'Hanya ada 2 atau 3 sinar yang dipantulkan oleh cermin.',
      truth: 'Miliaran berkas sinar memancar ke segala arah, namun cukup 2 sinar saja untuk menemukan titik bayangan.',
      explanation:
        'Di alam nyata, setiap titik benda memancarkan tak terhingga banyaknya berkas sinar. Dalam fisika dan simulasi REFLECTA, kita cukup melacak 2 sinar per titik sudut karena 2 garis yang berpotongan sudah cukup untuk menentukan lokasi bayangan secara presisi tanpa membuat gambar berantakan!',
      recommendedLab: 'reflection' as const,
    },
    {
      id: 4,
      myth: 'Bayangan maya (virtual image) adalah halusinasi dan tidak dapat dilihat atau difoto dengan kamera.',
      truth: 'Bayangan maya adalah berkas sinar nyata yang memancar menyebar (divergen) dan dapat dilihat serta difoto.',
      explanation:
        'Disebut "maya" bukan berarti khayalan, melainkan karena sinar-sinar pantulnya tidak bertemu langsung di depan cermin, melainkan seolah-olah berasal dari titik semu di belakang cermin. Lensa mata manusia atau kamera dapat memfokuskan berkas divergen ini sehingga bayangan maya tampak sangat jelas.',
      recommendedLab: 'special_rays' as const,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-700 uppercase">
          <span>PUSAT PENGETAHUAN FISIKA OPTIK</span>
          <span aria-hidden="true">&bull;</span>
          <span>TIM ANTI GRAVITASI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Konsep Dasar & Pelurusan Miskonsepsi Fisika
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Membongkar miskonsepsi umum fisika dengan fakta ilmiah yang mudah dimengerti anak-anak dan siswa!
        </p>

        {/* Mascot Lumi Note */}
        <div className="flex items-center gap-3 p-3 bg-sky-50/80 border border-sky-200 rounded-2xl max-w-2xl">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-xs bg-sky-900">
            <img src="/src/assets/images/reflecta_mascot_lumi_1794128572379.jpg" alt="Lumi" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-sky-900 font-medium leading-relaxed">
            <strong>Pesan Sahabat Lumi:</strong> &ldquo;Jangan biarkan miskonsepsi membuatmu ragu pada fisika! Baca fakta sains di bawah ini, lalu buktikan sendiri di lab interaktif!&rdquo;
          </p>
        </div>
      </div>

      {/* Segmented Topic Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setSelectedTopic('misconceptions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedTopic === 'misconceptions'
              ? 'bg-amber-400 text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💡 4 Miskonsepsi Siswa
        </button>
        <button
          onClick={() => setSelectedTopic('reflection')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedTopic === 'reflection'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔬 Hukum Pemantulan (i = r)
        </button>
        <button
          onClick={() => setSelectedTopic('curved')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedTopic === 'curved'
              ? 'bg-indigo-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📐 Cermin Cekung & Cembung
        </button>
      </div>

      {/* Topic Content: Misconceptions */}
      {selectedTopic === 'misconceptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {misconceptions.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Myth */}
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Miskonsepsi #{item.id}</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    &ldquo;{item.myth}&rdquo;
                  </p>
                </div>

                {/* Truth */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Fakta Ilmiah</span>
                  </div>
                  <p className="text-xs font-bold leading-relaxed">
                    {item.truth}
                  </p>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {item.explanation}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => onGoToLab(item.recommendedLab)}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <span>Buktikan Langsung di Praktikum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Topic Content: Reflection Law */}
      {selectedTopic === 'reflection' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-sky-700 text-sm font-bold uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <span>Hukum Pemantulan Cahaya</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 space-y-1.5">
              <span className="text-xs font-bold font-mono text-sky-800 uppercase">Hukum I</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                &ldquo;Sinar datang, sinar pantul, dan garis normal berada pada satu bidang datar yang sama.&rdquo;
              </p>
            </div>

            <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 space-y-1.5">
              <span className="text-xs font-bold font-mono text-sky-800 uppercase">Hukum II</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                &ldquo;Sudut datang (i) sama besar dengan sudut pantul (r), diukur terhadap garis normal bidang cermin.&rdquo;
              </p>
              <div className="font-mono text-sky-700 font-bold text-xs pt-1">
                &theta; datang (i) = &theta; pantul (r)
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Mengapa Cukup 2 Sinar?</strong> Dalam geometri Euclid, dua garis lurus yang berpotongan hanya dapat bertemu di tepat <strong>satu titik unik</strong>. Karena itu, dua berkas sinar datang dari satu titik sudut objek yang memantul di cermin sudah secara sempurna dan matematis menentukan letak bayangan sudut tersebut!
          </div>

          <div>
            <button
              onClick={() => onGoToLab('reflection')}
              className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors"
            >
              Buka Lab Praktikum Refleksi
            </button>
          </div>
        </div>
      )}

      {/* Topic Content: Curved Mirrors */}
      {selectedTopic === 'curved' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-indigo-700 text-sm font-bold uppercase tracking-wider">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Cermin Sferis Cekung & Cembung</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5">
              <span className="font-bold text-indigo-900 block text-sm">Cermin Cekung (Konvergen):</span>
              <p className="text-slate-700 leading-relaxed">
                Memiliki nilai fokus positif (<code className="font-mono text-indigo-700 font-bold">+f</code>) di depan cermin. Bersifat mengumpulkan berkas sinar. Jika benda diletakkan di luar fokus, bayangannya nyata dan terbalik. Jika diletakkan dekat cermin (Ruang I), bayangannya maya, tegak, dan diperbesar seperti cermin rias!
              </p>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5">
              <span className="font-bold text-indigo-900 block text-sm">Cermin Cembung (Divergen):</span>
              <p className="text-slate-700 leading-relaxed">
                Memiliki nilai fokus negatif (<code className="font-mono text-indigo-700 font-bold">-f</code>) di belakang cermin. Bersifat menyebarkan berkas sinar. Bayangan yang dihasilkan <strong>selalu maya, tegak, dan diperkecil</strong>, sehingga sangat cocok untuk kaca spion kendaraan agar jangkauan pandangan lebih luas!
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => onGoToLab('special_rays')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors"
            >
              Buka Modul Sinar Istimewa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
