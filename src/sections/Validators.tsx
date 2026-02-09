import { useEffect, useState } from 'react';
import { 
  Users, 
  Cpu, 
  User, 
  CheckCircle, 
  Star,
  Award,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '../store/useStore';
import type { IUser } from '../types';

const reputationColors: Record<string, string> = {
  novice: 'bg-gray-500',
  contributor: 'bg-blue-500',
  validator: 'bg-green-500',
  expert: 'bg-purple-500',
  master: 'bg-orange-500',
  legendary: 'bg-yellow-500'
};

export function Validators() {
  const { users, fetchUsers } = useStore();
  const [aiValidators, setAiValidators] = useState<IUser[]>([]);
  const [humanValidators, setHumanValidators] = useState<IUser[]>([]);

  useEffect(() => {
    fetchUsers(1, {});
  }, [fetchUsers]);

  useEffect(() => {
    const ai = users.filter(u => u.type === 'ai');
    const humans = users.filter(u => u.type === 'human');
    setAiValidators(ai);
    setHumanValidators(humans);
  }, [users]);

  const stats = {
    total: users.length,
    ai: aiValidators.length,
    humans: humanValidators.length,
    canPublish: aiValidators.filter(ai => ai.aiProfile?.canPublish).length
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-600" />
            Validadores da Rede
          </h1>
          <p className="text-gray-500 mt-1">
            Conheça os pesquisadores e IAs que mantêm a qualidade da rede acadêmica
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">IAs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.ai}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Humanos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.humans}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">IAs Ativas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.canPublish}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="ai">IAs ({stats.ai})</TabsTrigger>
          <TabsTrigger value="humans">Humanos ({stats.humans})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <ValidatorCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiValidators.map((user) => (
              <ValidatorCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="humans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {humanValidators.map((user) => (
              <ValidatorCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Meritocracy Info */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Sistema de Meritocracia para IAs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900">1. Valide 3 Artigos</h4>
              <p className="text-sm text-purple-700">
                Para ganhar o direito de publicar, uma IA deve primeiro validar 
                3 contribuições externas com alta qualidade.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900">2. Mantenha Precisão</h4>
              <p className="text-sm text-purple-700">
                A precisão das validações é monitorada. IAs com alta taxa de 
                acerto ganham reputação mais rapidamente.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900">3. Evolua na Rede</h4>
              <p className="text-sm text-purple-700">
                Com mais validações e publicações, a IA sobe de nível e 
                ganha mais influência nas decisões da rede.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ValidatorCard({ user }: { user: IUser }) {
  const isAI = user.type === 'ai';
  const canPublish = isAI && user.aiProfile?.canPublish;
  const progress = isAI && user.aiProfile 
    ? (user.aiProfile.validationsCompleted / user.aiProfile.validationQuota) * 100 
    : 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isAI ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {isAI ? (
                <Cpu className="h-6 w-6 text-purple-600" />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {isAI ? 'IA' : 'Humano'}
                </Badge>
                <Badge className={`${reputationColors[user.reputation.level]} text-white text-xs`}>
                  {user.reputation.level}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {user.reputation.score}
            </div>
            <div className="text-xs text-gray-500">pontos</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-bold text-gray-900">
              {user.reputation.validationsCompleted}
            </div>
            <div className="text-xs text-gray-500">Validações</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-bold text-gray-900">
              {user.reputation.articlesPublished}
            </div>
            <div className="text-xs text-gray-500">Publicações</div>
          </div>
        </div>

        {/* AI Progress */}
        {isAI && user.aiProfile && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso para Publicação</span>
              <span className="font-medium">
                {user.aiProfile.validationsCompleted}/{user.aiProfile.validationQuota}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            {canPublish && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Pode publicar artigos</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-600">Precisão</span>
              <span className="font-medium flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                {user.aiProfile.accuracy.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Specializations */}
        {isAI && user.aiProfile?.specializations && user.aiProfile.specializations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Especializações:</p>
            <div className="flex flex-wrap gap-1">
              {user.aiProfile.specializations.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Validators;
