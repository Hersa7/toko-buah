import Badge from './Badge.jsx'
import MaterialIcon from './MaterialIcon.jsx'

export default function ProductCard({ image, imageAlt, badge, name, unit, price, outOfStock = false, onAddToCart }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_12px_rgba(74,74,74,0.1)] flex flex-col relative overflow-hidden group">
      <div className="relative w-full pb-[100%]">
        <img
          className={`absolute inset-0 w-full h-full object-cover rounded-t-lg ${outOfStock ? 'grayscale opacity-60' : ''}`}
          src={image}
          alt={imageAlt || name}
        />
        {outOfStock ? (
          <Badge variant="netral" className="absolute top-2 left-2 bg-inverse-surface text-inverse-on-surface">
            Stok Habis
          </Badge>
        ) : (
          badge && (
            <Badge variant={badge.variant} className="absolute top-2 left-2">
              {badge.label}
            </Badge>
          )
        )}
      </div>
      <div className="p-sm flex flex-col flex-grow">
        <h3 className="font-headline-md text-headline-md text-on-background mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{unit}</p>
        <div className="mt-auto flex justify-between items-end">
          <span className="font-label-price text-label-price text-secondary">{price}</span>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={outOfStock}
            aria-label={outOfStock ? `${name} sedang habis` : `Tambah ${name} ke keranjang`}
            className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:bg-[#a66a00] transition-colors shadow-sm disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:cursor-not-allowed disabled:hover:bg-surface-container-highest"
          >
            <MaterialIcon name="add" />
          </button>
        </div>
      </div>
    </div>
  )
}
