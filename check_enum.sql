-- Consultar valores válidos do ENUM service_category
SELECT unnest(enum_range(NULL::service_category)) as valid_categories;
