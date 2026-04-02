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
        <strong>{rating}/5</strong>
      </div>
      <div className="star-rating-row" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((value) => (
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
