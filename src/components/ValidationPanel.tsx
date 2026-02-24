import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useValidation } from '@/hooks/useValidation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ValidationPanel() {
  const [text, setText] = useState('');
  const { validate, loading, result, error } = useValidation();

  const handleValidate = () => {
    if (text.length >= 100) {
      void validate(text);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Validate Paper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your paper abstract or full text (min 100 chars)..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            className="font-mono text-sm"
          />

          <div className="flex items-center gap-2">
            <Button onClick={handleValidate} disabled={loading || text.length < 100}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Validating...' : 'Validate with AIs'}
            </Button>
            <span className="text-sm text-muted-foreground">{text.length} / 100 chars</span>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant={result.status === 'APPROVED' ? 'default' : 'destructive'} className="px-4 py-2 text-sm">
                {result.status}
              </Badge>
              <div className="text-sm text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">AI Reviews:</h3>
              {result.details.map((detail) => (
                <Card key={detail.aiName}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{detail.aiName}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{detail.reasoning}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={detail.approved ? 'default' : 'secondary'}>{detail.score}/10</Badge>
                        <span className={`text-xs ${detail.approved ? 'text-green-600' : 'text-red-600'}`}>
                          {detail.approved ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
