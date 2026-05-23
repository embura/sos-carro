import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Star, CheckCircle, TrendingUp, MessageCircle, MapPin, LogOut, Wrench, Calendar, Clock, Image as ImageIcon } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard-parceiro")({
  head: () => ({
    meta: [
      { title: "Painel do Parceiro — SOS Carros" },
      { name: "description", content: "Gerencie seus serviços e ganhos." },
    ],
  }),
  component: DashboardParceiro,
});

function DashboardParceiro() {
  const { profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    { label: "Ganhos do mês", value: "R$ 4.820", icon: DollarSign, color: "text-success" },
    { label: "Serviços concluídos", value: "37", icon: CheckCircle, color: "text-primary" },
    { label: "Avaliação média", value: "4.9", icon: Star, color: "text-accent" },
    { label: "Taxa de aceite", value: "92%", icon: TrendingUp, color: "text-success" },
  ];

  const requests = [
    { id: "s1", client: "João P.", service: "Pane elétrica", distance: "1.2 km", time: "agora", urgent: true, location: "Rua das Flores, 123" },
    { id: "s2", client: "Maria S.", service: "Troca de pneu", distance: "3.5 km", time: "em 2h", urgent: false, location: "Av. Paulista, 1000" },
    { id: "s3", client: "Carlos M.", service: "Diagnóstico geral", distance: "0.8 km", time: "amanhã 9h", urgent: false, location: "Rua Augusta, 500" },
  ];

  return (
    <ProtectedRoute allowedUserTypes={["provider"]}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Olá, {profile?.full_name || 'Parceiro'} 👋</h1>
                <p className="text-muted-foreground">Aqui está o resumo da sua atividade</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground hover:bg-success">
                  ● Online — recebendo solicitações
                </Badge>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <Card key={s.label} className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Solicitações */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Solicitações pendentes</h2>
                    <Badge variant="secondary">{requests.length} novas</Badge>
                  </div>

                  <div className="space-y-3">
                    {requests.map((r) => (
                      <Card key={r.id} className="p-4 hover:shadow-card transition-smooth">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{r.client}</h3>
                              {r.urgent && (
                                <Badge className="bg-primary text-primary-foreground hover:bg-primary text-xs">URGENTE</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{r.service}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                            </div>
                            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.distance}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">Recusar</Button>
                            <Button variant="hero" size="sm" className="flex-1 sm:flex-initial">Aceitar</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Carteira</h3>
                  <p className="text-sm text-muted-foreground">Saldo disponível</p>
                  <p className="text-3xl font-bold text-primary mb-4">R$ 1.240,50</p>
                  <Button variant="hero" className="w-full">Solicitar saque</Button>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-3">Atalhos</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/buscar"><MessageCircle className="h-4 w-4 mr-2" />Mensagens</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/minhas-fotos"><ImageIcon className="h-4 w-4 mr-2" />Minhas fotos</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />Minhas avaliações
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />Histórico financeiro
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />Disponibilidade
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Wrench className="h-4 w-4 mr-2" />Meus serviços
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-accent/10 border-accent/20">
                  <h3 className="font-semibold mb-2 text-accent">Dica do parceiro</h3>
                  <p className="text-sm text-muted-foreground">
                    Mantenha seu perfil atualizado e responda rapidamente às solicitações 
                    para aumentar suas chances de ser escolhido pelos clientes.
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
