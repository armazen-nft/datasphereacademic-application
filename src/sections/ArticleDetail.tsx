import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  CheckCircle, 
  Star,
  FileText,
  AlertCircle,
  Quote,
  GitBranch
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStore } from '../store/useStore';
import type { IArticle } from '../types';

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
  submitted: { label: 'Submetido', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Em Revisão', color: 'bg-yellow-100 text-yellow-700' },
  revision_required: { label: 'Revisão Necessária', color: 'bg-orange-100 text-orange-700' },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
  published: { label: 'Publicado', color: 'bg-indigo-100 text-indigo-700' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700' }
};

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { fetchArticle, currentUser, submitArticle, publishArticle } = useStore();
  const [article, setArticle] = useState<IArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    setIsLoading(true);
    const result = await fetchArticle(articleId);
    if (result) {
      setArticle(result);
    } else {
      setError('Artigo não encontrado');
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!article) return;
    const success = await submitArticle(article.id);
    if (success) {
      loadArticle(article.id);
    }
  };

  const handlePublish = async () => {
    if (!article) return;
    const success = await publishArticle(article.id);
    if (success) {
      loadArticle(article.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Artigo não encontrado'}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link to="/articles">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Artigos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[article.status] || statusConfig.draft;
  const isAuthor = currentUser?.id === article.authorId;
  const canSubmit = isAuthor && (article.status === 'draft' || article.status === 'revision_required');
  const canPublish = isAuthor && article.status === 'approved';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Link to="/articles">
        <Button variant="ghost" className="gap-2 mb-6 -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className={status.color}>
            {status.label}
          </Badge>
          {article.authorType === 'ai' && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              IA Autora
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>ID: {article.authorId.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(article.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{article.views} visualizações</span>
          </div>
          <div className="flex items-center gap-1">
            <Quote className="h-4 w-4" />
            <span>{article.citations} citações</span>
          </div>
        </div>
      </div>

      {/* Quality Scores */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Pontuação de Qualidade
            </h3>
            <div className="text-2xl font-bold text-indigo-600">
              {article.qualityScores.overall}/100
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Semântica', value: article.qualityScores.semantic },
              { label: 'Lógica', value: article.qualityScores.logical },
              { label: 'Citações', value: article.qualityScores.citations },
              { label: 'Originalidade', value: article.qualityScores.originality },
              { label: 'Profundidade', value: article.qualityScores.depth },
            ].map((score) => (
              <div key={score.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{score.value}</div>
                <div className="text-xs text-gray-500">{score.label}</div>
                <Progress value={score.value} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="validations">Validações ({article.validations.length})</TabsTrigger>
          <TabsTrigger value="references">Referências ({article.references.length})</TabsTrigger>
          <TabsTrigger value="versions">Versões ({article.versions.length})</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resumo</h3>
              <p className="text-gray-700 leading-relaxed">{article.abstract}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Conteúdo</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {article.hypotheses && article.hypotheses.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Hipóteses</h3>
                <ul className="space-y-2">
                  {article.hypotheses.map((hypothesis, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-medium text-indigo-600">H{index + 1}:</span>
                      <span className="text-gray-700">{hypothesis}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {article.methodology && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Metodologia</h3>
                <p className="text-gray-700 leading-relaxed">{article.methodology}</p>
              </CardContent>
            </Card>
          )}

          {article.findings && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Principais Achados</h3>
                <p className="text-gray-700 leading-relaxed">{article.findings}</p>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </TabsContent>

        {/* Validations Tab */}
        <TabsContent value="validations" className="space-y-4">
          {article.validations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma validação ainda</h3>
                <p className="text-gray-500">Este artigo aguarda validação pela rede de IAs</p>
              </CardContent>
            </Card>
          ) : (
            article.validations.map((validation) => (
              <Card key={validation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={validation.result === 'approved' ? 'default' : 'destructive'}>
                        {validation.result === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Validador: {validation.validatorType === 'ai' ? 'IA' : 'Humano'}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">
                      {validation.overallScore}/100
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold">{validation.scores.coherence}</div>
                      <div className="text-xs text-gray-500">Coerência</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold">{validation.scores.foundation}</div>
                      <div className="text-xs text-gray-500">Fundação</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold">{validation.scores.originality}</div>
                      <div className="text-xs text-gray-500">Originalidade</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold">{validation.scores.methodology}</div>
                      <div className="text-xs text-gray-500">Metodologia</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold">{validation.scores.relevance}</div>
                      <div className="text-xs text-gray-500">Relevância</div>
                    </div>
                  </div>

                  {validation.comments && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{validation.comments}</p>
                    </div>
                  )}

                  {validation.suggestions && validation.suggestions.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Sugestões:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {validation.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-4">
          {article.references.map((ref, index) => (
            <Card key={ref.id}>
              <CardContent className="p-4 flex items-start gap-3">
                <span className="text-sm font-medium text-gray-500 min-w-[2rem]">
                  [{index + 1}]
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{ref.title}</p>
                  <p className="text-sm text-gray-600">
                    {ref.authors.join(', ')} ({ref.year})
                  </p>
                  <p className="text-sm text-gray-500">{ref.source}</p>
                  {ref.doi && (
                    <p className="text-xs text-indigo-600 mt-1">DOI: {ref.doi}</p>
                  )}
                  {ref.url && (
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                    >
                      Acessar URL
                    </a>
                  )}
                </div>
                {ref.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions" className="space-y-4">
          {article.versions.map((version) => (
            <Card key={version.version}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Versão {version.version}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(version.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {version.changes}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      {(canSubmit || canPublish) && (
        <div className="flex gap-4 pt-6 border-t">
          {canSubmit && (
            <Button onClick={handleSubmit} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Submeter para Validação
            </Button>
          )}
          {canPublish && (
            <Button onClick={handlePublish} className="gap-2 bg-green-600 hover:bg-green-700">
              <FileText className="h-4 w-4" />
              Publicar Artigo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;
