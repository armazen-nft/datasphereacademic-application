import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '../store/useStore';
import type { IReference } from '../types';

interface FormData {
  title: string;
  abstract: string;
  content: string;
  keywords: string;
  hypotheses: string;
  methodology: string;
  findings: string;
}

export function ArticleSubmit() {
  const navigate = useNavigate();
  const { currentUser, createArticle } = useStore();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    abstract: '',
    content: '',
    keywords: '',
    hypotheses: '',
    methodology: '',
    findings: ''
  });
  
  const [references, setReferences] = useState<IReference[]>([]);
  const [newReference, setNewReference] = useState({
    title: '',
    authors: '',
    year: '',
    source: '',
    doi: '',
    url: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReference = () => {
    if (!newReference.title || !newReference.authors || !newReference.year) {
      return;
    }

    const reference: IReference = {
      id: `ref_${Date.now()}`,
      title: newReference.title,
      authors: newReference.authors.split(',').map(a => a.trim()),
      year: parseInt(newReference.year),
      source: newReference.source,
      doi: newReference.doi || undefined,
      url: newReference.url || undefined,
      verified: false
    };

    setReferences([...references, reference]);
    setNewReference({ title: '', authors: '', year: '', source: '', doi: '', url: '' });
  };

  const removeReference = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
  };

  const validateForm = (): boolean => {
    if (formData.title.length < 10) {
      setError('O título deve ter pelo menos 10 caracteres');
      return false;
    }
    if (formData.abstract.length < 100) {
      setError('O resumo deve ter pelo menos 100 caracteres');
      return false;
    }
    if (formData.content.length < 1000) {
      setError('O conteúdo deve ter pelo menos 1000 caracteres');
      return false;
    }
    if (references.length < 5) {
      setError('Adicione pelo menos 5 referências');
      return false;
    }
    return true;
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    setError(null);
    
    if (!validateForm()) return;
    if (!currentUser) {
      setError('Você precisa estar logado para submeter um artigo');
      return;
    }

    setIsSubmitting(true);

    const articleData = {
      title: formData.title,
      abstract: formData.abstract,
      content: formData.content,
      authorId: currentUser.id,
      authorType: currentUser.type,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      references,
      hypotheses: formData.hypotheses.split('\n').filter(h => h.trim()),
      methodology: formData.methodology,
      findings: formData.findings,
      status: (asDraft ? 'draft' : 'submitted') as 'draft' | 'submitted'
    };

    const result = await createArticle(articleData);
    
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/articles');
      }, 2000);
    } else {
      setError('Erro ao criar artigo. Tente novamente.');
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Artigo Submetido com Sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Seu artigo foi enviado para validação pela rede de IAs. 
              Você será notificado quando o processo for concluído.
            </p>
            <Button onClick={() => navigate('/articles')}>
              Ver Meus Artigos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submeter Artigo</h1>
        <p className="text-gray-500 mt-1">
          Preencha os campos abaixo para submeter seu trabalho à rede acadêmica
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="references">Referências ({references.length})</TabsTrigger>
          <TabsTrigger value="metadata">Metadados</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title">Título do Artigo *</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do seu artigo"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="abstract">Resumo/Abstract *</Label>
                <Textarea
                  id="abstract"
                  placeholder="Descreva o conteúdo do artigo em 150-300 palavras"
                  value={formData.abstract}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 100 caracteres. {formData.abstract.length} caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="content">Conteúdo do Artigo *</Label>
                <Textarea
                  id="content"
                  placeholder="Cole ou digite o conteúdo completo do artigo"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="mt-1 min-h-[400px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 1000 caracteres. {formData.content.length} caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Palavras-chave *</Label>
                <Input
                  id="keywords"
                  placeholder="Separe por vírgulas: inteligência artificial, machine learning, ..."
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Referência</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={newReference.title}
                    onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                    placeholder="Título da obra"
                  />
                </div>
                <div>
                  <Label>Autores (separados por vírgula)</Label>
                  <Input
                    value={newReference.authors}
                    onChange={(e) => setNewReference({ ...newReference, authors: e.target.value })}
                    placeholder="Silva, J., Santos, M."
                  />
                </div>
                <div>
                  <Label>Ano</Label>
                  <Input
                    type="number"
                    value={newReference.year}
                    onChange={(e) => setNewReference({ ...newReference, year: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label>Fonte/Periódico</Label>
                  <Input
                    value={newReference.source}
                    onChange={(e) => setNewReference({ ...newReference, source: e.target.value })}
                    placeholder="Journal of..."
                  />
                </div>
                <div>
                  <Label>DOI (opcional)</Label>
                  <Input
                    value={newReference.doi}
                    onChange={(e) => setNewReference({ ...newReference, doi: e.target.value })}
                    placeholder="10.xxxx/xxxxx"
                  />
                </div>
                <div>
                  <Label>URL (opcional)</Label>
                  <Input
                    value={newReference.url}
                    onChange={(e) => setNewReference({ ...newReference, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <Button 
                onClick={addReference}
                disabled={!newReference.title || !newReference.authors || !newReference.year}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Referência
              </Button>
            </CardContent>
          </Card>

          {/* References List */}
          {references.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Referências Adicionadas ({references.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {references.map((ref, index) => (
                    <div 
                      key={ref.id} 
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
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
                          <p className="text-xs text-indigo-600">DOI: {ref.doi}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReference(ref.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="hypotheses">Hipóteses (uma por linha)</Label>
                <Textarea
                  id="hypotheses"
                  placeholder="H1: A hipótese principal...&#10;H2: A hipótese secundária..."
                  value={formData.hypotheses}
                  onChange={(e) => handleInputChange('hypotheses', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="methodology">Metodologia</Label>
                <Textarea
                  id="methodology"
                  placeholder="Descreva a metodologia utilizada na pesquisa"
                  value={formData.methodology}
                  onChange={(e) => handleInputChange('methodology', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="findings">Principais Achados</Label>
                <Textarea
                  id="findings"
                  placeholder="Resuma os principais resultados ou conclusões"
                  value={formData.findings}
                  onChange={(e) => handleInputChange('findings', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Rascunho
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          className="gap-2 flex-1"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Enviando...' : 'Submeter para Validação'}
        </Button>
      </div>

      {/* Requirements */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Requisitos Mínimos
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Título com pelo menos 10 caracteres</li>
          <li>• Resumo com pelo menos 100 caracteres</li>
          <li>• Conteúdo com pelo menos 1000 caracteres</li>
          <li>• Pelo menos 5 referências bibliográficas</li>
          <li>• Pelo menos 3 palavras-chave</li>
        </ul>
      </div>
    </div>
  );
}

export default ArticleSubmit;
