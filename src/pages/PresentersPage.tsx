import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Program } from '../types';
import { SCHEDULES } from '../constants';

interface PresentersPageProps {
  onNavigateToProgram: (program: Program) => void;
}

const PRESENTERS_DATA = [
  {
    name: 'Stancy Campbell',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/STANCY_CAMPBELL_xjkigb.webp',
    bio: 'The energetic voice behind the Morning Show. Stancy brings bright conversation, uplifting music, and a strong start to the day for listeners across the United States and beyond.',
    programTitle: 'Morning Show'
  },
  {
    name: 'Michael Ray',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/MICHAEL_RAY_yv1ehj.webp',
    bio: 'Michael Ray is your afternoon companion on Midday Grace, bringing worship, peace, and encouragement during the busiest part of the day.',
    programTitle: 'Midday Grace'
  },
  {
    name: 'DJ Zion',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/DJ_ZION_hyjxbd.webp',
    bio: 'DJ Zion brings energy, rhythm, and fresh urban gospel to Praise FM Flow, creating a bold and modern space for listeners who love faith with movement.',
    programTitle: 'Praise FM Flow'
  },
  {
    name: 'Sarah Jordan',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/SARAH_JORDAN_oehx8m.webp',
    bio: 'A champion for the new generation, Sarah hosts Future Artists, where she discovers and promotes independent faith-filled talent from around the world.',
    programTitle: 'Future Artists'
  },
  {
    name: 'Rachel Harris',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/RACHEL_HARRIS_rd59sb.webp',
    bio: 'Rachel makes your commute feel lighter. On Carpool, she mixes big songs, familiar favorites, and a smooth drive-home atmosphere.',
    programTitle: 'Carpool'
  },
  {
    name: 'Jake Hunter',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/JAKE_HUNTER_pyb2ji.webp',
    bio: 'Jake Hunter brings edge, attitude, and faith-driven energy to the evening lineup with Praise FM Rock.',
    programTitle: 'Praise FM Rock'
  },
  {
    name: 'Scott Turner',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/SCOTT_TURNER_wy3hrd.webp',
    bio: 'A historian of worship music, Scott hosts Praise FM Classics, taking listeners back to timeless songs that shaped generations.',
    programTitle: 'Praise FM Classics'
  },
  {
    name: 'Ava Brooks',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/AVA_BROOKS_yysmgc.webp',
    bio: 'Ava closes the day with calm, reflective sounds on Praise FM Chill, creating the perfect late-night atmosphere.',
    programTitle: 'Praise FM Chill'
  },
  {
    name: 'Daniel Brooks',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/MICHAEL_BROOKS_mdg7aa.webp',
    bio: 'The voice of the night. Daniel leads Midnight Grace with peaceful music and a calm overnight presence.',
    programTitle: 'Midnight Grace'
  },
  {
    name: 'Matt Riley',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/MATT_RILEY_hvzcam.webp',
    bio: 'On Sundays, Matt Riley hosts Sunday With Christ, guiding listeners through a more reflective and worship-centered morning.',
    programTitle: 'Sunday With Christ'
  }
];

const PresentersPage: React.FC<PresentersPageProps> = ({ onNavigateToProgram }) => {
  const findProgram = (title: string) => {
    for (let day = 0; day <= 6; day++) {
      const prog = (SCHEDULES[day] || []).find((p) => p.title === title);
      if (prog) return prog;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      <div className="bg-black text-white py-20 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-6">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em]">
              The Voices of Praise FM USA
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold uppercase tracking-tighter leading-none mb-8">
            Our
            <br />
            Presenters
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-normal tracking-tight leading-relaxed">
            Meet the voices behind the music, worship, inspiration, and special programming that shape the sound of Praise FM USA every day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRESENTERS_DATA.map((presenter) => {
            const program = findProgram(presenter.programTitle);

            return (
              <div
                key={presenter.name}
                className="flex flex-col group bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={presenter.image}
                    alt={presenter.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity"></div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[#ff6600] text-[10px] font-medium uppercase tracking-[0.3em] mb-2 block">
                      {presenter.programTitle}
                    </span>
                    <h2 className="text-3xl font-semibold text-white uppercase tracking-tighter">
                      {presenter.name}
                    </h2>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                    {presenter.bio}
                  </p>

                  <div className="mt-auto">
                    {program ? (
                      <button
                        onClick={() => onNavigateToProgram(program)}
                        className="w-full bg-[#ff6600] text-white py-4 px-6 text-[10px] font-medium uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors"
                      >
                        <span>View Program</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-full border border-gray-200 dark:border-white/10 py-4 px-6 text-[10px] text-center text-gray-400 uppercase tracking-[0.2em]">
                        Program page coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 bg-gray-50 dark:bg-[#111] p-12 md:p-20 flex flex-col items-center text-center border border-gray-100 dark:border-white/5">
          <h4 className="text-4xl font-semibold uppercase tracking-tighter dark:text-white mb-6">
            Want the full lineup?
          </h4>

          <p className="text-gray-500 max-w-xl text-sm mb-10 leading-relaxed">
            Explore the complete broadcasting schedule and discover every show that makes Praise FM USA your home for worship, encouragement, and great music.
          </p>

          <button
            onClick={() => {
              window.location.hash = '#/schedule';
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-[#ff6600] dark:hover:bg-[#ff6600] hover:text-white transition-all shadow-xl active:scale-95"
          >
            Full Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentersPage;