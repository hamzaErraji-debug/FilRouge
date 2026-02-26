'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrograms } from '@/app/lib/Redux/programSlice';
import { FaFire, FaHeart, FaDumbbell, FaBrain, FaCheckCircle } from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';
import axios from 'axios';

export default function ProgramDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [aiContent, setAiContent] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const programs = useSelector((state) => state.programs.items || []);
  const loading = useSelector((state) => state.programs.loading);

  const program = programs.find((p) => String(p.id) === id);

  // Map icon type strings to React icons
  const iconMap = {
    FaFire: <FaFire />,
    FaHeart: <FaHeart />,
    FaDumbbell: <FaDumbbell />,
    FaBrain: <FaBrain />,
  };

  // Fetch programs from Redux store
  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  const cleanJson = (text) => {
    return text.replace(/```json|```/g, '').trim();
  };

  // Load AI content from localStorage if exists
  useEffect(() => {
    const stored = localStorage.getItem(`aiContent-${id}`);
    if (stored) {
      setAiContent(JSON.parse(stored));
    }
  }, [id]);

  // Generate AI content
  useEffect(() => {
    if (!program || aiContent) return; // Skip if already loaded

    const generateAI = async () => {
      setLoadingAI(true);
      try {
        const prompt = `
          You are a fitness AI assistant. Based on the following program description, generate:

          1. AI Program Analysis: a short paragraph explaining what this program does.
          2. Objectives: 4 bullet points with {title, description}.
          3. Weekly Breakdown: 4 weeks with {title, name}.
          4. Why This Program: 4 reasons why someone should choose it.

          Program Description: ${program.description}

          Return only a valid JSON object with keys: analysis, objectives, weeks, reasons. Do NOT include any markdown.
        `;

        const res = await axios.post('/api/ai-description', { prompt });
        const cleaned = cleanJson(res.data.result);
        const json = JSON.parse(cleaned);

        // Fill missing objectives if AI didn't provide
        json.objectives = json.objectives?.map((obj, i) => ({
          iconType:
            i === 0
              ? 'FaFire'
              : i === 1
              ? 'FaHeart'
              : i === 2
              ? 'FaDumbbell'
              : 'FaBrain',
          title: obj.title,
          description: obj.description,
        })) || [
          { iconType: 'FaFire', title: 'Fat Oxidation', description: 'Max calorie burn' },
          { iconType: 'FaHeart', title: 'Cardio Endurance', description: 'Improve VO2 max' },
          { iconType: 'FaDumbbell', title: 'Muscle Retention', description: 'Preserve muscle mass' },
          { iconType: 'FaBrain', title: 'Mental Resilience', description: 'Build discipline' },
        ];

        // Fill missing weeks
        json.weeks = json.weeks || [
          { title: 'Week 1', name: 'Metabolic Conditioning & Foundation' },
          { title: 'Week 2', name: 'Strength Hypertrophy' },
          { title: 'Week 3', name: 'High-Intensity Intervals (HIIT)' },
          { title: 'Week 4', name: 'Peak Performance & Deload' },
        ];

        // Fill missing reasons
        json.reasons = json.reasons || [
          'Real-time AI adjustments based on fatigue',
          'Integration with wearable health data',
          'Video guides for every movement',
          'Community leaderboard & challenges',
          'Nutrition plan macro calculator included',
          'Mobile app offline access',
        ];

        setAiContent(json);
        localStorage.setItem(`aiContent-${id}`, JSON.stringify(json)); // persist
      } catch (err) {
        console.error('AI generation error:', err);
      } finally {
        setLoadingAI(false);
      }
    };

    generateAI();
  }, [program, aiContent, id]);

  if (loading || loadingAI) return <p className="text-white p-6 text-center">Loading...</p>;
  if (!program) return <p className="text-white p-6 text-center">Program not found</p>;
  if (!aiContent) return null;

  return (
    <main className="max-w-7xl mx-auto w-full space-y-8 md:space-y-12 pb-20">

      {/* Hero Section */}
      <div className="w-full relative h-100 md:h-125 lg:h-150 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-black/50"
          style={{ backgroundImage: `url(${program.image})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050b07] via-[#050b07]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#050b07] via-[#050b07]/50 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500 text-black text-xs font-black uppercase px-3 py-1 rounded">AI Generated Plan</span>
            <span className="bg-[#102216] border border-white/10 text-white text-xs font-bold uppercase px-3 py-1 rounded flex items-center gap-1">
              <MdTimer className="text-sm" /> {program.duration}
            </span>
            <span className="bg-[#102216] border border-white/10 text-white text-xs font-bold uppercase px-3 py-1 rounded flex items-center gap-1">
              <FaDumbbell className="text-sm" /> {program.level}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase text-white leading-none mb-2 drop-shadow-lg">
            {program.name}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl font-medium drop-shadow-md">{program.description}</p>
        </div>
      </div>

      <div className="px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Left Content */}
        <div className="lg:col-span-8 space-y-12">

          {/* AI Program Analysis */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FaBrain className="text-green-500" />
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">AI Program Analysis</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{aiContent.analysis}</p>
          </section>

          {/* Objectives */}
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-6 border-l-4 border-green-500 pl-4">Program Objectives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiContent.objectives.map((obj, i) => (
                <div key={i} className="bg-[#102216] p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-green-500 text-lg">
                    {iconMap[obj.iconType] || <FaBrain />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{obj.title}</h4>
                    <p className="text-sm text-gray-400">{obj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Weekly Breakdown */}
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-6 border-l-4 border-green-500 pl-4">Weekly Breakdown</h3>
            <div className="space-y-4">
              {aiContent.weeks.map((week, i) => (
                <div key={i} className="group bg-[#102216] rounded-xl overflow-hidden border border-white/5">
                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="bg-green-500/20 text-green-500 text-xs font-black px-2 py-1 rounded uppercase">{week.title}</span>
                      <h4 className="font-bold text-white">{week.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why This Program */}
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-6 border-l-4 border-green-500 pl-4">Why This Program?</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiContent.reasons.map((item, i) => (
                <li key={i} className="flex items-center gap-6 text-gray-300">
                  <FaCheckCircle className="text-green-500 text-7xl" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 space-y-6">
            <div className="bg-[#102216] rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                <div>
                  <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Program Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">${program.price}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-green-500 text-black font-black uppercase tracking-wide py-4 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(19,236,91,0.2)] mb-3 flex items-center justify-center gap-2">
                Buy Program
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
