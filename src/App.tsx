/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { ReflectionLawLab } from './components/ReflectionLawLab/ReflectionLawLab';
import { SpecialRaysLab } from './components/SpecialRaysLab/SpecialRaysLab';
import { ConceptExplainer } from './components/ConceptExplainer';
import { ExportModal } from './components/ExportModal';
import { LumiCompanion } from './components/Mascot/LumiCompanion';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'reflection' | 'special_rays' | 'concepts'>('home');
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F0F8FF] text-slate-800 flex flex-col font-sans antialiased selection:bg-sky-200 selection:text-sky-900">
      {/* Top Bar (Height: 56px / 14) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Viewport: Fills 100% remaining height without page-level scroll, with mobile bottom bar clearance */}
      <main className="flex-1 w-full h-[calc(100vh-56px)] pb-14 md:pb-0 overflow-hidden flex flex-col">
        {activeTab === 'home' && (
          <div className="flex-1 overflow-y-auto bg-optics-ambient w-full">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <HomeHero
                onStartExperiment={() => setActiveTab('reflection')}
                onSelectTab={setActiveTab}
              />
            </div>
          </div>
        )}

        {activeTab === 'reflection' && <ReflectionLawLab />}

        {activeTab === 'special_rays' && <SpecialRaysLab />}

        {activeTab === 'concepts' && (
          <div className="flex-1 overflow-y-auto bg-optics-ambient w-full">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <ConceptExplainer onGoToLab={(lab) => setActiveTab(lab)} />
            </div>
          </div>
        )}
      </main>

      {/* Floating Interactive Mascot Lumi */}
      <LumiCompanion activeLab={activeTab} />

      {/* Export Report / CSV Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeLab={activeTab}
      />
    </div>
  );
}
