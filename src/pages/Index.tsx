import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Play, Zap, Code2, Clock } from "lucide-react";
import { HowItWorks } from "@/components/HowItWorks";

const formSchema = z.object({
  quantidade: z.coerce
    .number()
    .min(2, "A quantidade tem que ser maior ou igual a 2"),
  payload: z.string().min(1, "O payload não pode estar vazio"),
});

type FormData = z.infer<typeof formSchema>;

interface PayloadResponse {
  payloads: Record<string, any>[];
}

const Index = () => {
  const [generatedPayloads, setGeneratedPayloads] = useState<Record<string, any>[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantidade: 2,
      payload: JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          userId: "12345",
          action: "test_event",
        },
        null,
        2
      ),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGeneratedPayloads(null);

    try {
      // Parse and validate JSON
      let parsedPayload: Record<string, any>;
      try {
        parsedPayload = JSON.parse(data.payload);
      } catch {
        throw new Error("Formato JSON inválido");
      }

      // Validate timestamp presence
      if (!parsedPayload.timestamp || typeof parsedPayload.timestamp !== "string" || parsedPayload.timestamp.trim() === "") {
        throw new Error("O timestamp tem que estar presente no payload");
      }

      // Validate ISO-8601 format
      try {
        new Date(parsedPayload.timestamp).toISOString();
      } catch {
        throw new Error("O timestamp deve estar no formato ISO-8601");
      }

      const response = await fetch("https://clonepayloads.onrender.com/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantidade: data.quantidade,
          payload: parsedPayload,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao gerar payloads");
      }

      const result: PayloadResponse = await response.json();
      setGeneratedPayloads(result.payloads);
      toast.success(`${result.payloads.length} payloads gerados com sucesso!`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar a requisição");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const copyAllPayloads = () => {
    if (generatedPayloads) {
      const allPayloadsText = JSON.stringify(generatedPayloads, null, 2);
      copyToClipboard(allPayloadsText);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">ClonePayload</h1>
              <p className="text-sm text-muted-foreground">Duplicate JSON with incremented timestamps</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Input Section */}
          <Card className="p-6 card-glow animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Input</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quantidade" className="text-foreground font-medium">
                  Quantidade de Payloads
                </Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="2"
                  className="bg-secondary border-border"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <p className="text-destructive text-sm">{errors.quantidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payload" className="text-foreground font-medium">
                  Payload JSON
                </Label>
                <Textarea
                  id="payload"
                  placeholder='{"timestamp": "2024-01-01T00:00:00.000Z", "data": "example"}'
                  className="code-editor min-h-[300px] resize-none"
                  {...register("payload")}
                />
                {errors.payload && (
                  <p className="text-destructive text-sm">{errors.payload.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  * O payload deve conter um campo "timestamp" no formato ISO-8601
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Gerar Payloads
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Output Section */}
          <Card className="p-6 card-glow animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Output</h2>
              </div>
              {generatedPayloads && generatedPayloads.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllPayloads}
                  className="border-border hover:bg-secondary"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Todos
                </Button>
              )}
            </div>

            {generatedPayloads && generatedPayloads.length > 0 ? (
              <div className="code-editor bg-code-bg animate-fade-in">
                <pre className="text-sm text-foreground overflow-x-auto">
                  {JSON.stringify({ payloads: generatedPayloads }, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Os payloads gerados aparecerão aqui
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Preencha o formulário e clique em "Gerar Payloads"
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* How It Works Section */}
        <HowItWorks />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>ClonePayload © 2024 - Ferramenta para desenvolvedores</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
