import { Markup } from 'telegraf'
import { BUTTON_NAMES } from './button-names'
import { BACK_BUTTON } from '@/constants/bot-commands'
import { Context } from '@/types/context.interface'
import { closeButton, closeButtonCallback } from '../close/button'

const {
	inlineKeyboard,
	button: { callback, switchToCurrentChat }
} = Markup

export const buttonsMain = ({ session: { name } }: Context) =>
	inlineKeyboard(
		[
			callback(
				BUTTON_NAMES.LAST_TEST_STATISTICS.TITLE,
				BUTTON_NAMES.LAST_TEST_STATISTICS.NAME
			),
			callback(BUTTON_NAMES.ALL_TESTS.TITLE, BUTTON_NAMES.ALL_TESTS.NAME),
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

export const buttonsViewTest = (id: string) =>
	inlineKeyboard(
		[
			callback(
				BUTTON_NAMES.VIEW_TEST.TITLE,
				`${BUTTON_NAMES.VIEW_TEST.NAME}${id}`
			),
			closeButtonCallback
		],
		{
			columns: 1
		}
	)
