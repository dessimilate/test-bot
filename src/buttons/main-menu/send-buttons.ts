import { type Context } from '@/types/context.interface'
import { buttons } from './buttons'
import { getDayInfo } from '@/utils/get-day-info'

const title = ({ session: { name } }: Context) =>
	[
		getDayInfo(new Date()),
		'💡 Главное меню',
		`👤 ${name ? 'Ваше имя - ' + name : 'Вы не указали имя'}`
	].join('\n')

export const sendMainMenu = async (ctx: Context) => {
	const message = await ctx.reply(title(ctx), buttons(ctx))

	ctx.session.main_menu_id = message.message_id
}

export const editMainMenu = async (ctx: Context) => {
	const message = (await ctx.editMessageText(title(ctx), buttons(ctx))) as {
		message_id: number
	}

	ctx.session.main_menu_id = message.message_id
}
