import { ValidationPanel } from '@/components/ValidationPanel';

export function ValidatePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">AI Paper Validation</h1>
      <ValidationPanel />
    </div>
  );
}
