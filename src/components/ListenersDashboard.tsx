import React, { useState, useEffect } from 'react';
import { Users, Clock, Radio, TrendingUp, Calendar, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ListenerStats {
  totalListeners: number;
  todayListeners: number;
  averageDuration: number;
  completionRate: number;
  totalSessions: number;
  topPrograms: { audio_id: string; count: number }[];
  recentSessions: {
    id: string;
    created_at: string;
    audio_id: string;
    duration_seconds: number;
    completed: boolean;
  }[];
  dailyStats: { date: string; listeners: number }[];
}

const ListenersDashboard: React.FC = () => {
  const [stats, setStats] = useState<ListenerStats>({
    totalListeners: 0,
    todayListeners: 0,
    averageDuration: 0,
    completionRate: 0,
    totalSessions: 0,
    topPrograms: [],
    recentSessions: [],
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('today');

  useEffect(() => {
    fetchStats();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Total de ouvintes únicos
      const { data: totalData } = await supabase
        .from('listeners')
        .select('user_id');
      
      const uniqueListeners = new Set(totalData?.map(l => l.user_id) || []);
      const totalListeners = uniqueListeners.size;

      // Ouvintes únicos hoje
      const { data: todayData } = await supabase
        .from('listeners')
        .select('user_id')
        .gte('created_at', new Date().toISOString().split('T')[0]);
      
      const uniqueTodayListeners = new Set(todayData?.map(l => l.user_id) || []);
      const todayListeners = uniqueTodayListeners.size;

      // Tempo médio de audição
      const { data: durationData } = await supabase
        .from('listeners')
        .select('duration_seconds')
        .gt('duration_seconds', 0);
      
      const avgDuration = durationData && durationData.length > 0
        ? durationData.reduce((sum, l) => sum + l.duration_seconds, 0) / durationData.length
        : 0;

      // Taxa de conclusão
      const { data: allSessions } = await supabase
        .from('listeners')
        .select('completed');
      
      const completedCount = allSessions?.filter(s => s.completed).length || 0;
      const completionRate = allSessions && allSessions.length > 0
        ? (completedCount / allSessions.length) * 100
        : 0;

      // Total de sessões
      const totalSessions = allSessions?.length || 0;

      // Programas mais ouvidos
      const { data: programData } = await supabase
        .from('listeners')
        .select('audio_id, user_id');
      
      const programCounts = programData?.reduce((acc, curr) => {
        const key = curr.audio_id;
        if (!acc[key]) {
          acc[key] = new Set();
        }
        acc[key].add(curr.user_id);
        return acc;
      }, {} as Record<string, Set<string>>) || {};

      const topPrograms = Object.entries(programCounts)
        .map(([audio_id, users]) => ({
          audio_id,
          count: users.size
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Sessões recentes
      const { data: recentData } = await supabase
        .from('listeners')
        .select('id, created_at, audio_id, duration_seconds, completed')
        .order('created_at', { ascending: false })
        .limit(10);

      // Stats diários (últimos 7 dias)
      const { data: dailyData } = await supabase
        .from('listeners')
        .select('created_at, user_id')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const dailyMap = dailyData?.reduce((acc, curr) => {
        const date = new Date(curr.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = new Set();
        }
        acc[date].add(curr.user_id);
        return acc;
      }, {} as Record<string, Set<string>>) || {};

      const dailyStats = Object.entries(dailyMap)
        .map(([date, users]) => ({
          date,
          listeners: users.size
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setStats({
        totalListeners,
        todayListeners,
        averageDuration: avgDuration,
        completionRate,
        totalSessions,
        topPrograms,
        recentSessions: recentData || [],
        dailyStats
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && stats.totalListeners === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Dashboard de Ouvintes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe suas métricas em tempo real
          </p>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6 flex gap-2">
          {(['today', 'week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-[#ff6600] text-white'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525]'
              }`}
            >
              {range === 'today' && 'Hoje'}
              {range === 'week' && 'Semana'}
              {range === 'month' && 'Mês'}
              {range === 'all' && 'Tudo'}
            </button>
          ))}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total de Ouvintes */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalListeners}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ouvintes únicos (total)
            </p>
          </div>

          {/* Ouvintes Hoje */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="w-2 h-2 bg-[#00d9c9] rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.todayListeners}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ouvintes hoje
            </p>
          </div>

          {/* Tempo Médio */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatDuration(stats.averageDuration)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tempo médio de audição
            </p>
          </div>

          {/* Taxa de Conclusão */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#ff6600]" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.completionRate.toFixed(1)}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Taxa de conclusão (5+ min)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Programas Mais Ouvidos */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Radio className="w-6 h-6 text-[#ff6600]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top 5 Programas
              </h2>
            </div>
            <div className="space-y-3">
              {stats.topPrograms.length > 0 ? (
                stats.topPrograms.map((program, index) => (
                  <div
                    key={program.audio_id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#ff6600] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                        {program.audio_id}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {program.count} ouvintes
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhum dado ainda
                </p>
              )}
            </div>
          </div>

          {/* Gráfico de Ouvintes por Dia */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#ff6600]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Últimos 7 Dias
              </h2>
            </div>
            <div className="space-y-3">
              {stats.dailyStats.length > 0 ? (
                stats.dailyStats.map((day) => {
                  const maxListeners = Math.max(...stats.dailyStats.map(d => d.listeners));
                  const percentage = maxListeners > 0 ? (day.listeners / maxListeners) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(day.date).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short' 
                          })}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {day.listeners}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-[#0f0f0f] rounded-full h-2">
                        <div
                          className="bg-[#ff6600] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhum dado ainda
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sessões Recentes */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            📝 Sessões Recentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Data/Hora
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Programa
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Duração
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSessions.length > 0 ? (
                  stats.recentSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#0f0f0f] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {formatDate(session.created_at)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
                        {session.audio_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDuration(session.duration_seconds)}
                      </td>
                      <td className="py-3 px-4">
                        {session.completed ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            Completo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded-full">
                            Em andamento
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhuma sessão registrada ainda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="mt-6 bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total de Sessões
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSessions}
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-[#ff6600] text-white rounded-lg font-semibold hover:bg-[#ff7700] transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenersDashboard;
