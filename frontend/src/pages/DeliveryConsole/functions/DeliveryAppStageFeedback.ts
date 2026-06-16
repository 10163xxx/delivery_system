import { FEEDBACK_PREFIX, FEEDBACK_TONE } from '@/pages/DeliveryConsole/objects/DeliveryUiStateObjects'

export function getDeliveryAppStageFeedback(message: string | null) {
  if (!message) return null

  if (message.startsWith(FEEDBACK_PREFIX[FEEDBACK_TONE.success])) {
    return { tone: FEEDBACK_TONE.success, text: message.slice(FEEDBACK_PREFIX[FEEDBACK_TONE.success].length) }
  }
  if (message.startsWith(FEEDBACK_PREFIX[FEEDBACK_TONE.info])) {
    return { tone: FEEDBACK_TONE.info, text: message.slice(FEEDBACK_PREFIX[FEEDBACK_TONE.info].length) }
  }
  if (message.startsWith(FEEDBACK_PREFIX[FEEDBACK_TONE.warning])) {
    return { tone: FEEDBACK_TONE.warning, text: message.slice(FEEDBACK_PREFIX[FEEDBACK_TONE.warning].length) }
  }
  if (message.startsWith(FEEDBACK_PREFIX[FEEDBACK_TONE.error])) {
    return { tone: FEEDBACK_TONE.error, text: message.slice(FEEDBACK_PREFIX[FEEDBACK_TONE.error].length) }
  }

  return { tone: FEEDBACK_TONE.error, text: message }
}
