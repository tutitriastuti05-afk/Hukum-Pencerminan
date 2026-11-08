import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  Zap,
  BookOpen,
  Smile,
  Lightbulb,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  badge: string;
  relatedLab: 'reflection' | 'special_rays';
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    badge: 'Hukum Snellius i = r',
    question:
      'Sebuah berkas sinar laser datang mengenai cermin datar dengan sudut 35° terhadap garis normal. Berapakah besar sudut pantul yang terbentuk terhadap garis normal?',
    options: [
      { label: 'A', text: '17.5° (separuh dari sudut datang)' },
      { label: 'B', text: '35° (sama persis dengan sudut datang)' },
      { label: 'C', text: '55° (sudut penyiku terhadap cermin)' },
      { label: 'D', text: '70° (dua kali lipat sudut datang)' },
    ],
    correctAnswer: 'B',
    explanation:
      'Berdasarkan Hukum Snellius Pemantulan Cahaya, besar sudut datang (i) SELALU SAMA dengan besar sudut pantul (r) diukur terhadap garis normal: i = r = 35°.',
    relatedLab: 'reflection',
  },
  {
    id: 2,
    badge: 'Miskonsepsi Bentuk Objek',
    question:
      'Seorang siswa beranggapan bahwa hukum pemantulan cahaya HANYA berlaku jika objek berbentuk garis lurus atau cermin datar. Apakah pernyataan siswa tersebut benar menurut kaidah fisika?',
    options: [
      { label: 'A', text: 'Benar, karena permukaan lengkung membiaskan cahaya bukan memantulkannya.' },
      { label: 'B', text: 'Salah! Hukum i = r berlaku di setiap titik permukaan pantul pada segitiga, lingkaran, bintang, maupun cermin sferis.' },
      { label: 'C', text: 'Benar, karena pada lingkaran dan bintang tidak memiliki garis normal.' },
      { label: 'D', text: 'Salah, hukum pemantulan hanya berlaku di ruang hampa udara.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Hukum pemantulan berlaku secara lokal pada setiap titik singgung permukaan cermin. Mau bendanya berbentuk garis, segitiga, lingkaran, bintang, atau bebas, di setiap titik pantul berlaku i = r!',
    relatedLab: 'reflection',
  },
  {
    id: 3,
    badge: 'Garis Normal & Titik Pusat O',
    question:
      'Dari manakah garis normal N ditarik pada cermin sferis (cekung/cembung) dan bagaimana orientasinya terhadap permukaan cermin?',
    options: [
      { label: 'A', text: 'Dari ujung benda asli dan membentuk sudut acak 45°.' },
      { label: 'B', text: 'Dari Titik Pusat Kelengkungan O dan menembus permukaan cermin tegak lurus 90°.' },
      { label: 'C', text: 'Dari titik fokus F dan membentuk garis sejajar sumbu utama.' },
      { label: 'D', text: 'Dari titik sembarang di belakang cermin tanpa aturan khusus.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Garis normal N berhulu dari Titik Pusat Kelengkungan O (atau C = 2F) dan selalu tegak lurus 90° menembus permukaan cermin sebagai garis acuan nol derajat untuk mengukur sudut datang dan sudut pantul.',
    relatedLab: 'reflection',
  },
  {
    id: 4,
    badge: 'Metode 2 Sinar REFLECTA',
    question:
      'Mengapa dalam praktikum REFLECTA kita cukup menggunakan 2 berkas sinar datang untuk setiap titik sudut objek?',
    options: [
      { label: 'A', text: 'Karena cermin fisika hanya mampu memantulkan maksimal 2 garis sinar.' },
      { label: 'B', text: 'Karena perpotongan 2 garis sinar pantul sudah cukup menentukan lokasi titik bayangan secara presisi tanpa membuat mata pusing.' },
      { label: 'C', text: 'Karena berkas sinar ketiga selalu diserap habis oleh cermin.' },
      { label: 'D', text: 'Karena jika lebih dari 2 sinar maka hukum fisika tidak berlaku.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dua garis lurus yang berpotongan di geometri sudah mengunci satu titik koordinat (x, y) unik. Menggunakan 2 sinar per sudut menghasilkan rekonstruksi bayangan yang 100% presisi dan bersih dipandang.',
    relatedLab: 'reflection',
  },
  {
    id: 5,
    badge: 'Bayangan Maya Cermin Cekung',
    question:
      'Pada cermin cekung, kapankah bayangan yang dihasilkan akan bersifat MAYA, TEGAK, dan DIPERBESAR?',
    options: [
      { label: 'A', text: 'Ketika benda diletakkan sangat jauh di luar pusat kelengkungan O.' },
      { label: 'B', text: 'Ketika benda diletakkan tepat di titik pusat kelengkungan O.' },
      { label: 'C', text: 'Ketika jarak benda lebih kecil daripada jarak fokusnya (s < f atau di Ruang I).' },
      { label: 'D', text: 'Cermin cekung tidak pernah bisa menghasilkan bayangan maya.' },
    ],
    correctAnswer: 'C',
    explanation:
      'Ketika benda berada di antara cermin dan titik fokus (s < f / Ruang I), sinar pantulnya divergen (menyebar), sehingga perpanjangan sinar di belakang cermin (Ruang IV) berpotongan membentuk bayangan maya, tegak, dan diperbesar.',
    relatedLab: 'special_rays',
  },
  {
    id: 6,
    badge: 'Sinar Istimewa Cermin Sferis',
    question:
      'Sebuah berkas sinar datang sejajar dengan sumbu utama menuju permukaan cermin cekung. Ke manakah arah pantulan sinar tersebut?',
    options: [
      { label: 'A', text: 'Dipantulkan kembali melalui jalur semula.' },
      { label: 'B', text: 'Dipantulkan melewati Titik Fokus Utama F.' },
      { label: 'C', text: 'Dipantulkan menjauhi cermin seolah-olah dari pusat maya.' },
      { label: 'D', text: 'Dipantulkan tegak lurus ke atas menuju langit-langit.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Salah satu dari 3 Sinar Istimewa cermin cekung: "Sinar datang sejajar sumbu utama akan dipantulkan melalui titik fokus utama (F)".',
    relatedLab: 'special_rays',
  },
];

interface QuizModeProps {
  onGoToLab: (lab: 'reflection' | 'special_rays') => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ onGoToLab }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  const handleSelectOption = (optLabel: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optLabel);
    setIsAnswerSubmitted(true);

    if (optLabel === currentQ.correctAnswer) {
      setScore((prev) => prev + 100);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-indigo-300/80 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 p-6 sm:p-8 text-white shadow-xl">
      {/* Ambient background particle glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-300 uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mode Evaluasi Interaktif &bull; Refleksi Pintar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display bg-gradient-to-r from-white via-sky-200 to-amber-200 bg-clip-text text-transparent">
            Quiz Mode: Tantangan Pemantulan Cahaya
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Uji pemahamanmu setelah membaca materi singkat di atas dan raih skor tertinggi!
          </p>
        </div>

        {/* Live Score & Streak */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-center shadow-xs">
            <span className="text-[10px] text-slate-300 uppercase block font-semibold">Skor</span>
            <span className="text-lg font-black text-amber-300 font-mono">{score}</span>
          </div>
          {streak > 1 && (
            <div className="bg-amber-400/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/40 text-center shadow-xs animate-bounce">
              <span className="text-[10px] text-amber-300 uppercase block font-bold">Combo!</span>
              <span className="text-sm font-black text-amber-300 font-mono">🔥 {streak}x</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {!isFinished ? (
        <div className="relative z-10 pt-6 space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="bg-sky-400 text-slate-900 px-2 py-0.5 rounded text-[11px] font-black">
                  Soal {currentIdx + 1}
                </span>
                <span>dari {QUIZ_QUESTIONS.length}</span>
              </span>
              <span className="text-amber-300 font-mono text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                {currentQ.badge}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-md">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.label;
              const isOptionCorrect = opt.label === currentQ.correctAnswer;

              let btnStyle =
                'bg-white/10 hover:bg-white/15 border-white/20 text-slate-100 hover:border-sky-300';

              if (isAnswerSubmitted) {
                if (isOptionCorrect) {
                  btnStyle =
                    'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/20';
                } else if (isSelected && !isOptionCorrect) {
                  btnStyle =
                    'bg-rose-500/30 border-rose-400 text-rose-200 shadow-md shadow-rose-500/20';
                } else {
                  btnStyle = 'bg-white/5 border-white/10 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt.label}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(opt.label)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isAnswerSubmitted && isOptionCorrect
                        ? 'bg-emerald-400 text-slate-900'
                        : isAnswerSubmitted && isSelected && !isOptionCorrect
                        ? 'bg-rose-400 text-slate-900'
                        : isSelected
                        ? 'bg-sky-400 text-slate-900'
                        : 'bg-white/15 text-white'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 pt-0.5">
                    {opt.text}
                  </span>
                  {isAnswerSubmitted && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
                  )}
                  {isAnswerSubmitted && isSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Mascot Lumi Commentary after Answer */}
          {isAnswerSubmitted && (
            <div className="space-y-4 animate-fadeIn">
              {/* Scientific Explanation Box */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border-2 backdrop-blur-md ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-400/80 text-emerald-100'
                    : 'bg-rose-950/70 border-rose-400/80 text-rose-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300">Jawaban Tepat! (+100 Poin)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-300">Kurang Tepat, Jangan Menyerah!</span>
                    </>
                  )}
                </div>

                <div className="text-xs sm:text-sm leading-relaxed space-y-1.5 opacity-95">
                  <div className="font-bold flex items-center gap-1 text-amber-300">
                    <Lightbulb className="w-4 h-4" /> Fakta Sains:
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              </div>

              {/* Action Buttons: Next Question & Test in Lab */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => onGoToLab(currentQ.relatedLab)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-sky-200 bg-sky-900/60 hover:bg-sky-800/80 border border-sky-400/40 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-sky-300" />
                  <span>Buktikan Langsung di Lab {currentQ.relatedLab === 'reflection' ? 'Refleksi' : 'Sinar Istimewa'}</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ml-auto"
                >
                  <span>
                    {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen when finished */
        <div className="relative z-10 pt-8 pb-4 text-center space-y-6 max-w-xl mx-auto">
          {/* Trophy & Badge */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-900 shadow-2xl border-4 border-white/30 animate-bounce">
            <Trophy className="w-12 h-12 text-slate-900" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              Evaluasi Selesai!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              {score === 600
                ? '🌟 Sempurna! Kamu Ahli Optika Sejati!'
                : score >= 400
                ? '🎉 Hebat! Pemahaman Fisikamu Mantap!'
                : '💡 Terus Belajar, Kamu Pasti Bisa!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Kamu berhasil menjawab dengan total skor{' '}
              <span className="font-mono font-bold text-amber-300 text-base">{score}</span> dari{' '}
              <span className="font-mono font-bold text-white text-base">600 Poin</span> (
              {Math.round((score / 600) * 100)}%).
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Kuis Lagi</span>
            </button>

            <button
              onClick={() => onGoToLab('reflection')}
              className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Eksplorasi di Lab Refleksi 2 Sinar</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
