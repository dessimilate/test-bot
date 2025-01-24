import { type Context } from '@/types/context.interface'
import { buttons } from './buttons'
import { getDayInfo } from '@/utils/get-day-info'

const title = [getDayInfo(new Date()), '💡 Главное меню'].join('\n')

export const sendMainMenu = async (ctx: Context) => {
	const message = await ctx.reply(title, buttons())

	ctx.session.main_menu_id = message.message_id
}

export const editMainMenu = async (ctx: Context) => {
	const message = (await ctx.editMessageText(title, buttons())) as {
		message_id: number
	}

	ctx.session.main_menu_id = message.message_id
}
