import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Clock, MessageCircle, Star, AlertTriangle, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard-cliente")({
  head: () => ({
    meta: [
      { title: "Painel do Cliente — SOS Carros" },
      { name: "description", content: "Acompanhe suas solicitações de socorro." },
    ],
  }),
  component: DashboardCliente,
});

function DashboardCliente() {
  const { profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  const recentRequests = [
    { id: "r1", service: "Pane elétrica", status: "Em andamento", provider: "Auto Socorro Silva", time: "há 10 min", location: "Rua das Flores, 123" },
    { id: "r2", service: "Troca de pneu", status: "Concluído", provider: "Rápido Pneus", time: "há 2 dias", location: "Av. Paulista, 1000" },
    { id: "r3", service: "Combustível", status: "Concluído", provider: "Posto Móvel", time: "há 1 semana", location: "Rua Augusta, 500" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento": return "bg-primary text-primary-foreground hover:bg-primary";
      case "Concluído": return "bg-success text-success-foreground hover:bg-success";
      case "Cancelado": return "bg-destructive text-destructive-foreground hover:bg-destructive";
      default: return "bg-secondary text-secondary-foreground hover:bg-secondary";
    }
  };

  return (
    <ProtectedRoute allowedUserTypes={["customer"]}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Olá, {profile?.full_name || 'Cliente'} 👋</h1>
                <p className="text-muted-foreground">Gerencie suas solicitações de socorro</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Botão de Emergência */}
            <Card className="p-6 mb-8 bg-gradient-primary border-0">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Precisa de ajuda agora?</h2>
                    <p className="text-white/80">Solicite socorro imediato e receba atendimento em minutos</p>
                  </div>
                </div>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8">
                  <Car className="h-5 w-5 mr-2" />
                  Pedir Socorro
                </Button>
              </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Solicitações Recentes */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Solicitações recentes</h2>
                    <Badge variant="secondary">{recentRequests.length} registros</Badge>
                  </div>

                  <div className="space-y-3">
                    {recentRequests.map((r) => (
                      <Card key={r.id} className="p-4 hover:shadow-card transition-smooth">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{r.service}</h3>
                              <p className="text-sm text-muted-foreground">{r.provider}</p>
                            </div>
                            <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
                          </div>
                          {r.status === "Em andamento" && (
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contatar
                              </Button>
                              <Button variant="ghost" size="sm" className="flex-1">
                                Ver detalhes
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Atalhos rápidos</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/buscar"><Car className="h-4 w-4 mr-2" />Nova solicitação</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />Minhas avaliações
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />Mensagens
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />Histórico completo
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-accent/10 border-accent/20">
                  <h3 className="font-semibold mb-2 text-accent">Dica de segurança</h3>
                  <p className="text-sm text-muted-foreground">
                    Sempre verifique a identificação do prestador antes de permitir o serviço. 
                    Nossa plataforma garante profissionais verificados.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
