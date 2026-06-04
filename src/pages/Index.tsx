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
import { Copy, Play, Zap, Terminal, ArrowDown, Sparkles, Github, ChevronRight, Settings2, CircleDot } from "lucide-react";
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
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-mint pointer-events-none" />
      <div className="noise" />

      {/* Nav */}
      <header className="relative z-20 border-b border-border/60 backdrop-blur-md bg-background/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/40 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
            <span className="font-display font-bold tracking-tight text-foreground">
              clone<span className="text-primary">_</span>payload
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#playground" className="hover:text-foreground transition-colors">Playground</a>
            <a href="#how" className="hover:text-foreground transition-colors">Como funciona</a>
            <a href="#strategies" className="hover:text-foreground transition-colors">Strategies</a>
          </nav>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary">
              <CircleDot className="w-3 h-3 animate-pulse" /> API online
            </span>
          </div>
        </div>
      </header>

      {/* HERO — split screen */}
      <section className="relative z-10">
        <div className="container mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">
          {/* Left: pitch */}
          <div className="space-y-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-mono text-primary">
              <Sparkles className="w-3 h-3" /> v2.0 · agora com fieldRoles
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter">
              Gere <span className="gradient-text">100 payloads</span>
              <br /> <span className="relative inline-block">
                <span className="relative z-10">em um clique<span className="blink-caret" /></span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/20 -z-0" />
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Pare de copiar e colar JSON pra testar. ClonePayload duplica seu payload
              N vezes aplicando <code className="text-primary font-mono text-base">strategies</code> por campo —
              timestamps incrementados, UUIDs únicos, valores em rotação. Pronto pra estressar suas APIs.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-6 group"
                onClick={() => document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="w-4 h-4 mr-2" />
                Testar agora
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 border-border bg-transparent hover:bg-secondary font-mono text-sm"
                onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              >
                $ ver como funciona
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-border/60 max-w-xl">
              {[
                { v: "100", l: "clones / request" },
                { v: "4", l: "strategies" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display font-bold text-2xl text-foreground">{s.v}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: terminal preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-xl overflow-hidden border border-code-border bg-code-bg shadow-[var(--shadow-mint)] terminal-chrome">
              <div className="absolute top-2 right-4 text-[10px] font-mono text-muted-foreground">
                POST /api/generate
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-muted-foreground"><span className="text-primary">$</span> curl clonepayloads.onrender.com</div>
                <pre className="mt-3 text-foreground/90 text-xs whitespace-pre-wrap">
{`{
  "quantidade": `}<span className="text-accent">3</span>{`,
  "payload": { "userId": "abc", "score": `}<span className="text-accent">10</span>{` },
  "fieldRoles": [
    { "field": "userId", "strategy": `}<span className="text-primary">"UUID"</span>{` },
    { "field": "score",  "strategy": `}<span className="text-primary">"NUMERIC_INCREMENT"</span>{` }
  ]
}`}
                </pre>
                <div className="mt-4 text-muted-foreground text-xs">→ resposta</div>
                <pre className="mt-1 text-primary/90 text-xs whitespace-pre-wrap">
{`[ { "userId": "f47ac…", "score": 11 },
  { "userId": "9c858…", "score": 12 },
  { "userId": "16fd2…", "score": 13 } ]`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative border-y border-border/60 bg-secondary/30 py-3 overflow-hidden">
          <div className="marquee text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-12 pr-12">
                <span>⌁ load testing</span>
                <span className="text-primary">TIMESTAMP_INCREMENT</span>
                <span>⌁ event simulation</span>
                <span className="text-primary">UUID</span>
                <span>⌁ kafka producers</span>
                <span className="text-primary">NUMERIC_INCREMENT</span>
                <span>⌁ qa fixtures</span>
                <span className="text-primary">FIXED_VALUES</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAYGROUND */}
      <main id="playground" className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs text-primary mb-2">// 01 · playground</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Faça o request <span className="text-primary">ao vivo</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Edite o payload, escolha as strategies, dispare. A resposta cai aqui na hora.
            </p>
          </div>
          <div className="font-mono text-xs text-muted-foreground hidden md:block">
            endpoint: <span className="text-primary">clonepayloads.onrender.com/api/generate</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Input */}
          <Card className="bg-card/80 backdrop-blur border-border overflow-hidden p-0">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/40 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-destructive/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="ml-2 text-muted-foreground">request.json</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quantidade" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  quantidade <span className="text-primary">int</span> · 2–100
                </Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="2"
                  className="bg-input border-border font-mono text-lg h-12"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <p className="text-destructive text-sm font-mono">→ {errors.quantidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payload" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  payload <span className="text-primary">Map&lt;String, Object&gt;</span>
                </Label>
                <Textarea
                  id="payload"
                  placeholder='{"timestamp": "2024-01-01T00:00:00.000Z", "data": "example"}'
                  className="code-editor min-h-[200px] resize-none"
                  {...register("payload")}
                />
                {errors.payload && (
                  <p className="text-destructive text-sm font-mono">→ {errors.payload.message}</p>
                )}
              </div>

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
                <div className="space-y-3 border border-primary/20 rounded-lg p-4 bg-primary/5">
                  <p className="text-xs font-mono uppercase tracking-wider text-primary">
                    // fieldRoles
                  </p>
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 text-base group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    gerando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    POST /api/generate
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Output */}
          <Card className="bg-card/80 backdrop-blur border-border overflow-hidden p-0 relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/40">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">response.json</span>
                {generatedPayloads && (
                  <span className="text-primary ml-2">200 OK · {generatedPayloads.length} items</span>
                )}
              </div>
              {generatedPayloads && generatedPayloads.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAllPayloads}
                  className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  copiar
                </Button>
              )}
            </div>

            {generatedPayloads && generatedPayloads.length > 0 ? (
              <div className="p-5 max-h-[520px] overflow-auto animate-fade-in">
                <pre className="text-sm text-foreground/90 font-mono leading-relaxed">
                  {JSON.stringify(generatedPayloads, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[460px] text-center px-6 relative">
                <div className="relative mb-5">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                  <div className="relative w-16 h-16 rounded-full border border-primary/40 bg-primary/5 flex items-center justify-center">
                    <ArrowDown className="w-6 h-6 text-primary animate-bounce" />
                  </div>
                </div>
                <p className="font-mono text-sm text-muted-foreground">
                  <span className="text-primary">$</span> aguardando request...
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2 max-w-xs">
                  preencha o payload ao lado, dispare, e a resposta do backend aparece aqui em tempo real
                </p>
              </div>
            )}
          </Card>
        </div>

        <div id="how" className="mt-24">
          <HowItWorks />
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/60 bg-secondary/20 backdrop-blur mt-12">
        <div className="container mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-sm">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-foreground">clone_payload</span>
            <span className="text-muted-foreground">© 2025</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            built for devs who hate <span className="line-through">copy-paste</span>
            <span className="text-primary ml-1">boilerplate</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;