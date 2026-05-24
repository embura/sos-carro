import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Search, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/mock";
import { useState } from "react";
import { z } from "zod";
import { useProviders } from "@/hooks/useProviders";

const searchSchema = z.object({
  categoria: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/buscar")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Buscar prestadores — SOS Carros" },
      { name: "description", content: "Encontre prestadores de serviços automotivos perto de você. Filtre por especialidade, avaliação e distância." },
    ],
  }),
  component: Buscar,
});

function Buscar() {
  const search = Route.useSearch();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(search.categoria);
  const [query, setQuery] = useState(search.q ?? "");

  // Usar o hook useProviders para buscar dados do Supabase
  const { data: providers, isLoading, error } = useProviders({
    category: activeCategory as any,
    city: query || undefined,
  });

  // Filtrar por query de texto quando houver busca
  const filtered = (providers || []).filter((p) => {
    if (!query) return true;
    const queryLower = query.toLowerCase();
    return (
      p.business_name.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower) ||
      p.city.toLowerCase().includes(queryLower)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando prestadores...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary/20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Erro ao carregar prestadores</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20">
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Buscar prestadores</h1>
            <p className="text-muted-foreground mb-6">Encontre o profissional certo para você</p>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="O que você procura? Ex: troca de óleo, guincho..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="hero" size="lg">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
              <Button variant="outline" size="lg">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              <Button
                variant={!activeCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(undefined)}
              >
                Todos
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} prestador{filtered.length !== 1 ? "es" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <Link key={p.id} to="/prestador/$id" params={{ id: p.id }}>
                <Card className="p-5 hover:shadow-elegant transition-smooth hover:-translate-y-1 cursor-pointer h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <img 
                      src={p.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.business_name)}&backgroundColor=c0392b`} 
                      alt={p.business_name} 
                      className="h-12 w-12 rounded-full bg-secondary" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{p.business_name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{p.category}</p>
                    </div>
                    {p.is_available ? (
                      <Badge className="bg-success text-success-foreground hover:bg-success">Disponível</Badge>
                    ) : (
                      <Badge variant="outline">Ocupado</Badge>
                    )}
                  </div>

                  {p.badges && p.badges.length > 0 && (
                    <Badge variant="secondary" className="mb-3 bg-accent/20 text-foreground">
                      ⭐ {p.badges[0]}
                    </Badge>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-sm pt-3 border-t border-border">
                    <div>
                      <div className="flex items-center gap-1 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        {p.rating}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.reviews_count} aval.</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-semibold">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.city}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.state}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        {p.response_time || 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">resposta</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">A partir de</span>
                    <span className="text-lg font-bold text-primary">R$ {p.price_from?.toFixed(0) || '0'}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Nenhum prestador encontrado com esses filtros.</p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
