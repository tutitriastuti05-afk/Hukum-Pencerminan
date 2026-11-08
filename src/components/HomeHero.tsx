import React, { useState } from 'react';
import { ReflectaLogo } from './ReflectaLogo';
import { QuizMode } from './Dashboard/QuizMode';
import {
  ArrowRight,
  Compass,
  ShieldAlert,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Maximize2,
  HelpCircle,
  Lightbulb,
  Smartphone,
  Smile,
  Zap,
  Play,
  RotateCcw,
  Trophy,
} from 'lucide-react';

interface HomeHeroProps {
  onStartExperiment: () => void;
  onSelectTab: (tab: 'home' | 'reflection' | 'special_rays' | 'concepts') => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartExperiment,
  onSelectTab,
}) => {
  // Interactive mini-reflection sandbox widget on dashboard
  const [miniAngle, setMiniAngle] = useState<number>(35);

  // Tim ANTI GRAVITASI members with personal quotes and specialized roles
  const teamMembers = [
    {
      name: 'Tri Astuti',
      role: 'Pengembang & Desain Instruksional',
      desc: 'Inovasi kurikulum optika & perancangan materi fisika interaktif ramah anak',
      quote: 'Fisika menjadi indah saat hukum alam dapat dibuktikan langsung dengan mata kepala sendiri.',
      color: 'from-amber-400 via-orange-500 to-amber-600',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      glowColor: 'shadow-amber-500/20 border-amber-300',
    },
    {
      name: 'Afanin Izdihar',
      role: 'Pengembang & Riset Pedagogis',
      desc: 'Analisis miskonsepsi siswa & perumusan visualisasi presisi 2 sinar pantul',
      quote: 'Cukup 2 sinar untuk mengungkap letak bayangan tanpa membuat siswa pusing.',
      color: 'from-sky-400 via-blue-500 to-cyan-600',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      glowColor: 'shadow-sky-500/20 border-sky-300',
    },
    {
      name: 'Nazla Kamilatunnisa',
      role: 'Pengembang & Ahli Konseptual',
      desc: 'Validasi perhitungan sudut pemantulan & berkas sinar istimewa cermin sferis',
      quote: 'Hukum i = r berlaku konsisten di setiap titik permukaan cermin apa pun bentuknya.',
      color: 'from-indigo-400 via-purple-500 to-indigo-600',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      glowColor: 'shadow-indigo-500/20 border-indigo-300',
    },
    {
      name: 'Noval Ramdani',
      role: 'Pengembang & Arsitek Simulasi',
      desc: 'Implementasi interaktivitas geometris, dock Tinkercad, & performa visual kanvas',
      quote: 'Simulasi interaktif adalah jembatan terbaik antara rumus matematika dan intuisi visual.',
      color: 'from-emerald-400 via-teal-500 to-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      glowColor: 'shadow-emerald-500/20 border-emerald-300',
    },
    {
      name: 'Nazzar Wati',
      role: 'Pengembang & Evaluasi Pengguna',
      desc: 'Pengujian pengalaman belajar siswa & kenyamanan navigasi layar smartphone',
      quote: 'Belajar fisika harus menyenangkan, ramah anak, dan bebas dari rasa bingung.',
      color: 'from-rose-400 via-pink-500 to-rose-600',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      glowColor: 'shadow-rose-500/20 border-rose-300',
    },
  ];

  // Calculate coordinates for mini dashboard sandbox
  const rad = (miniAngle * Math.PI) / 180;
  const rayLen = 100;
  const hitX = 140;
  const hitY = 90;
  const incStartX = hitX - rayLen * Math.sin(rad);
  const incStartY = hitY - rayLen * Math.cos(rad);
  const refEndX = hitX + rayLen * Math.sin(rad);
  const refEndY = hitY - rayLen * Math.cos(rad);

  return (
    <div className="space-y-8 sm:space-y-10 pb-12">
      {/* 1. HERO BANNER: Futuristic Optics Showcase */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-sky-300/80 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 p-6 sm:p-10 shadow-2xl text-white">
        {/* Ambient Optics Background Artwork with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-screen pointer-events-none overflow-hidden">
          <img
            src="/src/assets/images/reflecta_optical_lab_banner_1794129173984.jpg"
            alt="Laboratorium Optika REFLECTA"
            className="w-full h-full object-cover scale-105 filter blur-xs"
          />
        </div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-500/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission, Identity & CTA */}
          <div className="lg:col-span-7 space-y-5">
            {/* Team Anti Gravitasi Badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-sky-200 bg-sky-900/80 border border-sky-400/40 w-fit px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                TIM ANTI GRAVITASI
              </span>
              <span className="text-sky-400/80">&bull;</span>
              <span className="text-sky-200">Laboratorium Edukasi Fisika Optik</span>
            </div>

            {/* Logo */}
            <div className="pt-1">
              <ReflectaLogo size="xl" showSubtitle={false} />
            </div>

            {/* Tagline */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-sky-100 to-amber-200 bg-clip-text text-transparent"
              style={{ textWrap: 'balance' }}
            >
              &ldquo;See the Light, Understand the Law.&rdquo;
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Selamat datang di <strong>REFLECTA</strong>! Media praktikum fisika optik interaktif yang dirancang khusus oleh <strong>Tim ANTI GRAVITASI</strong> untuk membuktikan bahwa Hukum Pemantulan Cahaya (<span className="text-amber-300 font-mono font-bold">i = r</span>) berlaku di <strong>setiap titik permukaan</strong> objek datar, lengkung, maupun bentuk bebas, tanpa membuat pusing dan nyaman di smartphone.
            </p>

            {/* Key Value Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> 2 Sinar Presisi (Nyaman di Mata)
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Garis Normal dari Titik O (90°)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-300" /> Quiz Mode Evaluasi Pemahaman
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-300" /> Ramah Layar Sentuh HP
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartExperiment}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Mulai Praktikum 2 Sinar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('special_rays')}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-sky-100 hover:text-white bg-white/10 hover:bg-white/15 border border-sky-400/30 rounded-xl transition-all shadow-md backdrop-blur-md cursor-pointer"
              >
                <Layers className="w-4 h-4 text-sky-300" />
                <span>Modul Cermin Lengkung (Sinar Istimewa)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Mini Ray Sandbox + Lumi Card */}
          <div className="lg:col-span-5 relative flex flex-col gap-4">
            {/* Interactive Live Mini-Sandbox Widget */}
            <div className="rounded-2xl border-2 border-sky-400/50 bg-slate-900/90 backdrop-blur-md p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sky-500/20 text-xs">
                <span className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-400" /> Live Mini Sandbox Pemantulan
                </span>
                <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30">
                  i = {miniAngle}° | r = {miniAngle}°
                </span>
              </div>

              {/* Mini SVG Demo */}
              <div className="w-full h-36 bg-slate-950/80 rounded-xl border border-sky-900/60 relative overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 280 140" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="20" y1="90" x2="260" y2="90" stroke="#38BDF8" strokeWidth="3" />
                  <line x1="140" y1="10" x2="140" y2="125" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="145" y="24" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    Normal N (90°)
                  </text>

                  {/* Incident ray */}
                  <line
                    x1={incStartX}
                    y1={incStartY}
                    x2={hitX}
                    y2={hitY}
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx={incStartX} cy={incStartY} r="4" fill="#F59E0B" />
                  <text x={incStartX - 8} y={incStartY - 6} fill="#FCD34D" fontSize="9" fontWeight="bold">
                    Sinar Datang
                  </text>

                  {/* Reflected ray */}
                  <line
                    x1={hitX}
                    y1={hitY}
                    x2={refEndX}
                    y2={refEndY}
                    stroke="#0284C7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx={refEndX} cy={refEndY} r="4" fill="#0284C7" />
                  <text x={refEndX - 10} y={refEndY - 6} fill="#38BDF8" fontSize="9" fontWeight="bold">
                    Sinar Pantul
                  </text>

                  {/* Hit point */}
                  <circle cx={hitX} cy={hitY} r="4.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />

                  {/* Mirror label */}
                  <text x="20" y="106" fill="#64748B" fontSize="9" fontWeight="bold">
                    Permukaan Cermin Datar
                  </text>
                </svg>
              </div>

              {/* Slider Controller */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                  <span>Geser Sudut Datang (i):</span>
                  <span className="font-mono text-amber-300 font-bold">{miniAngle}°</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={miniAngle}
                  onChange={(e) => setMiniAngle(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Mascot Lumi Card */}
            <div className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-r from-sky-900/90 via-indigo-900/90 to-slate-900/90 backdrop-blur-md p-3.5 shadow-lg flex items-center gap-3.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-sky-950">
                <img
                  src="/src/assets/images/reflecta_mascot_lumi_1794128572379.jpg"
                  alt="Lumi Maskot Optika"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded-tl">
                  LUMI
                </span>
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Maskot Resmi Tim Anti Gravitasi</span>
                </div>
                <p className="text-xs text-slate-200 leading-snug">
                  &ldquo;Ayo uji langsung sudut ini di kanvas praktikum! Aku siap memandu setiap langkahmu!&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TUJUAN PENGEMBANGAN & MELURUSKAN MISKONSEPSI SISWA */}
      <section className="rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-100/90 via-white to-orange-100/70 p-6 sm:p-8 shadow-md space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-200/60 w-fit px-3 py-1 rounded-full border border-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Tujuan Pengembangan &bull; Meluruskan Miskonsepsi Siswa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            Mengapa Tim ANTI GRAVITASI Membangun REFLECTA?
          </h2>
          <p className="text-sm text-slate-700 max-w-3xl leading-relaxed font-medium">
            Dalam pembelajaran fisika, banyak siswa mengalami <strong>miskonsepsi</strong> bahwa hukum pemantulan cahaya hanya berlaku pada cermin atau benda datar. Ketika dihadapkan pada benda segitiga, lingkaran, bintang, atau cermin lengkung, siswa sering mengira hukum pemantulan tidak lagi berlaku. <strong>REFLECTA hadir untuk meluruskan hal ini secara visual dan interaktif!</strong>
          </p>
        </div>

        {/* 3 Misconception vs Scientific Fact Cards (Vibrant, Non-plain styling) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-white to-rose-50/80 p-5 rounded-2xl border-2 border-rose-300 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ❌
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                  Miskonsepsi #1
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Hanya Berlaku pada Benda/Cermin Datar
              </h3>
              <p className="text-xs text-rose-900 bg-rose-100/70 p-2.5 rounded-xl font-medium border border-rose-200 leading-relaxed">
                &ldquo;Hukum pemantulan i = r cuma berlaku kalau bentuk bendanya garis lurus atau cermin datar.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-rose-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Fakta Fisika Sebenarnya:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Hukum pemantulan berlaku <strong>pada setiap titik pantul</strong>, apa pun bentuk objeknya (segitiga, lingkaran, persegi, bintang, bebas, maupun cermin sferis).
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-white to-amber-50/80 p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ❌
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Miskonsepsi #2
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Garis Normal Selalu Vertikal atau Horizontal
              </h3>
              <p className="text-xs text-amber-900 bg-amber-100/70 p-2.5 rounded-xl font-medium border border-amber-200 leading-relaxed">
                &ldquo;Garis normal itu patokannya selalu tegak lurus ke atas atau ke samping seperti sumbu kartesius.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-amber-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Fakta Fisika Sebenarnya:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Garis normal adalah garis yang <strong>tegak lurus 90° terhadap bidang singgung cermin</strong>, berhulu dari <strong>Titik Pusat O</strong> dan menembus cermin sebagai patokan nol sudut datang!
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-b from-white to-purple-50/80 p-5 rounded-2xl border-2 border-purple-300 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ❌
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  Miskonsepsi #3
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Satu Garis Sinar Cukup Menemukan Bayangan
              </h3>
              <p className="text-xs text-purple-900 bg-purple-100/70 p-2.5 rounded-xl font-medium border border-purple-200 leading-relaxed">
                &ldquo;Cukup bikin satu garis sinar pantul saja sudah bisa tahu letak bayangan benda.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-purple-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Fakta Fisika Sebenarnya:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Dibutuhkan <strong>minimal 2 berkas sinar datang yang memantul dan saling berpotongan</strong> untuk mengunci lokasi titik bayangan secara pasti tanpa ambigu!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PENJELASAN MATERI OPTIKA GEOMETRI RINGKAS */}
      <section className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100/70 w-fit px-3 py-1 rounded-full border border-indigo-200">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Materi Optika Geometri Ringkas</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Tiga Pondasi Utama Hukum Pemantulan Cahaya
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700">
          {/* Topic 1 */}
          <div className="bg-gradient-to-b from-sky-50/80 to-white p-5 rounded-2xl border-2 border-sky-300 shadow-2xs space-y-2.5">
            <div className="font-extrabold text-sm text-sky-900 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs">1</span>
              <span>Hukum Snellius Pemantulan</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Cahaya yang mengenai permukaan cermin akan dipantulkan sedemikian rupa sehingga:
            </p>
            <div className="bg-sky-100/70 p-3 rounded-xl border border-sky-200 space-y-1 font-mono text-slate-800">
              <div>&bull; Sinar datang, garis normal, dan sinar pantul terletak pada satu bidang datar.</div>
              <div>&bull; Sudut datang sama dengan sudut pantul (<span className="text-sky-700 font-bold">i = r</span>).</div>
            </div>
          </div>

          {/* Topic 2 */}
          <div className="bg-gradient-to-b from-indigo-50/80 to-white p-5 rounded-2xl border-2 border-indigo-300 shadow-2xs space-y-2.5">
            <div className="font-extrabold text-sm text-indigo-900 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Bayangan Maya vs Bayangan Nyata</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Perbedaan berdasarkan berkas sinar yang berpotongan:
            </p>
            <div className="bg-indigo-100/70 p-3 rounded-xl border border-indigo-200 space-y-1 text-slate-700 leading-snug">
              <div>&bull; <strong>Bayangan Maya</strong>: Perpotongan perpanjangan sinar di belakang cermin, tegak, tampak di dalam cermin.</div>
              <div>&bull; <strong>Bayangan Nyata</strong>: Perpotongan langsung sinar pantul di depan cermin, terbalik, dapat ditangkap layar.</div>
            </div>
          </div>

          {/* Topic 3 */}
          <div className="bg-gradient-to-b from-amber-50/80 to-white p-5 rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2.5">
            <div className="font-extrabold text-sm text-amber-900 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs">3</span>
              <span>Cermin Datar, Cekung, dan Cembung</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Karakteristik pembentukan bayangan:
            </p>
            <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-200 space-y-1 text-slate-700 leading-snug">
              <div>&bull; <strong>Datar</strong>: Bayangan selalu maya, tegak, sama besar (<span className="font-mono text-amber-800">s' = -s, M = 1</span>).</div>
              <div>&bull; <strong>Cekung</strong>: Konvergen; maya jika benda di depan fokus (<span className="font-mono text-amber-800">s &lt; f</span>).</div>
              <div>&bull; <strong>Cembung</strong>: Divergen; bayangan selalu maya, tegak, diperkecil.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODUL LABORATORIUM VIRTUAL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Dua Ruang Eksperimen Interaktif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Pilih Laboratorium Eksperimen
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lab 1 Card */}
          <div
            onClick={onStartExperiment}
            className="group relative overflow-hidden rounded-3xl border-2 border-sky-400 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
                  🔬
                </div>
                <span className="text-xs font-extrabold text-sky-900 bg-amber-300 px-3 py-1 rounded-full shadow-sm">
                  Metode 2 Sinar &bull; Langkah 1-8
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display group-hover:text-amber-300 transition-colors">
                  Lab Praktikum Refleksi (Reflection Law Lab)
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-sky-100 leading-relaxed">
                  Uji hukum pemantulan pada aneka bentuk benda (garis, segitiga, persegi, lingkaran, bintang, bentuk bebas). Klik langsung sudut di kanvas, tarik garis normal dari Titik O menembus cermin, dan buktikan bayangan maya terbentuk presisi!
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-white/90">
                <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">6 Pilihan Bentuk Objek</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">Cermin Datar/Cekung/Cembung</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">Tinkercad Dock Geser</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/20 flex items-center justify-between text-xs font-extrabold text-amber-300">
              <span>Buka Lab Praktikum Refleksi Sekarang</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Lab 2 Card */}
          <div
            onClick={() => onSelectTab('special_rays')}
            className="group relative overflow-hidden rounded-3xl border-2 border-indigo-400 bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
                  📐
                </div>
                <span className="text-xs font-extrabold text-indigo-900 bg-sky-300 px-3 py-1 rounded-full shadow-sm">
                  3 Sinar Istimewa
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display group-hover:text-sky-300 transition-colors">
                  Special Rays Lab (Sinar Istimewa Cermin Lengkung)
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  Eksplorasi cermin cekung dan cermin cembung dengan 3 berkas sinar istimewa standar buku teks. Dilengkapi preset bayangan maya di depan fokus (s &lt; f) dan kalkulator rumus Gauss real-time!
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-white/90">
                <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">Titik Fokus F &amp; Pusat C</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">Preset Bayangan Maya (s &lt; f)</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">Substitusi 1/f = 1/s + 1/s'</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/20 flex items-center justify-between text-xs font-extrabold text-sky-300">
              <span>Buka Lab Sinar Istimewa Sekarang</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPOTLIGHT MASKOT LUMI & KEMUDAHAN SMARTPHONE */}
      <section className="rounded-3xl border-2 border-sky-400 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 sm:p-8 shadow-md space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Mascot Image & Speech Card */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-br from-white to-sky-50 p-5 rounded-2xl border-2 border-sky-300 shadow-md">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-lg bg-sky-950">
              <img
                src="/src/assets/images/reflecta_mascot_lumi_1794128572379.jpg"
                alt="Lumi Si Robot Cahaya"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded shadow">
                LUMI
              </span>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                <Smile className="w-3 h-3 text-amber-500" /> Maskot Sahabat Belajar
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                Lumi Si Robot Foton
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Robot pintar pemandu optika yang siap memberikan tips interaktif, rumus cepat, dan membimbing praktikummu di setiap langkah!
              </p>
            </div>
          </div>

          {/* 3 Superpowers */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-b from-white to-sky-50 p-4 rounded-2xl border-2 border-sky-200 shadow-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                📐
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Metode 2 Sinar Presisi</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Hanya 2 sinar datang per sudut agar nyaman di mata dan titik perpotongan bayangan langsung terlihat jelas.
              </p>
            </div>

            <div className="bg-gradient-to-b from-white to-amber-50 p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                📱
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Ramah Layar Smartphone</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Navigasi bawah khusus HP, kanvas layar penuh tanpa berdesakan, dan kontrol sentuh yang responsif.
              </p>
            </div>

            <div className="bg-gradient-to-b from-white to-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 shadow-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                ✨
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Dock Tinkercad Geser</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Tarik pembatas sesukamu atau sembunyikan panel kontrol untuk memperbesar kanvas hingga 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. QUIZ MODE: TANTANGAN EVALUASI PEMANTULAN CAHAYA (DIBELAKANG MATERI) */}
      <QuizMode onGoToLab={(lab) => onSelectTab(lab)} />

      {/* 6. TIM PENGEMBANG ANTI GRAVITASI */}
      <section className="rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100/90 via-white to-purple-100/80 p-6 sm:p-8 shadow-md space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider bg-indigo-200/60 w-fit mx-auto px-3.5 py-1 rounded-full border border-indigo-300">
            <Users className="w-4 h-4 text-indigo-700" />
            <span>Profil Pengembang Aplikasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            Tim ANTI GRAVITASI
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Aplikasi edukasi <strong>REFLECTA</strong> dikembangkan dengan kolaborasi dan dedikasi tinggi oleh <strong>Tim ANTI GRAVITASI</strong> guna menghadirkan media pembelajaran fisika yang inovatif, menyenangkan, dan bebas miskonsepsi bagi siswa.
          </p>
        </div>

        {/* 5 Team Member Cards (Vibrant colorful cards, strictly correct names) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className={`bg-white/95 p-4 rounded-2xl border-2 ${member.glowColor} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between text-center space-y-3.5`}
            >
              <div className="space-y-2.5 flex flex-col items-center">
                {/* Avatar with initial */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.color} text-white flex items-center justify-center text-lg font-black shadow-md border-2 border-white`}
                >
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${member.badgeColor}`}
                  >
                    {member.role}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {member.desc}
                </p>

                {/* Personal Scientific Quote */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 w-full text-[10px] text-slate-600 italic leading-snug">
                  &ldquo;{member.quote}&rdquo;
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-indigo-700 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Tim ANTI GRAVITASI</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
