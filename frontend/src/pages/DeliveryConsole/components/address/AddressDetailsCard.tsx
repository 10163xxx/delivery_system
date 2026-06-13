import type {
  AddressDetailsCardData,
  AddressDetailsField,
  AddressDetailsRecord,
} from '@/objects/view/address/AddressDetailsObjects'
import { AddressTileMap } from '@/pages/DeliveryConsole/components/address/AddressTileMap'
import { AddressRoutePreviewMap } from '@/pages/DeliveryConsole/components/address/AddressRoutePreview'

function AddressDetailsFieldRow({ field }: { field: AddressDetailsField }) {
  return (
    <div className={`address-details__field${field.weatherTone === 'rainy' ? ' is-rainy' : ''}`}>
      <div className="address-details__field-head">
        <span>{field.label}</span>
      </div>
      <strong>{field.value}</strong>
      {field.hint ? <small className="address-details__field-hint">{field.hint}</small> : null}
      {field.mapQuery ? (
        <div className={`address-details__map-preview${field.mapVariant === 'large' ? ' is-large' : ''}`}>
          <AddressTileMap
            primaryLabel={field.label}
            primaryAddress={field.mapQuery}
            primaryQuery={field.mapQuery || field.value}
            compact={field.mapVariant !== 'large'}
            weatherTone={field.weatherTone}
          />
        </div>
      ) : null}
    </div>
  )
}

function AddressDetailsRecordCard({ record }: { record: AddressDetailsRecord }) {
  return (
    <article className="address-details__record-card">
      <div className="address-details__record-head">
        <div>
          <p className="ticket-kind">{record.title}</p>
          <h3>{record.subtitle}</h3>
        </div>
        {record.status ? <span className="badge">{record.status}</span> : null}
      </div>
      <div className="address-details__field-list">
        {record.fields.map((field) => (
          <AddressDetailsFieldRow key={`${record.id}-${field.label}`} field={field} />
        ))}
      </div>
    </article>
  )
}

export function AddressDetailsCard({ data }: { data: AddressDetailsCardData }) {
  return (
    <section className={`address-details${data.weatherTone === 'rainy' ? ' is-rainy' : ''}`}>
      <div className="address-details__header">
        <div>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2>{data.title}</h2>
          <p className="address-details__summary">{data.summary}</p>
        </div>
        {data.weatherLabel ? <span className={`address-details__weather-badge is-${data.weatherTone ?? 'clear'}`}>{data.weatherLabel}</span> : null}
        {data.metrics.length > 0 ? (
          <div className="address-details__metrics">
            {data.metrics.map((metric) => (
              <article key={metric.label} className="address-details__metric-pill">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      {data.routePreview ? <AddressRoutePreviewMap preview={data.routePreview} /> : null}

      {data.records.length > 0 ? (
        <div className="address-details__records">
          {data.records.map((record) => <AddressDetailsRecordCard key={record.id} record={record} />)}
        </div>
      ) : (
        <div className="empty-card">{data.emptyText}</div>
      )}
    </section>
  )
}
