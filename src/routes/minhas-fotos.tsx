import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload as UploadIcon, ImageIcon, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { PhotoUploader } from "@/components/PhotoUploader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/minhas-fotos")({
  head: () => ({
    meta: [
      { title: "Minhas Fotos — SOS Carros" },
      { name: "description", content: "Gerencie as fotos do seu perfil de prestador." },
    ],
  }),
  component: MinhasFotos,
});

function MinhasFotos() {
  const { profile, signOut } = useAuth();
  const queryClient = useQueryClient();

  const handlePhotoUploaded = () => {
    // Invalidate provider queries to refresh the gallery
    queryClient.invalidateQueries({ queryKey: ["provider"] });
    toast.success("Foto adicionada com sucesso!");
  };

  // Get provider ID from profile or mock data
  // In a real scenario, this would come from the authenticated user's provider record
  const providerId = "1"; // This should be fetched from the user's provider record

  return (
    <ProtectedRoute allowedUserTypes={["provider"]}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary/20">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard-parceiro">
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Minhas Fotos</h1>
                <p className="text-muted-foreground">
                  Adicione fotos do seu trabalho para atrair mais clientes
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Upload Section */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <UploadIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Adicionar Foto</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Compartilhe imagens do seu trabalho para mostrar sua qualidade e profissionalismo.
                    </p>
                    
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <h3 className="font-medium text-sm mb-2">Dicas:</h3>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Fotos bem iluminadas</li>
                        <li>Mostre antes e depois</li>
                        <li>Inclua diferentes ângulos</li>
                        <li>Máximo 5MB por imagem</li>
                      </ul>
                    </div>

                    <PhotoUploader 
                      providerId={providerId} 
                      onPhotoUploaded={handlePhotoUploaded}
                    />
                  </div>
                </Card>
              </div>

              {/* Gallery Section */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold">Minha Galeria</h2>
                    </div>
                    <Badge variant="secondary">
                      Fotos públicas no perfil
                    </Badge>
                  </div>

                  <PhotoGallery providerId={providerId} isOwner={true} />
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
