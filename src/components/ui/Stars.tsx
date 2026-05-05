import Icon from './Icon';

interface StarsProps {
  value: number;
  size?: number;
}

export default function Stars({ value, size = 12 }: StarsProps) {
  return (
    <span className="stars" aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name="star" size={size} />
      ))}
      <span className="stars-fill" style={{ width: `${(value / 5) * 100}%` }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Icon key={i} name="star" size={size} />
        ))}
      </span>
    </span>
  );
}
