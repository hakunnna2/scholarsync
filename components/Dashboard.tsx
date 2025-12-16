import React, { useEffect, useState } from 'react';
import { UserStats, Task, StudySession, Exam } from '../types';
import { getMotivationalQuote } from '../services/geminiService';

interface DashboardProps {
  stats: UserStats;
  tasks: Task[];
  sessions: StudySession[];
  exams: Exam[];
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, tasks, sessions, exams, userName }) => {
  const [quote, setQuote] = useState("Initializing motivation module...");
  
  useEffect(() => {
    const cached = sessionStorage.getItem('dailyQuote');
    if (cached) {
      setQuote(cached);
    } else {
      getMotivationalQuote().then(q => {
        setQuote(q);
        sessionStorage.setItem('dailyQuote', q);
      });
    }
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.dueDate === todayStr && !t.completed);
  const todaysSessions = sessions.filter(s => s.date === todayStr && !s.completed);

  const drawBar = (percent: number) => {
    const filled = Math.floor(percent / 5);
    const empty = 20 - filled;
    return `[${'#'.repeat(filled)}${'.'.repeat(empty)}] ${percent}%`;
  };

  return (
    <div className="space-y-8 animate-fade-in font-mono text-sm md:text-base">
      
      {/* Welcome Banner */}
      <div className="border border-zinc-800 p-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-20 text-[10px] text-green-500">
          <pre>{`
   _      
  ( )     
   H      
   H      
  _H_     
         `}</pre>
        </div>
        <h1 className="text-xl md:text-2xl text-green-500 font-bold mb-2">
          <span className="text-zinc-500">$</span> echo "Welcome, {userName}"
        </h1>
        <div className="text-zinc-400 pl-4 border-l-2 border-zinc-800 italic">
          &gt; {quote}
        </div>
      </div>

      {/* System Stats "Neofetch" style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="border border-zinc-800 p-6">
          <h2 className="text-green-500 font-bold mb-4 border-b border-zinc-800 pb-2">-- SYSTEM STATUS --</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">USER:</span>
              <span className="text-zinc-200">{userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">UPTIME:</span>
              <span className="text-zinc-200">{stats.streakDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">TASKS_PENDING:</span>
              <span className="text-zinc-200">{todaysTasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">SESSIONS_QUEUE:</span>
              <span className="text-zinc-200">{todaysSessions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">XP_LEVEL:</span>
              <span className="text-green-400">{stats.xp} XP</span>
            </div>
          </div>
        </div>

        <div className="border border-zinc-800 p-6">
           <h2 className="text-green-500 font-bold mb-4 border-b border-zinc-800 pb-2">-- PERFORMANCE --</h2>
           <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-zinc-500">TASK_COMPLETION</span>
               </div>
               <div className="text-green-500 text-xs">{drawBar(Math.min(100, (stats.tasksCompleted * 2)))}</div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-zinc-500">STUDY_LOAD</span>
               </div>
               <div className="text-yellow-500 text-xs">{drawBar(Math.min(100, exams.length * 10))}</div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-zinc-500">FOCUS_INTEGRITY</span>
               </div>
               <div className="text-blue-500 text-xs">{drawBar(Math.min(100, stats.studyMinutesToday))}</div>
             </div>
           </div>
        </div>

      </div>

      {/* Active Processes (Today's Tasks) */}
      <div className="border border-zinc-800">
        <div className="bg-zinc-900/50 p-2 border-b border-zinc-800 flex justify-between items-center">
          <span className="text-zinc-400 text-xs">root@scholar-sync:/proc/active_tasks</span>
          <span className="text-green-500 text-xs bg-green-900/20 px-2 py-0.5">LIVE</span>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500 border-b border-zinc-800 bg-zinc-950">
              <tr>
                <th className="p-3 font-normal">PID</th>
                <th className="p-3 font-normal">COMMAND (TASK)</th>
                <th className="p-3 font-normal">STATUS</th>
                <th className="p-3 font-normal text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {todaysSessions.map(session => (
                <tr key={session.id} className="hover:bg-zinc-900/30">
                  <td className="p-3 text-zinc-600 font-mono">{session.id.substring(0,4)}</td>
                  <td className="p-3 text-blue-400">./study {session.topic}</td>
                  <td className="p-3 text-yellow-500">WAITING</td>
                  <td className="p-3 text-right text-zinc-500">{session.durationMinutes}m</td>
                </tr>
              ))}
              {todaysTasks.map(task => (
                <tr key={task.id} className="hover:bg-zinc-900/30">
                  <td className="p-3 text-zinc-600 font-mono">{task.id.substring(0,4)}</td>
                  <td className="p-3 text-zinc-300">./do {task.title}</td>
                  <td className="p-3 text-red-400 uppercase">{task.priority}</td>
                  <td className="p-3 text-right text-zinc-500">--</td>
                </tr>
              ))}
              {todaysTasks.length === 0 && todaysSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-600 italic">
                    No active processes found. System idle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;