import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wrench, Car, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserType } from "@/lib/supabase";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro — SOS Carros" },
      { name: "description", content: "Crie sua conta como cliente ou prestador de serviços automotivos." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  // Cliente state
  const [clienteNome, setClienteNome] = useState("");
  const [clienteTel, setClienteTel] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteSenha, setClienteSenha] = useState("");
  
  // Prestador state
  const [prestadorEmpresa, setPrestadorEmpresa] = useState("");
  const [prestadorCnpj, setPrestadorCnpj] = useState("");
  const [prestadorEmail, setPrestadorEmail] = useState("");
  const [prestadorTel, setPrestadorTel] = useState("");
  const [prestadorEsp, setPrestadorEsp] = useState("");
  const [prestadorCep, setPrestadorCep] = useState("");
  const [prestadorSenha, setPrestadorSenha] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(clienteEmail, clienteSenha, clienteNome, 'customer');
      if (error) {
        setError(error.message);
      } else {
        alert("Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.");
        navigate({ to: "/entrar" });
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrestadorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(prestadorEmail, prestadorSenha, prestadorEmpresa, 'provider');
      if (error) {
        setError(error.message);
      } else {
        alert("Conta de prestador criada! Após confirmação do e-mail, você poderá enviar documentos para validação.");
        navigate({ to: "/entrar" });
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-secondary/20 py-12 px-4">
        <Card className="w-full max-w-xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Crie sua conta</h1>
            <p className="text-sm text-muted-foreground">Escolha como você quer usar a SOS Carros</p>
          </div>

          <Tabs defaultValue="cliente" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cliente"><Car className="h-4 w-4 mr-2" />Sou cliente</TabsTrigger>
              <TabsTrigger value="prestador"><Briefcase className="h-4 w-4 mr-2" />Sou prestador</TabsTrigger>
            </TabsList>

            <TabsContent value="cliente">
              <form className="space-y-4" onSubmit={handleClienteSubmit}>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input 
                      id="nome" 
                      placeholder="João Silva" 
                      value={clienteNome}
                      onChange={(e) => setClienteNome(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tel">Telefone</Label>
                    <Input 
                      id="tel" 
                      placeholder="(11) 99999-9999" 
                      value={clienteTel}
                      onChange={(e) => setClienteTel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email-c">E-mail</Label>
                  <Input 
                    id="email-c" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={clienteEmail}
                    onChange={(e) => setClienteEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="senha-c">Senha</Label>
                  <Input 
                    id="senha-c" 
                    type="password" 
                    placeholder="Mínimo 8 caracteres" 
                    value={clienteSenha}
                    onChange={(e) => setClienteSenha(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta de cliente"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="prestador">
              <form className="space-y-4" onSubmit={handlePrestadorSubmit}>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empresa">Razão social / Nome</Label>
                    <Input 
                      id="empresa" 
                      placeholder="Auto Mecânica Silva" 
                      value={prestadorEmpresa}
                      onChange={(e) => setPrestadorEmpresa(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ / CPF</Label>
                    <Input 
                      id="cnpj" 
                      placeholder="00.000.000/0001-00" 
                      value={prestadorCnpj}
                      onChange={(e) => setPrestadorCnpj(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-p">E-mail comercial</Label>
                    <Input 
                      id="email-p" 
                      type="email" 
                      placeholder="contato@empresa.com" 
                      value={prestadorEmail}
                      onChange={(e) => setPrestadorEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tel-p">Telefone</Label>
                    <Input 
                      id="tel-p" 
                      placeholder="(11) 99999-9999" 
                      value={prestadorTel}
                      onChange={(e) => setPrestadorTel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="esp">Especialidade principal</Label>
                  <Input 
                    id="esp" 
                    placeholder="Ex: Mecânica geral, Guincho, Elétrica..." 
                    value={prestadorEsp}
                    onChange={(e) => setPrestadorEsp(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cep">Área de cobertura (CEP)</Label>
                  <Input 
                    id="cep" 
                    placeholder="00000-000" 
                    value={prestadorCep}
                    onChange={(e) => setPrestadorCep(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="senha-p">Senha</Label>
                  <Input 
                    id="senha-p" 
                    type="password" 
                    placeholder="Mínimo 8 caracteres" 
                    value={prestadorSenha}
                    onChange={(e) => setPrestadorSenha(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Após o cadastro, você precisará enviar documentos para validação (até 48h).
                </p>
                <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta de prestador"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta? <Link to="/entrar" className="text-primary font-medium hover:underline">Entrar</Link>
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
