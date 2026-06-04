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
import { Copy, Play, Zap, Code2, Clock, Settings2 } from "lucide-react";
import { HowItWorks } from "@/components/HowItWorks";

const MAX_PAYLOAD_FIELDS = 100;

const STRATEGIES = [
  { value: "NONE",                label: "Não modificar" },
  { value: "TIMESTAMP_INCREMENT", label: "Timestamp (+1ms)" },
  { value: "NUMERIC_INCREMENT",   label: "Numérico (+1, +2...)" },
  { value: "UUID",                label: "UUID aleatório" },
  { value: "FIXED_VALUES",        label: "Valores fixos (lista)" },
];

const formSchema = z.object({
  quantidade: z.coerce
    .number()
    .min(2, "A quantidade tem que ser maior ou igual a 2")
    .max(100, "A quantidade máxima permitida é 100"),
  payload: z.string().min(1, "O payload não pode estar vazio"),
});

type FormData = z.infer<typeof formSchema>;

interface FieldRule {
  field: string;
  strategy: string;
  values?: string[];
}

interface FieldConfig {
  strategy: string;
  fixedValues: string; // string CSV que o usuário digita: "alice, bob, carol"
}

const Index = () => {
  const [generatedPayloads, setGeneratedPayloads] = useState<Record<string, any>[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedFields, setDetectedFields] = useState<string[] | null>(null);
  const [fieldConfigs, setFieldConfigs] = useState<Record<string, FieldConfig>>({});

  const {
    register,
    handleSubmit,
    getValues,
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

  // Etapa 1: detecta os campos do JSON e mostra a seleção de strategies
  const handleDetectFields = () => {
    const raw = getValues("payload");
    try {
      const parsed = JSON.parse(raw);
      if (Object.keys(parsed).length > MAX_PAYLOAD_FIELDS) {
        toast.error("A quantidade máxima de campos no payload é 100");
        return;
      }
      const fields = Object.keys(parsed);
      setDetectedFields(fields);

      // Inicializa configs: se campo se chama "timestamp", já sugere TIMESTAMP_INCREMENT
      const initial: Record<string, FieldConfig> = {};
      fields.forEach((f) => {
        initial[f] = {
          strategy: f === "timestamp" ? "TIMESTAMP_INCREMENT" : "NONE",
          fixedValues: "",
        };
      });
      setFieldConfigs(initial);
      toast.success("Campos detectados! Configure as regras abaixo.");
    } catch {
      toast.error("JSON inválido — corrija o payload antes de continuar");
    }
  };

  const updateFieldStrategy = (field: string, strategy: string) => {
    setFieldConfigs((prev) => ({ ...prev, [field]: { ...prev[field], strategy } }));
  };

  const updateFixedValues = (field: string, val: string) => {
    setFieldConfigs((prev) => ({ ...prev, [field]: { ...prev[field], fixedValues: val } }));
  };

  // Etapa 2: monta fieldRoles e envia
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGeneratedPayloads(null);

    try {
      let parsedPayload: Record<string, any>;
      try {
        parsedPayload = JSON.parse(data.payload);
      } catch {
        throw new Error("Formato JSON inválido");
      }

      if (Object.keys(parsedPayload).length > MAX_PAYLOAD_FIELDS) {
        throw new Error("A quantidade máxima de campos no payload é 100");
      }

      // Monta fieldRoles ignorando campos com strategy NONE
      const fieldRoles: FieldRule[] = [];
      if (detectedFields) {
        for (const field of detectedFields) {
          const config = fieldConfigs[field];
          if (!config || config.strategy === "NONE") continue;

          if (config.strategy === "FIXED_VALUES") {
            const values = config.fixedValues
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean);
            if (values.length === 0) {
              throw new Error(`Campo "${field}": informe ao menos um valor para a lista`);
            }
            fieldRoles.push({ field, strategy: "FIXED_VALUES", values });
          } else {
            fieldRoles.push({ field, strategy: config.strategy });
          }
        }
      }

      const response = await fetch("https://clonepayloads.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidade: data.quantidade,
          payload: parsedPayload,
          fieldRoles: fieldRoles.length > 0 ? fieldRoles : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || "Erro ao gerar payloads");
      }

      // Backend agora retorna array direto (sem wrapper "payloads")
      const result: Record<string, any>[] = await response.json();
      setGeneratedPayloads(result);
      toast.success(`${result.length} payloads gerados com sucesso!`);
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
      copyToClipboard(JSON.stringify(generatedPayloads, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Input */}
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
                  className="code-editor min-h-[200px] resize-none"
                  {...register("payload")}
                />
                {errors.payload && (
                  <p className="text-destructive text-sm">{errors.payload.message}</p>
                )}
              </div>

              {/* Botão detectar campos */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:bg-secondary"
                onClick={handleDetectFields}
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Detectar Campos e Configurar Regras
              </Button>

              {/* Seleção de strategies por campo */}
              {detectedFields && detectedFields.length > 0 && (
                <div className="space-y-3 border border-border rounded-lg p-4 bg-secondary/30">
                  <p className="text-sm font-medium text-foreground">Regras por campo:</p>
                  {detectedFields.map((field) => (
                    <div key={field} className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-32 truncate font-mono">{field}</span>
                        <select
                          className="flex-1 text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground"
                          value={fieldConfigs[field]?.strategy ?? "NONE"}
                          onChange={(e) => updateFieldStrategy(field, e.target.value)}
                        >
                          {STRATEGIES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      {fieldConfigs[field]?.strategy === "FIXED_VALUES" && (
                        <Input
                          placeholder="alice, bob, carol"
                          className="text-sm bg-background border-border ml-[140px]"
                          value={fieldConfigs[field]?.fixedValues ?? ""}
                          onChange={(e) => updateFixedValues(field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

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

          {/* Output */}
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
                  {JSON.stringify(generatedPayloads, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Os payloads gerados aparecerão aqui</p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Preencha o formulário e clique em "Gerar Payloads"
                </p>
              </div>
            )}
          </Card>
        </div>

        <HowItWorks />
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>ClonePayload © 2025 - Ferramenta para desenvolvedores</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;