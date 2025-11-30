import { Card } from "@/components/ui/card";
import { FileJson, Clock, Copy, AlertCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: FileJson,
      title: "1. Forneça o Payload",
      description: "Insira um objeto JSON válido contendo um campo 'timestamp' no formato ISO-8601 (ex: 2024-01-01T00:00:00.000Z).",
      color: "text-primary",
    },
    {
      icon: Copy,
      title: "2. Defina a Quantidade",
      description: "Especifique quantos payloads deseja gerar (mínimo 2). Cada payload será uma cópia do original.",
      color: "text-accent",
    },
    {
      icon: Clock,
      title: "3. Incremento Automático",
      description: "Cada payload clonado terá seu timestamp incrementado sequencialmente em +1ms, +2ms, +3ms, etc.",
      color: "text-purple-400",
    },
    {
      icon: AlertCircle,
      title: "4. Validações Aplicadas",
      description: "O sistema valida: formato JSON, presença do timestamp, formato ISO-8601 e quantidade mínima.",
      color: "text-destructive",
    },
  ];

  const validationRules = [
    { rule: "Quantidade >= 2", example: "quantidade: 5" },
    { rule: "Payload não nulo/vazio", example: '{"timestamp": "..."}' },
    { rule: "Timestamp obrigatório", example: 'timestamp: "2024-01-01T00:00:00.000Z"' },
    { rule: "Formato ISO-8601", example: "YYYY-MM-DDTHH:mm:ss.sssZ" },
  ];

  return (
    <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 gradient-text">Como Funciona?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          O ClonePayload é uma ferramenta para desenvolvedores que automatiza a criação de múltiplos
          payloads JSON com timestamps incrementados, ideal para testes e simulações.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 bg-secondary rounded-lg ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Validation Rules */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent" />
          Regras de Validação
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {validationRules.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-secondary rounded-lg border border-border"
            >
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-1">{item.rule}</p>
                <code className="text-xs text-primary bg-code-bg px-2 py-1 rounded">
                  {item.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Example Section */}
      <Card className="p-6 bg-card border-border mt-6">
        <h3 className="text-xl font-semibold mb-4">Exemplo de Uso</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Input:</h4>
            <div className="code-editor bg-code-bg">
              <pre className="text-xs text-foreground">
{`quantidade: 3
payload: {
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": "123",
  "action": "click"
}`}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3">Output:</h4>
            <div className="code-editor bg-code-bg space-y-2">
              <pre className="text-xs text-foreground">
{`[
  {
    "timestamp": "2024-01-01T12:00:00.001Z",
    "userId": "123",
    "action": "click"
  },
  {
    "timestamp": "2024-01-01T12:00:00.002Z",
    "userId": "123",
    "action": "click"
  },
  {
    "timestamp": "2024-01-01T12:00:00.003Z",
    "userId": "123",
    "action": "click"
  }
]`}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};
