import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  ChevronRight,
  Star,
  Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '../store/useStore';
import type { IArticle } from '../types';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
  submitted: { label: 'Submetido', color: 'bg-blue-100 text-blue-700', icon: Clock },
  under_review: { label: 'Em Revisão', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  revision_required: { label: 'Revisão Necessária', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  published: { label: 'Publicado', color: 'bg-indigo-100 text-indigo-700', icon: CheckCircle },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export function ArticleList() {
  const { articles, fetchArticles, isLoading, hasMoreArticles, articlesPage } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles(1, { status: statusFilter || undefined });
  }, [fetchArticles, statusFilter]);

  const loadMore = () => {
    if (hasMoreArticles && !isLoading) {
      fetchArticles(articlesPage + 1, { status: statusFilter || undefined });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artigos Acadêmicos</h1>
          <p className="text-gray-500 mt-1">
            Explore contribuições validadas pela rede de IAs
          </p>
        </div>
        <Link to="/submit">
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Submeter Artigo
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar artigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="under_review">Em Revisão</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading && articles.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum artigo encontrado</h3>
          <p className="text-gray-500">Tente ajustar seus filtros ou busca</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMoreArticles && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: IArticle }) {
  const status = statusConfig[article.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <Link to={`/articles/${article.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${status.color}`}>
              <StatusIcon className="h-4 w-4" />
              {status.label}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {article.abstract}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.keywords.slice(0, 5).map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {article.keywords.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.keywords.length - 5}
                  </Badge>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Score: {article.qualityScores.overall}/100</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>{article.validations.length} validações</span>
                </div>
                <span>•</span>
                <span>{new Date(article.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 text-gray-400 hidden md:block" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ArticleList;
