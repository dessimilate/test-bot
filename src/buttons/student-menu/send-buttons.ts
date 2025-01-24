import { type Context } from '@/types/context.interface'
import { buttons } from './buttons'
import { getDayInfo } from '@/utils/get-day-info'

const title = ({ session: { name } }: Context) =>
	[
		getDayInfo(new Date()),
		'💡 Меню студента',
		`👤 ${name ? 'Ваше имя - ' + name : 'Вы не указали имя'}`
	].join('\n')

export const sendStudentMenu = async (ctx: Context) => {
	const message = await ctx.reply(title(ctx), buttons(ctx))

	ctx.session.student_menu_id = message.message_id
}

export const editStudentMenu = async (ctx: Context) => {
	const message = (await ctx.editMessageText(title(ctx), buttons(ctx))) as {
		message_id: number
	}

	ctx.session.student_menu_id = message.message_id
}
