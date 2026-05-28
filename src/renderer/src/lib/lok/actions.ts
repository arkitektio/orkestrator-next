import { Action } from '../localactions/LocalActionProvider'
import { Bell, Building2 } from 'lucide-react'

export const LOK_ACTIONS = {
  notify_user: {
    description: 'Notify a user',
    title: 'Notify User',
    icon: Bell,
    conditions: [{ type: 'identifier', identifier: '@lok/user' }, { type: 'nopartner' }],
    collections: ['notify'],
    execute: async ({ state, services, dialog }) => {
      const users = state.left
        .filter((item) => item.identifier === '@lok/user')
        .map((item) => item.object)

      dialog.openDialog('notifyusers', { users })
    }
  },
  add_user_to_organization: {
    title: 'Add User',
    description: 'Add a user to an organization',
    icon: Building2,
    conditions: [{ type: 'identifier', identifier: '@lok/user' }, { type: 'nopartner' }],
    collections: ['notify'],
    execute: async ({ state, services, dialog }) => {
      const users = state.left
        .filter((item) => item.identifier === '@lok/user')
        .map((item) => item.object)

      dialog.openSheet('addusertoorganization', { users }, { className: 'max-w-4xl' })
    }
  }
} as const satisfies Record<string, Action>
