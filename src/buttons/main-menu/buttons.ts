import { Markup } from 'telegraf'
import { BUTTON_NAMES } from './button-names'
import { Context } from '@/types/context.interface'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const buttons = ({ session: { name } }: Context) =>
	inlineKeyboard(
		[
			callback(BUTTON_NAMES.LECTURER.TITLE, BUTTON_NAMES.LECTURER.NAME),
			switchToCurrentChat(
				BUTTON_NAMES.CHANGE_NAME[name ? 'TITLE2' : 'TITLE1'],
				BUTTON_NAMES.CHANGE_NAME.NAME
			),
			callback(
				BUTTON_NAMES.CONTINUE_TEST.TITLE,
				BUTTON_NAMES.CONTINUE_TEST.NAME
			)
		],
		{
			columns: 1
		}
	)
