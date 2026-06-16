import { useState } from 'react'
import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import type { MenuItem } from '@/objects/core/SharedObjects'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CUSTOMER_CHECKOUT_COPY,
  CUSTOMER_CHECKOUT_LAYOUT,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'
import { formatPrice as formatPriceText } from '@/pages/DeliveryConsole/functions/shared/DeliveryFormatters'

type MenuItemConfigurationDialogProps = {
  item: MenuItem | null
  modalState: CheckoutPanelProps['menuItemConfigurationModal']
  onClose: CheckoutPanelProps['closeMenuItemConfiguration']
  onConfirm: CheckoutPanelProps['confirmMenuItemConfiguration']
}

export function MenuItemConfigurationDialog(props: MenuItemConfigurationDialogProps) {
  const { item, modalState, onClose, onConfirm } = props

  if (!item || !modalState) return null

  return (
    <MenuItemConfigurationDialogContent
      key={`${item.id}:${modalState.quantityAfterConfirm}`}
      item={item}
      modalState={modalState}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function MenuItemConfigurationDialogContent({
  item,
  modalState,
  onClose,
  onConfirm,
}: {
  item: MenuItem
  modalState: NonNullable<MenuItemConfigurationDialogProps['modalState']>
  onClose: MenuItemConfigurationDialogProps['onClose']
  onConfirm: MenuItemConfigurationDialogProps['onConfirm']
}) {
  const [draftSelections, setDraftSelections] = useState<Record<string, string[]>>(
    () => modalState.draftSelections,
  )

  function toggleOption(groupName: string, option: string, maxSelections: number) {
    setDraftSelections((current) => {
      const currentValues = current[groupName] ?? []
      const exists = currentValues.includes(option)
      if (exists) {
        return { ...current, [groupName]: currentValues.filter((value) => value !== option) }
      }
      if (maxSelections <= 1) {
        return { ...current, [groupName]: [option] }
      }
      if (currentValues.length >= maxSelections) return current
      return { ...current, [groupName]: [...currentValues, option] }
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl bg-white p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="stack">
          {item.selectionGroups.map((group) => {
            const selectedOptions = draftSelections[group.name] ?? []
            return (
              <section key={group.name}>
                <div
                  className="meta-line"
                  style={{ marginBottom: CUSTOMER_CHECKOUT_LAYOUT.configurationGroupSpacing }}
                >
                  <strong>{group.name}</strong>
                  {group.minSelections === 1 && group.maxSelections === 1
                    ? CUSTOMER_CHECKOUT_COPY.menu.configurationGroupRequiredSingle
                    : CUSTOMER_CHECKOUT_COPY.menu.configurationGroupSelectionRange(
                        group.minSelections,
                        group.maxSelections,
                      )}
                </div>
                <div
                  className="menu-configuration-options"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: CUSTOMER_CHECKOUT_LAYOUT.configurationOptionGap,
                  }}
                >
                  {group.options.map((option) => {
                    const selected = selectedOptions.includes(option.name)
                    return (
                      <button
                        key={option.name}
                        type="button"
                        aria-pressed={selected}
                        className={`menu-configuration-option${selected ? ' is-selected' : ''}`}
                        onClick={() => toggleOption(group.name, option.name, group.maxSelections)}
                      >
                        <span className="menu-configuration-option__check">{selected ? '✓' : ''}</span>
                        {option.name}
                        {option.additionalPriceCents > 0 ? ` +${formatPriceText(option.additionalPriceCents)}` : ''}
                      </button>
                    )
                  })}
                </div>
                {selectedOptions.length > 0 ? (
                  <p className="meta-line menu-configuration-selected">
                    {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogSelectedPrefix}
                    {selectedOptions.join(CUSTOMER_CHECKOUT_COPY.menu.selectionSummarySeparator)}
                  </p>
                ) : null}
              </section>
            )
          })}
          {modalState.errorText ? <p className="field-error-text">{modalState.errorText}</p> : null}
        </div>
        <DialogFooter>
          <button className="secondary-button" onClick={onClose} type="button">
            {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogCancelButton}
          </button>
          <button
            className="primary-button"
            onClick={() => onConfirm(item, modalState.quantityAfterConfirm, draftSelections)}
            type="button"
          >
            {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogConfirmButton}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
