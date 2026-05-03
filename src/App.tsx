// (mantive todos os imports iguais aos seus)
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecentlyPlayed from './components/RecentlyPlayed';
import LivePlayerBar from './components/LivePlayerBar';
import ProgramDetail from './components/ProgramDetail';
import Playlist from './components/Playlist';
import ScheduleList from './components/ScheduleList';

import DevotionalPage from './pages/DevotionalPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MySoundsPage from './pages/MySoundsPage';
import ProfilePage from './pages/ProfilePage';
import FeaturedArtistsPage from './pages/FeaturedArtistsPage';
import PresentersPage from './pages/PresentersPage';
import NewReleasesPage from './pages/NewReleasesPage';
import LiveRecordingsPage from './pages/LiveRecordingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import FeedbackPage from './pages/FeedbackPage';
import EventsPage from './pages/EventsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import AppHomePage from './pages/AppHomePage';

import { SCHEDULES } from './constants';
import { Program } from './types';

const STREAM_URL = 'https://stream.zeno.fm/hvwifp8ezc6tv';
const METADATA_URL = 'https://api.zeno.fm/mounts/metadata/subscribe/hvwifp8ezc6tv';

const DEFAULT_COVER = '/icon-512.png';

interface LiveMetadata {
  artist: string;
  title: string;
}

/* -------------------- HOME BBC STYLE -------------------- */

const HomeBBC = ({
  isPlaying,
  liveMetadata,
  currentProgram,
  onListenClick,
  onNavigateToProgram,
  trackHistory
}: any) => {

  return (
    <>
      <section className="bg-[#f4f4f4] dark:bg-[#121212] py-12">
        <div className="max-w-6xl mx-auto px-4">

          <div className="grid md:grid-cols-[320px_1fr] gap-8">

            {/* ANEL + CAPA */}
            <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl p-6 flex items-center justify-center">
              <div className="relative w-56 h-56">

                {/* ANEL */}
                <div className={`absolute inset-0 rounded-full border-4 border-orange-500/30 ${isPlaying ? 'animate-spin' : ''}`} />

                {/* CAPA */}
                <div className="absolute inset-6 rounded-full overflow-hidden">
                  <img src={DEFAULT_COVER} className="w-full h-full object-cover"/>
                </div>

              </div>
            </div>

            {/* INFO */}
            <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl p-6 flex flex-col justify-between">

              <div>
                <p className="text-orange-500 font-bold uppercase text-sm mb-3">
                  On Air
                </p>

                <h1 className="text-4xl font-black">
                  Praise FM
                </h1>

                <p className="text-gray-500 mt-2">
                  Global Christian Radio
                </p>

                <div className="mt-6">
                  <p className="text-xs uppercase text-gray-400 mb-2">
                    Now Playing
                  </p>

                  <h2 className="text-2xl font-bold">
                    {liveMetadata?.title || 'Praise FM'}
                  </h2>

                  <p className="text-gray-500">
                    {liveMetadata?.artist || 'Live Radio'}
                  </p>
                </div>

                {currentProgram && (
                  <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">
                      Current Show
                    </p>
                    <h3 className="font-bold">
                      {currentProgram.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* BOTÃO */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={onListenClick}
                  className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center"
                >
                  {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                </button>

                <div>
                  <p className="font-bold">
                    {isPlaying ? 'Live Now' : 'Start Listening'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Praise FM stream
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <RecentlyPlayed tracks={trackHistory} />
    </>
  );
};