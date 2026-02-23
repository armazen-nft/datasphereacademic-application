import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '../services/api';
import type { IPaperValidationResult } from '../types';

const placeholderText = `Cole aqui o conteúdo do paper para uma validação rápida de consenso.

Dica: escreva ao menos um resumo, metodologia e resultados para obter uma análise útil.`;

export function ValidatePaper() {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IPaperValidationResult | null>(null);

  const confidencePct = useMemo(() => {
    if (!result) return 0;
    return Math.round(result.confidence * 100);
  }, [result]);

  const handleValidate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    setIsSubmitting(true);
    const response = await api.validatePaper(text);

    if (!response.success || !response.data) {
      setError(response.error || 'Falha ao validar o paper.');
      setIsSubmitting(false);
      return;
    }

    setResult(response.data);
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Validação IA (MVP)</h1>
        <p className="mt-1 text-gray-500">
          Rode uma validação mock de consenso (2 de 3 IAs) para testar o fluxo fim-a-fim.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Submeter texto para validação</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleValidate}>
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholderText}
              className="min-h-[220px]"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Mínimo: 50 caracteres</p>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Validando...' : 'Validar paper'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.status === 'APPROVED' ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-600" />
              )}
              Resultado da validação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={result.status === 'APPROVED' ? 'default' : 'destructive'}>
                {result.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
              </Badge>
              <span className="text-sm text-gray-600">
                Confiança: <strong>{confidencePct}%</strong>
              </span>
            </div>

            <div className="grid gap-2">
              {result.details.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.approved ? 'default' : 'destructive'}>
                      {item.approved ? (
                        <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Aprovou</span>
                      ) : (
                        'Reprovou'
                      )}
                    </Badge>
                    <span className="text-sm text-gray-500">Score: {Math.round(item.score * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ValidatePaper;
