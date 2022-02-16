import { Intent, Position, Toaster } from '@blueprintjs/core'

export const toaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP,
})

export const showDangerToaster = message => {
  toaster.show({ message, icon: 'warning-sign', intent: Intent.DANGER })
}

export const showSuccessToaster = message => {
  toaster.show({ message, icon: 'tick', intent: Intent.SUCCESS })
}

export const showWarningToaster = message => {
  toaster.show({ message, icon: 'hand', intent: Intent.WARNING })
}
