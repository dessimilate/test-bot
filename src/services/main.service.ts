import { BUTTON_NAMES } from '@/buttons/lecturer-menu/button-names'
import { sendMainMenu } from '@/buttons/main-menu/send-buttons'
import { SCENES_ID } from '@/constants/scenes'
import { PrismaService } from '@/prisma.service'
import { type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

@Injectable()
export class MainService {
	constructor(private readonly prisma: PrismaService) {}

	async getMainMenu(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.session.main_menu_id)
		} catch {}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		await sendMainMenu(ctx)
	}

	async updateUserInfo({ from: { id, username } }: Context) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		if (user) {
			if (user.username !== username) {
				const oldUser = await this.prisma.user.findUnique({
					where: { username }
				})

				if (oldUser) {
					await this.prisma.user.update({
						where: { username },
						data: { username: null }
					})
				}

				await this.prisma.user.update({
					where: { id },
					data: { username }
				})
			}
		} else {
			await this.prisma.user.create({
				data: { id, username, name: '' }
			})
		}
	}

	async onChangeName(ctx: Context) {
		const name = ctx.match[0].slice(BUTTON_NAMES.ENTER_NAME.NAME.length)
		const message = `👤 ${name} - ✅ ПОДТВЕРДИТЬ`

		await ctx.answerInlineQuery([
			{
				id: '0',
				type: 'article',
				title: message,
				input_message_content: {
					message_text: `${BUTTON_NAMES.ENTER_NAME.NAME}${name}`
				}
			}
		])
	}

	async changeName(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		const name = ctx.match[0].slice(BUTTON_NAMES.ENTER_NAME.NAME.length)

		ctx.session.name = name

		await this.prisma.user.update({
			where: { id: ctx.from.id },
			data: { name }
		})

		try {
			await ctx.deleteMessage(ctx.session.lecturer_menu_id)
		} catch {}

		await ctx.scene.enter(ctx.session.__scenes.current || SCENES_ID.MAIN_SCENE)
	}
}
