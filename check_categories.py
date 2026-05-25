import os
from supabase import create_client, Client

supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("Erro: Variáveis de ambiente não configuradas")
    exit(1)

supabase: Client = create_client(supabase_url, supabase_key)

# Tentar descobrir as categorias válidas consultando a tabela providers existente
try:
    # Buscar categorias únicas já existentes
    response = supabase.rpc("get_distinct_categories").execute()
    print("Categorias encontradas:", response.data)
except Exception as e:
    print(f"Método RPC não disponível: {e}")

# Alternativa: tentar inserir uma categoria teste para ver o erro completo
try:
    # Consultar informação do ENUM diretamente via SQL raw
    result = supabase.rpc("exec_sql", {"query": """
        SELECT unnest(enum_range(NULL::service_category)) as valid_categories;
    """}).execute()
    print("Valores válidos do ENUM service_category:")
    for row in result.data:
        print(f"  - {row['valid_categories']}")
except Exception as e:
    print(f"Não foi possível consultar o ENUM: {e}")
    print("\nDica: Verifique no Supabase Dashboard > SQL Editor com:")
    print("SELECT unnest(enum_range(NULL::service_category));")
