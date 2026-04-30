import ProductForm from '../_form';

export default function NewProductPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A' }}>Add Product</h1>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>Create a new product in the catalogue</p>
      </div>
      <ProductForm />
    </div>
  );
}
