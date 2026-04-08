import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentación API - SafeDeal",
};

export default function DocsPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Documentación API
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Integra SafeDeal en tu aplicación con nuestra API REST. Accede a
          productos, gestiona pedidos y procesa pagos de forma programática.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Autenticación
          </h2>
          <p className="text-[#64748B] text-sm mb-4 leading-relaxed">
            Todas las solicitudes a la API requieren un token de autenticación.
            Obtén tu API key desde el panel de desarrollador en tu cuenta de
            SafeDeal. Incluye el token en el header de cada solicitud.
          </p>
          <div className="bg-[#0F172A] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
{`Authorization: Bearer tu_api_key_aqui
Content-Type: application/json`}
            </pre>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Base URL</h2>
          <div className="bg-[#0F172A] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-cyan-400 font-mono">
{`https://api.safedeal.com/v1`}
            </pre>
          </div>
          <p className="text-[#64748B] text-sm mt-4">
            Todas las respuestas se devuelven en formato JSON. Las fechas
            utilizan formato ISO 8601. Los montos monetarios se expresan en
            centavos (USD).
          </p>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">
              GET
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              /api/products
            </h2>
          </div>
          <p className="text-[#64748B] text-sm mb-4">
            Obtiene una lista paginada de productos. Soporta filtros por
            categoría, precio, vendedor y estado.
          </p>
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">
            Parámetros de consulta
          </h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left px-4 py-2 font-semibold text-[#0F172A]">Parámetro</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#0F172A]">Tipo</th>
                  <th className="text-left px-4 py-2 font-semibold text-[#0F172A]">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="px-4 py-2 font-mono text-[#E6007E] text-xs">page</td>
                  <td className="px-4 py-2 text-[#64748B]">number</td>
                  <td className="px-4 py-2 text-[#64748B]">Página (default: 1)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-[#E6007E] text-xs">limit</td>
                  <td className="px-4 py-2 text-[#64748B]">number</td>
                  <td className="px-4 py-2 text-[#64748B]">Resultados por página (default: 20, max: 100)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-[#E6007E] text-xs">category</td>
                  <td className="px-4 py-2 text-[#64748B]">string</td>
                  <td className="px-4 py-2 text-[#64748B]">Filtrar por categoría</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-[#E6007E] text-xs">min_price</td>
                  <td className="px-4 py-2 text-[#64748B]">number</td>
                  <td className="px-4 py-2 text-[#64748B]">Precio mínimo en centavos</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-[#E6007E] text-xs">max_price</td>
                  <td className="px-4 py-2 text-[#64748B]">number</td>
                  <td className="px-4 py-2 text-[#64748B]">Precio máximo en centavos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">
            Ejemplo de respuesta
          </h3>
          <div className="bg-[#0F172A] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`{
  "data": [
    {
      "id": "prod_abc123",
      "title": "Cuenta Premium Gaming",
      "price": 2999,
      "currency": "USD",
      "category": "gaming",
      "seller": {
        "id": "usr_xyz789",
        "username": "gamer_pro",
        "trust_score": 95
      },
      "status": "active",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1543,
    "pages": 78
  }
}`}
            </pre>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">
              GET
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              /api/products/[id]
            </h2>
          </div>
          <p className="text-[#64748B] text-sm mb-4">
            Obtiene los detalles completos de un producto específico por su ID.
          </p>
          <div className="bg-[#0F172A] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`GET /api/products/prod_abc123

{
  "id": "prod_abc123",
  "title": "Cuenta Premium Gaming",
  "description": "Cuenta con 50+ juegos premium...",
  "price": 2999,
  "currency": "USD",
  "category": "gaming",
  "images": [
    "https://cdn.safedeal.com/img/abc123_1.jpg"
  ],
  "seller": {
    "id": "usr_xyz789",
    "username": "gamer_pro",
    "trust_score": 95,
    "verified": true
  },
  "delivery_type": "digital",
  "status": "active",
  "views": 342,
  "favorites": 28,
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-20T14:00:00Z"
}`}
            </pre>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
              POST
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              /api/products
            </h2>
          </div>
          <p className="text-[#64748B] text-sm mb-4">
            Crea un nuevo producto. Requiere autenticación de vendedor.
          </p>
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">
            Cuerpo de la solicitud
          </h3>
          <div className="bg-[#0F172A] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`POST /api/products
Content-Type: application/json

{
  "title": "Mi Producto Digital",
  "description": "Descripción detallada del producto...",
  "price": 1999,
  "currency": "USD",
  "category": "gaming",
  "delivery_type": "digital",
  "images": ["base64_encoded_image..."],
  "tags": ["gaming", "premium", "digital"]
}`}
            </pre>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
              POST
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              /api/cart
            </h2>
          </div>
          <p className="text-[#64748B] text-sm mb-4">
            Agrega un producto al carrito del usuario autenticado.
          </p>
          <div className="bg-[#0F172A] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`POST /api/cart
Content-Type: application/json

{
  "product_id": "prod_abc123",
  "quantity": 1
}

// Respuesta exitosa (201)
{
  "message": "Producto agregado al carrito",
  "cart": {
    "items": 3,
    "total": 7997
  }
}`}
            </pre>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Límites de Uso
          </h2>
          <div className="text-[#64748B] text-sm leading-relaxed space-y-4">
            <p>
              La API tiene límites de uso para garantizar un servicio estable para
              todos los usuarios.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="text-left px-4 py-2 font-semibold text-[#0F172A]">Plan</th>
                    <th className="text-left px-4 py-2 font-semibold text-[#0F172A]">Solicitudes/min</th>
                    <th className="text-left px-4 py-2 font-semibold text-[#0F172A]">Solicitudes/día</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  <tr>
                    <td className="px-4 py-2 text-[#0F172A]">Gratis</td>
                    <td className="px-4 py-2 text-[#64748B]">30</td>
                    <td className="px-4 py-2 text-[#64748B]">1,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-[#0F172A]">SafeDeal Plus</td>
                    <td className="px-4 py-2 text-[#64748B]">120</td>
                    <td className="px-4 py-2 text-[#64748B]">10,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-[#0F172A]">Enterprise</td>
                    <td className="px-4 py-2 text-[#64748B]">500</td>
                    <td className="px-4 py-2 text-[#64748B]">100,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Cuando se excede el límite, la API responde con un código 429
              (Too Many Requests). El header{" "}
              <code className="bg-[#F8FAFC] px-2 py-0.5 rounded text-[#E6007E] text-xs">
                X-RateLimit-Reset
              </code>{" "}
              indica cuándo puedes volver a hacer solicitudes.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
