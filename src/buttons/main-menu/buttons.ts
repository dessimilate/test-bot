import { Markup } from 'telegraf'
import { BUTTON_NAMES } from './button-names'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const buttons = () =>
	inlineKeyboard(
		[
			callback(BUTTON_NAMES.STUDENT.TITLE, BUTTON_NAMES.STUDENT.NAME),
			callback(BUTTON_NAMES.LECTURER.TITLE, BUTTON_NAMES.LECTURER.NAME)
		],
		{
			columns: 1
		}
	)
