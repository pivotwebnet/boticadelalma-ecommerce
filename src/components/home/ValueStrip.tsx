import Icon from '@/components/ui/Icon';

const ITEMS = [
  { icon: 'truck',   title: 'Envío gratis',          sub: 'En compras +$120.000' },
  { icon: 'shield',  title: '3 cuotas sin interés',  sub: 'Todas las tarjetas'   },
  { icon: 'leaf',    title: 'Origen consciente',      sub: 'Piezas curadas'       },
  { icon: 'sparkle', title: 'Empaque ritual',         sub: 'Envuelto a mano'      },
];

export default function ValueStrip() {
  return (
    <section className="value-strip" data-reveal="stagger">
      {ITEMS.map(it => (
        <div key={it.title} className="vs-item">
          <Icon name={it.icon} size={22} stroke={1.2} />
          <div>
            <strong>{it.title}</strong>
            <span>{it.sub}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
