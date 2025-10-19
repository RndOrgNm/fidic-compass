import { Construction } from "lucide-react";

export default function Investors() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Construction className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-2xl font-semibold text-foreground">Em Construção</h2>
      <p className="text-muted-foreground">A página de Investidores será implementada em breve.</p>
    </div>
  );
}
