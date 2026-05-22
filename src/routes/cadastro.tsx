import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wrench, Car, Briefcase, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";

// Schema de validação para cliente
const customerSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

// Schema de validação para prestador
const providerSchema = z.object({
  companyName: z.string().min(3, "Nome da empresa deve ter pelo menos 3 caracteres"),
  document: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  specialty: z.string().min(3, "Especialidade é obrigatória"),
  cep: z.string().min(8, "CEP inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type CustomerFormData = z.infer<typeof customerSchema>;
type ProviderFormData = z.infer<typeof providerSchema>;

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
  const [activeTab, setActiveTab] = useState<"cliente" | "prestador">("cliente");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form hook para cliente
  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Form hook para prestador
  const providerForm = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      companyName: "",
      document: "",
      email: "",
      phone: "",
      specialty: "",
      cep: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const handleCustomerSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    setError(null);

    const { error } = await signUp(data.email, data.password, data.fullName, "customer");

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 2000);
    }
  };

  const handleProviderSubmit = async (data: ProviderFormData) => {
    setLoading(true);
    setError(null);

    // Para prestador, usamos o companyName como full_name
    const { error } = await signUp(data.email, data.password, data.companyName, "provider");

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Aqui poderia redirecionar para uma página de upload de documentos
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 2000);
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

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Cadastro realizado com sucesso!</p>
                <p className="text-sm text-green-600">Redirecionando...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "cliente" | "prestador")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cliente"><Car className="h-4 w-4 mr-2" />Sou cliente</TabsTrigger>
              <TabsTrigger value="prestador"><Briefcase className="h-4 w-4 mr-2" />Sou prestador</TabsTrigger>
            </TabsList>

            <TabsContent value="cliente">
              <form className="space-y-4" onSubmit={customerForm.handleSubmit(handleCustomerSubmit)}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input 
                      id="fullName" 
                      placeholder="João Silva" 
                      {...customerForm.register("fullName")}
                      disabled={loading}
                    />
                    {customerForm.formState.errors.fullName && (
                      <p className="text-xs text-red-600 mt-1">{customerForm.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(11) 99999-9999" 
                      {...customerForm.register("phone")}
                      disabled={loading}
                    />
                    {customerForm.formState.errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{customerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    {...customerForm.register("email")}
                    disabled={loading}
                  />
                  {customerForm.formState.errors.email && (
                    <p className="text-xs text-red-600 mt-1">{customerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Mínimo 8 caracteres" 
                    {...customerForm.register("password")}
                    disabled={loading}
                  />
                  {customerForm.formState.errors.password && (
                    <p className="text-xs text-red-600 mt-1">{customerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Repita a senha" 
                    {...customerForm.register("confirmPassword")}
                    disabled={loading}
                  />
                  {customerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{customerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    {...customerForm.register("terms")}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    Aceito os <a href="#" className="text-primary hover:underline">termos de uso</a> e <a href="#" className="text-primary hover:underline">política de privacidade</a>
                  </Label>
                </div>
                {customerForm.formState.errors.terms && (
                  <p className="text-xs text-red-600">{customerForm.formState.errors.terms.message}</p>
                )}

                <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta de cliente"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="prestador">
              <form className="space-y-4" onSubmit={providerForm.handleSubmit(handleProviderSubmit)}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Razão social / Nome</Label>
                    <Input 
                      id="companyName" 
                      placeholder="Auto Mecânica Silva" 
                      {...providerForm.register("companyName")}
                      disabled={loading}
                    />
                    {providerForm.formState.errors.companyName && (
                      <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.companyName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="document">CNPJ / CPF</Label>
                    <Input 
                      id="document" 
                      placeholder="00.000.000/0001-00" 
                      {...providerForm.register("document")}
                      disabled={loading}
                    />
                    {providerForm.formState.errors.document && (
                      <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.document.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="providerEmail">E-mail comercial</Label>
                    <Input 
                      id="providerEmail" 
                      type="email" 
                      placeholder="contato@empresa.com" 
                      {...providerForm.register("email")}
                      disabled={loading}
                    />
                    {providerForm.formState.errors.email && (
                      <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="providerPhone">Telefone</Label>
                    <Input 
                      id="providerPhone" 
                      placeholder="(11) 99999-9999" 
                      {...providerForm.register("phone")}
                      disabled={loading}
                    />
                    {providerForm.formState.errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialty">Especialidade principal</Label>
                  <Input 
                    id="specialty" 
                    placeholder="Ex: Mecânica geral, Guincho, Elétrica..." 
                    {...providerForm.register("specialty")}
                    disabled={loading}
                  />
                  {providerForm.formState.errors.specialty && (
                    <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.specialty.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cep">Área de cobertura (CEP)</Label>
                  <Input 
                    id="cep" 
                    placeholder="00000-000" 
                    {...providerForm.register("cep")}
                    disabled={loading}
                  />
                  {providerForm.formState.errors.cep && (
                    <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.cep.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="providerPassword">Senha</Label>
                  <Input 
                    id="providerPassword" 
                    type="password" 
                    placeholder="Mínimo 8 caracteres" 
                    {...providerForm.register("password")}
                    disabled={loading}
                  />
                  {providerForm.formState.errors.password && (
                    <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="providerConfirmPassword">Confirmar senha</Label>
                  <Input 
                    id="providerConfirmPassword" 
                    type="password" 
                    placeholder="Repita a senha" 
                    {...providerForm.register("confirmPassword")}
                    disabled={loading}
                  />
                  {providerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{providerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="providerTerms"
                    {...providerForm.register("terms")}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="providerTerms" className="text-sm font-normal">
                    Aceito os <a href="#" className="text-primary hover:underline">termos de uso</a> e <a href="#" className="text-primary hover:underline">política de privacidade</a>
                  </Label>
                </div>
                {providerForm.formState.errors.terms && (
                  <p className="text-xs text-red-600">{providerForm.formState.errors.terms.message}</p>
                )}

                <p className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
                  <strong>Importante:</strong> Após o cadastro, você precisará enviar documentos para validação (até 48h).
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
