import InfoPageLayout from '@/components/ui/InfoPageLayout';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

export default function NuestraHistoriaPage() {
  return (
    <InfoPageLayout 
      eyebrow="Nuestra Esencia"
      title="Nuestra Historia"
      subtitle="Donde lo natural se vuelve sagrado y cada objeto cuenta una historia única de conexión."
    >
      <div className="flex flex-col gap-16">
        {/* Editorial Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <ProductPlaceholder tone="sage" label="alma · boutique" aspectRatio={4/5} />
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-6">
            <h2 className="font-serif text-3xl italic text-stone-800">El origen de un ritual</h2>
            <p className="text-stone-600 leading-relaxed font-light">
              La Botica del Alma nació de una búsqueda personal por reconectar con la tierra y sus secretos. Lo que comenzó como una curiosidad por los cristales y las resinas, se convirtió en una curaduría dedicada a encontrar piezas que no solo decoran, sino que elevan el espíritu.
            </p>
            <p className="text-stone-600 leading-relaxed font-light">
              Cada objeto que seleccionamos ha sido elegido por su vibración, su procedencia y la historia de las manos que lo crearon.
            </p>
          </div>
        </div>

        {/* Editorial Section 2 */}
        <div className="flex flex-col gap-8 text-center max-w-2xl mx-auto py-12">
          <h2 className="font-serif text-4xl italic text-stone-800">Artesanía & Alma</h2>
          <p className="text-stone-600 leading-relaxed font-light">
            Creemos en el valor de lo lento. En un mundo acelerado, proponemos objetos que invitan a la pausa, al ritual diario de encender una vela o meditar con una piedra entre las manos. Trabajamos codo a codo con artesanos latinoamericanos que mantienen vivas técnicas ancestrales.
          </p>
          <div className="h-px w-20 bg-stone-200 mx-auto" />
          <p className="font-serif text-xl italic text-stone-500">
            &ldquo;No vendemos objetos, ofrecemos herramientas para tu propia medicina.&rdquo;
          </p>
        </div>

        {/* Curation Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-stone-200">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">01. Curaduría</span>
            <p className="text-sm text-stone-600 font-light leading-relaxed">Seleccionamos cada cristal y amuleto uno por uno, asegurando su pureza y origen ético.</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">02. Intención</span>
            <p className="text-sm text-stone-600 font-light leading-relaxed">Nuestras velas y sahumerios son creados bajo ciclos lunares específicos para potenciar su energía.</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">03. Comunidad</span>
            <p className="text-sm text-stone-600 font-light leading-relaxed">Apoyamos a pequeños productores locales, fomentando un comercio justo y consciente.</p>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}
