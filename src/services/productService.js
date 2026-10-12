import { apiRequest } from './api';

const numberOrNull = (value) =>
  value === null || value === undefined || value === '' ? null : Number(value);

const categorySlug = (value) => String(value ?? '')
  .trim().toLowerCase().replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function mapVariant(variant) {
  const regularPrice = numberOrNull(variant.price);
  const discountedPrice = numberOrNull(variant.discountedPrice);
  const price = variant.offerActive === true && discountedPrice !== null
    ? discountedPrice : regularPrice;
  return {
    id: variant.id,
    variantId: variant.id,
    productId: variant.productId,
    sku: variant.sku,
    size: `${variant.sizeValue} ${variant.sizeUnit}`,
    price,
    mrp: numberOrNull(variant.mrp),
    regularPrice,
    offerActive: variant.offerActive === true,
    active: variant.active === true,
  };
}

function mapProduct(product, variants, images) {
  const sizes = variants.filter(v => v.active === true).map(mapVariant);
  if (sizes.length) sizes[0].isDefault = true;

  const gallery = [...images]
    .filter(image => image.imageUrl)
    .sort((a, b) =>
      Number(b.primary === true) - Number(a.primary === true) ||
      (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
    )
    .map(image => image.imageUrl);

  return {
    id: product.id,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    category: categorySlug(product.categoryName),
    name: product.name,
    slug: product.slug,
    tagline: product.shortDescription ?? '',
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    price: sizes[0]?.price ?? numberOrNull(product.basePrice),
    originalPrice: sizes[0]?.mrp ?? numberOrNull(product.mrp),
    sizes,
    image: gallery[0] ?? '',
    gallery,
    active: product.active === true,
    isFeatured: product.featured === true,
    displayOrder: product.displayOrder ?? 0,
  };
}

async function enrichProduct(product) {
  const [variants, images] = await Promise.all([
    apiRequest(`/products/${product.id}/variants`, { auth: false }),
    apiRequest(`/products/${product.id}/images`, { auth: false }),
  ]);
  return mapProduct(product, Array.isArray(variants) ? variants : [], Array.isArray(images) ? images : []);
}

async function enrichProducts(products) {
  if (!Array.isArray(products)) throw new Error('Invalid product list from server.');
  return Promise.all(products.map(enrichProduct));
}

function filterAndSort(products, { category = 'all', search = '', sortBy = 'featured' } = {}) {
  let result = products.filter(p => p.active);
  if (category !== 'all' && category !== '') {
    result = result.filter(p => p.category === category || String(p.categoryId) === String(category));
  }
  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(p => [p.name, p.tagline, p.description, p.categoryName]
      .some(value => String(value ?? '').toLowerCase().includes(q)));
  }
  if (sortBy === 'price-low') result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  else if (sortBy === 'price-high') result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'featured') result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.displayOrder - b.displayOrder);
  return result;
}

export const productService = {
  async getAllProducts(filters = {}) {
    const products = await apiRequest('/products', { auth: false });
    return filterAndSort(await enrichProducts(products), filters);
  },
  async getFeaturedProducts() {
    const products = await apiRequest('/products/featured', { auth: false });
    return (await enrichProducts(products)).filter(p => p.active);
  },
  async getProductById(id) {
    const product = await apiRequest(`/products/${id}`, { auth: false });
    return enrichProduct(product);
  },
  async getProductBySlug(slug) {
    // Backend currently has no GET /products/slug/{slug}.
    const products = await apiRequest('/products', { auth: false });
    if (!Array.isArray(products)) throw new Error('Invalid product list from server.');
    const product = products.find(p => p.slug === slug && p.active === true);
    if (!product) throw new Error(`Product '${slug}' not found.`);
    return enrichProduct(product);
  },
  async getRelatedProducts(currentId, limit = 4) {
    const products = await this.getAllProducts();
    return products.filter(p => String(p.id) !== String(currentId)).slice(0, limit);
  },
  async getProductsByCategory(categoryId) {
    const products = await apiRequest(`/products/category/${categoryId}`, { auth: false });
    return (await enrichProducts(products)).filter(p => p.active);
  },
  async getProductVariants(productId) {
    const variants = await apiRequest(`/products/${productId}/variants`, { auth: false });
    return (Array.isArray(variants) ? variants : []).filter(v => v.active === true).map(mapVariant);
  },
};
