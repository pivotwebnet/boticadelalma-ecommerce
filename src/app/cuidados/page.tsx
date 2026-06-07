import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Accordion from '@/components/ui/Accordion';
import Icon from '@/components/ui/Icon';

export default function CuidadosPage() {
  const careItems = [
    {
      title: "Limpieza de Cristales",
      children: (
        <div className="flex flex-col gap-4">
          <p>Los cristales absorben la energía de su entorno. Para que sigan vibrando alto, es vital limpiarlos regularmente.</p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
            <li><strong>Sahumado:</strong> Pasá el cristal por el humo de un sahumerio de sándalo o ruda.</li>
            <li><strong>Luz Lunar:</strong> Dejalos toda la noche bajo la luz de la luna llena.</li>
            <li><strong>Selenite:</strong> Colocá tus cristales sobre una placa de selenite por unas horas.</li>
            <li className="text-brand-orange italic">Evitá sumergir cristales porosos (como Malaquita o Turquesa) en agua con sal.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Uso de Velas de Intención",
      children: (
        <div className="flex flex-col gap-4">
          <p>Nuestras velas son rituales en sí mismos. Seguí estos consejos para un quemado sagrado:</p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
            <li>En la primera encendida, dejá que la cera se derrita hasta los bordes.</li>
            <li>Cortá el pabilo a 0.5cm antes de cada uso para evitar humo negro.</li>
            <li>Mantenela lejos de corrientes de aire y nunca la dejes sola.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Cuidado de Joyas & Amuletos",
      children: (
        <div className="flex flex-col gap-4">
          <p>Para que tus piezas conserven su brillo y energía:</p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
            <li>Evitá el contacto con perfumes, cremas o químicos.</li>
            <li>Guardalas en su bolsita de tela original cuando no las uses.</li>
            <li>Limpiá el metal con un paño seco y suave.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <InfoPageLayout 
      eyebrow="Preservá la Magia"
      title="Guía de Cuidados"
      subtitle="Consejos para mantener la energía y belleza de tus cristales, velas y piezas únicas."
    >
      <div className="mb-16">
        <Accordion items={careItems} />
      </div>

      <div className="p-12 rounded-[3rem] bg-accent/5 border border-accent/10 flex flex-col items-center gap-6 text-center">
        <Icon name="leaf" size={40} className="text-accent/40" />
        <p className="text-stone-600 italic font-serif text-lg">&ldquo;Cuidar tus objetos es una forma de honrar tu propia energía.&rdquo;</p>
      </div>
    </InfoPageLayout>
  );
}
