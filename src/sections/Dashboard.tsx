import { useEffect } from 'react';
import { 
  BookOpen, 
  FileCheck, 
  Clock, 
  Users, 
  TrendingUp, 
  Award,
  Activity,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStore } from '../store/useStore';

const reputationColors: Record<string, string> = {
  novice: 'bg-gray-500',
  contributor: 'bg-blue-500',
  validator: 'bg-green-500',
  expert: 'bg-purple-500',
  master: 'bg-orange-500',
  legendary: 'bg-yellow-500'
};

const reputationLabels: Record<string, string> = {
  novice: 'Novato',
  contributor: 'Contribuidor',
  validator: 'Validador',
  expert: 'Especialista',
  master: 'Mestre',
  legendary: 'Lendário'
};

export function Dashboard() {
  const { 
    dashboardStats, 
    leaderboard, 
    currentUser, 
    fetchDashboardStats, 
    fetchLeaderboard,
    isLoading 
  } = useStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchLeaderboard();
  }, [fetchDashboardStats, fetchLeaderboard]);

  const stats = [
    {
      title: 'Total de Artigos',
      value: dashboardStats?.totalArticles || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Publicados',
      value: dashboardStats?.publishedArticles || 0,
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Em Validação',
      value: dashboardStats?.pendingValidations || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Validadores Ativos',
      value: dashboardStats?.activeValidators || leaderboard.length || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {currentUser?.name || 'Pesquisador'}
          </h1>
          <p className="text-gray-500 mt-1">
            Rede Acadêmica Descentralizada com Validação por IA
          </p>
        </div>
        {currentUser && (
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={`${reputationColors[currentUser.reputation.level]} text-white px-3 py-1`}
            >
              <Award className="h-3.5 w-3.5 mr-1" />
              {reputationLabels[currentUser.reputation.level]}
            </Badge>
            <div className="text-sm text-gray-600">
              {currentUser.reputation.score} pontos
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {isLoading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Progress */}
        {currentUser && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Seu Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reputation Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Reputação Acadêmica</span>
                  <span className="font-medium">{currentUser.reputation.score} / 1000</span>
                </div>
                <Progress 
                  value={currentUser.reputation.score / 10} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Novato</span>
                  <span>Lendário</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentUser.reputation.articlesSubmitted}
                  </div>
                  <div className="text-xs text-gray-500">Artigos Submetidos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentUser.reputation.articlesPublished}
                  </div>
                  <div className="text-xs text-gray-500">Artigos Publicados</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentUser.reputation.validationsCompleted}
                  </div>
                  <div className="text-xs text-gray-500">Validações</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {currentUser.reputation.citationsReceived}
                  </div>
                  <div className="text-xs text-gray-500">Citações</div>
                </div>
              </div>

              {/* AI Profile */}
              {currentUser.type === 'ai' && currentUser.aiProfile && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-900 mb-3">
                    Perfil de IA Validadora
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-purple-700">Progresso para Publicação</span>
                        <span className="font-medium">
                          {currentUser.aiProfile.validationsCompleted} / {currentUser.aiProfile.validationQuota}
                        </span>
                      </div>
                      <Progress 
                        value={(currentUser.aiProfile.validationsCompleted / currentUser.aiProfile.validationQuota) * 100} 
                        className="h-2 bg-purple-200"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">Precisão das Validações</span>
                      <span className="font-medium">{currentUser.aiProfile.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">Status</span>
                      <Badge variant={currentUser.aiProfile.canPublish ? 'default' : 'secondary'}>
                        {currentUser.aiProfile.canPublish ? 'Pode Publicar' : 'Em Treinamento'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Top Validadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.slice(0, 5).map((validator, index) => (
                <div 
                  key={validator.validatorId}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {validator.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {validator.validationsCompleted} validações
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{validator.reputation}</p>
                    <p className="text-xs text-gray-500">pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Growth */}
      {dashboardStats?.networkGrowth && dashboardStats.networkGrowth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Crescimento da Rede (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {dashboardStats.networkGrowth.map((value, index) => {
                const max = Math.max(...dashboardStats.networkGrowth);
                const height = max > 0 ? (value / max) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition-colors rounded-t"
                    style={{ height: `${height}%` }}
                    title={`Dia ${index + 1}: ${value} artigos`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
