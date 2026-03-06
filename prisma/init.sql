-- AFI Storefront Tables
-- Uses afi_ prefix to coexist with EverShop tables in the same public schema.
-- Run this with: node prisma/run-sql.js

CREATE TABLE IF NOT EXISTS afi_categories (
  id          SERIAL PRIMARY KEY,
  uuid        UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  parent_id   INT REFERENCES afi_categories(id) ON DELETE SET NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS afi_products (
  id             SERIAL PRIMARY KEY,
  uuid           UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  description    TEXT,
  cost_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
  selling_price  NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  currency       TEXT NOT NULL DEFAULT 'GHS',
  category       TEXT,
  category_id    INT REFERENCES afi_categories(id) ON DELETE SET NULL,
  brand          TEXT,
  sku            TEXT UNIQUE,
  stock          INT NOT NULL DEFAULT 0,
  image_url      TEXT,
  gallery        TEXT[] NOT NULL DEFAULT '{}',
  tags           TEXT[] NOT NULL DEFAULT '{}',
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  is_on_sale     BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival BOOLEAN NOT NULL DEFAULT TRUE,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  views_count    INT NOT NULL DEFAULT 0,
  sold_count     INT NOT NULL DEFAULT 0,
  rating         NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count   INT NOT NULL DEFAULT 0,
  weight         NUMERIC(8,2),
  meta_title     TEXT,
  meta_desc      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS afi_orders (
  id              SERIAL PRIMARY KEY,
  uuid            UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT,
  shipping_address TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  payment_method  TEXT NOT NULL DEFAULT 'cash_on_delivery',
  payment_status  TEXT NOT NULL DEFAULT 'unpaid',
  subtotal        NUMERIC(10,2) NOT NULL,
  shipping_fee    NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  notes           TEXT,
  referrer        TEXT,
  source          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS afi_order_items (
  id             SERIAL PRIMARY KEY,
  order_id       INT NOT NULL REFERENCES afi_orders(id) ON DELETE CASCADE,
  product_id     INT REFERENCES afi_products(id) ON DELETE SET NULL,
  product_name   TEXT NOT NULL,
  product_sku    TEXT,
  quantity       INT NOT NULL,
  cost_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
  selling_price  NUMERIC(10,2) NOT NULL,
  total          NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS afi_product_views (
  id         SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES afi_products(id) ON DELETE CASCADE,
  referrer   TEXT,
  source     TEXT,
  ip_hash    TEXT,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_afi_products_category_id ON afi_products(category_id);
CREATE INDEX IF NOT EXISTS idx_afi_products_slug        ON afi_products(slug);
CREATE INDEX IF NOT EXISTS idx_afi_products_is_featured ON afi_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_afi_products_is_on_sale  ON afi_products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_afi_products_is_new      ON afi_products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_afi_orders_status        ON afi_orders(status);
CREATE INDEX IF NOT EXISTS idx_afi_orders_created_at    ON afi_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_afi_views_product_id     ON afi_product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_afi_views_viewed_at      ON afi_product_views(viewed_at);
