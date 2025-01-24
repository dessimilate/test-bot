import { BUTTON_NAMES } from '@/buttons/student-menu/button-names'
import { sendStudentMenu } from '@/buttons/student-menu/send-buttons'
import { PrismaService } from '@/prisma.service'
import { type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { sampleSize, shuffle } from 'lodash'
import { IQuestion } from './lecturer.service'
import { closeButton } from '@/buttons/close/button'
import { SCENES_ID } from '@/constants/scenes'

@Injectable()
export class StudentService {
	constructor(private readonly prisma: PrismaService) {}

	async getStudentMenu(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.session.main_menu_id)
		} catch {
			try {
				await ctx.deleteMessage(ctx.session.student_menu_id)
			} catch {}
		}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		await sendStudentMenu(ctx)
	}

	async onTakeTheTest(ctx: Context) {
		const id = ctx.match[0].slice(BUTTON_NAMES.TAKE_THE_TEST.NAME.length)

		const test = await this.prisma.test.findUnique({
			where: { id },
			select: { creator: true }
		})

		const message = test
			? `👤 От ${test.creator.name} - ✅ ПРОЙТИ`
			: '📛 Тест не найден'

		await ctx.answerInlineQuery([
			{
				id: '0',
				type: 'article',
				title: message,
				input_message_content: {
					message_text: `${BUTTON_NAMES.TAKE_THE_TEST.NAME}${id}`
				}
			}
		])
	}

	async takeTheTest(ctx: Context) {
		if (ctx.session.test) {
			await ctx.reply(
				`сначала закончите прохождение текущего теста`,
				closeButton()
			)

			return
		}

		if (!ctx.session.name) {
			await ctx.reply('сначала введите имя')
			return
		}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		const id = ctx.match[0].slice(BUTTON_NAMES.TAKE_THE_TEST.NAME.length)

		const test = await this.prisma.test.findUnique({
			where: { id }
		})

		if (test) {
			const oldStats = await this.prisma.testStats.findUnique({
				where: { testId_userId: { testId: test.id, userId: ctx.from.id } }
			})

			if (oldStats) {
				await ctx.reply('вы уже прошли этот тест', closeButton())
				return
			}

			const q = test.questions as unknown as IQuestion[]
			const questions = shuffle(sampleSize(q, Math.round(q.length / 2)))

			ctx.session.test = {
				id: test.id,
				questions,
				questions_number: questions.length,
				correct: 0
			}

			await ctx.scene.enter(SCENES_ID.TEST_SCENE)
		} else {
			await ctx.reply(`тест не найден - ${id}`, closeButton())
		}
	}

	async backScene(ctx: Context, link: string) {
		try {
			await ctx.deleteMessage(ctx.session.student_menu_id)
		} catch {}

		await ctx.scene.enter(link)
	}
}
