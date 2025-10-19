import { Construction } from "lucide-react";

export default function Agent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Construction className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-2xl font-semibold text-foreground">Em Construção</h2>
      <p className="text-muted-foreground">O Agente de IA será implementado em breve.</p>
    </div>
  );
}
