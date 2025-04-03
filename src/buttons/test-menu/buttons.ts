import { Markup } from 'telegraf'
import { BACK_BUTTON } from '@/constants/bot-commands'
import { Context, IQuestion } from '@/types/context.interface'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const buttonsQuestions = ({ answers }: IQuestion) =>
	inlineKeyboard(
		answers.map((el, i) => callback(el, String(i))),
		{
			columns: 1
		}
	)

export const buttonsResult = () =>
	inlineKeyboard([callback(BACK_BUTTON.TITLE, BACK_BUTTON.NAME)], {
		columns: 1
	})
