import { Markup } from 'telegraf'
import { CLOSE } from './button-name'
import { Context } from '@/types/context.interface'

const {
	inlineKeyboard,
	button: { callback }
} = Markup

export const closeButton = () =>
	inlineKeyboard([callback('закрыть', CLOSE)], {
		columns: 1
	})

export const closeButtonCallback = callback('закрыть', CLOSE)

export const closeWindow = async (ctx: Context) => {
	const messageId = ctx.update.callback_query.message.message_id

	try {
		await ctx.deleteMessage(messageId)
	} catch {
		await ctx.editMessageText('тут ничего нет')
	}
}
