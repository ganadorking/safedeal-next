"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function SellPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [deliveryType, setDeliveryType] = useState("manual");
  const [stock, setStock] = useState("1");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let imageUrl = "";

      // Upload image first if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Error al subir imagen");
        imageUrl = uploadData.url || uploadData.secure_url || "";
      }

      const body = {
        title,
        shortDescription,
        description,
        categoryId: parseInt(categoryId),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        deliveryType,
        stock: parseInt(stock),
        tags,
        mainImage: imageUrl || null,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear producto");

      setSuccess(true);
      setTimeout(() => router.push("/my-products"), 1500);
    } catch (err: any) {
      setError(err.message || "Ocurrio un error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#E6007E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-[#64748B] mb-1.5";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Publicar Producto</h1>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[14px] p-4 flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-emerald-500" />
          <p className="text-sm text-emerald-700 font-medium">Producto creado exitosamente. Redirigiendo...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Imagen Principal</h3>
          <div className="flex items-start gap-6">
            <label className="w-40 h-40 rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center justify-center cursor-pointer hover:border-[#E6007E] transition-colors shrink-0 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-2xl text-[#E6007E] mb-2" />
                  <span className="text-xs text-[#94A3B8] text-center px-2">Arrastra o haz clic</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <div className="text-sm text-[#94A3B8]">
              <p className="font-medium text-[#64748B] mb-1">Sube la imagen principal</p>
              <p>Formatos: JPG, PNG, WebP</p>
              <p>Tamano maximo: 5MB</p>
              <p>Relacion recomendada: 3:4</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#0F172A]">Informacion Basica</h3>

          <div>
            <label className={labelClass}>Titulo del producto *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Gift Card Xbox $50 USD"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Descripcion corta</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Una linea que describa tu producto"
              maxLength={500}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Descripcion completa</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu producto en detalle: que incluye, como se entrega, condiciones, etc."
              rows={5}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className={labelClass}>Categoria *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Selecciona una categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#0F172A]">Precio y Stock</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Precio (USD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Precio original (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo de entrega *</label>
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className={inputClass}
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatica (claves)</option>
                <option value="file">Archivo digital</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Stock *</label>
              <input
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Etiquetas</h3>
          <div>
            <label className={labelClass}>Tags (separados por comas)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="xbox, gift card, juegos, digital"
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#E6007E] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-rocket" /> Publicar Producto
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
