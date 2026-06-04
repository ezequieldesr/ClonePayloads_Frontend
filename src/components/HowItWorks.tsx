import { Card } from "@/components/ui/card";
import { FileJson, Settings2, Layers, AlertCircle, Clock, Hash, Fingerprint, List } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: FileJson,
      title: "1. Forneça o Payload",
      description: "Insira um objeto JSON válido com os campos que você quer clonar. Não precisa ter timestamp obrigatoriamente — depende da strategy escolhida.",
      color: "text-primary",
    },
    {
      icon: Settings2,
      title: "2. Detecte e Configure",
      description: "Clique em 'Detectar Campos' para listar as chaves do JSON e escolher uma strategy para cada uma (ou deixe 'Não modificar').",
      color: "text-accent",
    },
    {
      icon: Layers,
      title: "3. Defina a Quantidade",
      description: "Escolha quantos clones gerar (mínimo 2, máximo 100). Cada clone é gerado aplicando as strategies nos campos selecionados.",
      color: "text-purple-400",
    },
    {
      icon: AlertCircle,
      title: "4. Validações Aplicadas",
      description: "O sistema valida o JSON, a quantidade, a compatibilidade entre cada strategy e o tipo do campo, e a lista de valores fixos quando aplicável.",
      color: "text-destructive",
    },
  ];

  const strategies = [
    {
      icon: Clock,
      name: "TIMESTAMP_INCREMENT",
      description: "Incrementa o valor em +1ms, +2ms, +3ms... Exige que o campo seja uma String no formato ISO-8601.",
      color: "text-primary",
    },
    {
      icon: Hash,
      name: "NUMERIC_INCREMENT",
      description: "Soma +1, +2, +3... ao valor original. Exige que o campo seja numérico (int, long, double).",
      color: "text-accent",
    },
    {
      icon: Fingerprint,
      name: "UUID",
      description: "Gera um UUID aleatório novo por clone. Funciona com qualquer campo do tipo String.",
      color: "text-purple-400",
    },
    {
      icon: List,
      name: "FIXED_VALUES",
      description: "Usa os valores de uma lista em ordem circular (alice, bob, carol, alice, bob...). A lista não pode estar vazia.",
      color: "text-emerald-400",
    },
  ];

  const validationRules = [
    { rule: "Quantidade entre 2 e 100", example: "quantidade: 5" },
    { rule: "Payload não nulo nem vazio", example: '{"name": "..."}' },
    { rule: "Máximo de 100 campos no payload", example: "payload.size() <= 100" },
    { rule: "TIMESTAMP_INCREMENT exige ISO-8601", example: '"2025-12-04T15:40:12.487Z"' },
    { rule: "NUMERIC_INCREMENT exige campo numérico", example: '"score": 10' },
    { rule: "FIXED_VALUES exige lista não vazia", example: '["alice", "bob"]' },
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

      {/* Strategies */}
      <Card className="p-6 bg-card border-border mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Strategies Disponíveis
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {strategies.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-4 bg-secondary rounded-lg border border-border">
                <div className={`p-2 bg-background rounded-md ${s.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <code className="text-sm font-semibold text-primary">{s.name}</code>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

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
        <p className="text-sm text-muted-foreground mb-4">
          Combine múltiplas strategies em um único request para gerar variações ricas a partir de um payload base.
        </p>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Request:</h4>
            <div className="code-editor bg-code-bg">
              <pre className="text-xs text-foreground">
{`{
  "quantidade": 3,
  "payload": {
    "name": "rodolfo",
    "timestamp": "2025-12-04T15:40:12.487Z",
    "userId": "abc-123",
    "score": 10
  },
  "fieldRoles": [
    { "field": "timestamp", "strategy": "TIMESTAMP_INCREMENT" },
    { "field": "userId",    "strategy": "UUID" },
    { "field": "score",     "strategy": "NUMERIC_INCREMENT" },
    { "field": "name",      "strategy": "FIXED_VALUES",
      "values": ["alice", "bob", "carol"] }
  ]
}`}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3">Response:</h4>
            <div className="code-editor bg-code-bg space-y-2">
              <pre className="text-xs text-foreground">
{`[
  {
    "name": "alice",
    "timestamp": "2025-12-04T15:40:12.488Z",
    "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "score": 11
  },
  {
    "name": "bob",
    "timestamp": "2025-12-04T15:40:12.489Z",
    "userId": "9c858901-8a57-4791-81fe-4c455b099bc9",
    "score": 12
  },
  {
    "name": "carol",
    "timestamp": "2025-12-04T15:40:12.490Z",
    "userId": "16fd2706-8baf-433b-82eb-8c7fada847da",
    "score": 13
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
