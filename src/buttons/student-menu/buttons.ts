import { Markup } from 'telegraf'
import { BUTTON_NAMES } from './button-names'
import { BACK_BUTTON } from '@/constants/bot-commands'
import { Context } from '@/types/context.interface'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const buttons = ({ session: { name } }: Context) =>
	inlineKeyboard(
		[
			switchToCurrentChat(
				BUTTON_NAMES.ENTER_NAME[name ? 'TITLE2' : 'TITLE1'],
				BUTTON_NAMES.ENTER_NAME.NAME
			),
			callback(BACK_BUTTON.TITLE, BACK_BUTTON.NAME)
		],
		{
			columns: 1
		}
	)
