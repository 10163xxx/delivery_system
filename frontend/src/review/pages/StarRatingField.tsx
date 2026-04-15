import { MAX_RATING, MIN_RATING } from '@/shared/delivery/DeliveryServices'

export function StarRatingField({
  label,
  rating,
  onChange,
}: {
  label: string
  rating: number
  onChange: (rating: number) => void
}) {
  return (
    <div className="review-rating-field">
      <div className="review-rating-header">
        <span>{label}</span>
        <strong>{rating}/{MAX_RATING}</strong>
      </div>
      <div className="star-rating-row" role="radiogroup" aria-label={label}>
        {Array.from(
          { length: MAX_RATING - MIN_RATING + 1 },
          (_, index) => MIN_RATING + index,
        ).map((value) => (
          <button
            key={`${label}-${value}`}
            aria-checked={rating === value}
            className={value <= rating ? 'star-rating-button is-active' : 'star-rating-button'}
            onClick={() => onChange(value)}
            type="button"
            role="radio"
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
