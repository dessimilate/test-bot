import { type Context } from '@/types/context.interface'
import { buttonsMain, buttonsViewTest } from './buttons'
import { getDayInfo } from '@/utils/get-day-info'
import { deepLink } from '@/constants/deep-link'

const title = ({ session: { name } }: Context) =>
	[
		getDayInfo(new Date()),
		'💡 Меню преподавателя',
		`👤 ${name ? 'Ваше имя - ' + name : 'Вы не указали имя'}`
	].join('\n')

export const sendLecturerMenu = async (ctx: Context) => {
	const message = await ctx.reply(title(ctx), buttonsMain(ctx))

	ctx.session.lecturer_menu_id = message.message_id
}

export const editLecturerMenu = async (ctx: Context) => {
	const message = (await ctx.editMessageText(title(ctx), buttonsMain(ctx))) as {
		message_id: number
	}

	ctx.session.lecturer_menu_id = message.message_id
}

export const sendViewTestMenu = async (ctx: Context, id: string) => {
	await ctx.reply(`${deepLink(ctx)}${id}`, buttonsViewTest(id))
}
