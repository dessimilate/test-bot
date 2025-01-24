import { closeButton } from '@/buttons/close/button'
import { sendResultMenu, sendTestMenu } from '@/buttons/test-menu/send-buttons'
import { PrismaService } from '@/prisma.service'
import { Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

@Injectable()
export class TestService {
	constructor(private readonly prisma: PrismaService) {}

	async testStart(ctx: Context) {
		if (ctx.session.test) {
			await this.getQuestion(ctx)
		} else {
			await ctx.reply('у вас нет запущенных тестов', closeButton())
		}
	}

	async getQuestion(ctx: Context) {
		await sendTestMenu(ctx, ctx.session.test.questions[0])
	}

	async setAnswer(ctx: Context) {
		const answer = ctx.match[0]

		const question = ctx.session.test.questions.shift()

		if (+answer + 1 === question.correct) {
			ctx.session.test.correct++
		}

		const messageId = ctx.update.callback_query.message.message_id

		try {
			await ctx.deleteMessage(messageId)
		} catch {
			try {
				await ctx.editMessageText('тут ничего нет')
			} catch {}
		}

		if (!ctx.session.test.questions.length) {
			const text = `✅ правильных ответов ${ctx.session.test.correct}/${ctx.session.test.questions_number}
💥 процент ${Math.round((ctx.session.test.correct * 100) / ctx.session.test.questions_number)}%`

			await sendResultMenu(ctx, text)

			await this.prisma.testStats.create({
				data: {
					correct: ctx.session.test.correct,
					testId: ctx.session.test.id,
					userId: ctx.from.id
				}
			})

			ctx.session.test = null

			return
		}

		await this.getQuestion(ctx)
	}

	async backScene(ctx: Context, link: string) {
		const messageId = ctx.update.callback_query.message.message_id

		try {
			await ctx.deleteMessage(messageId)
		} catch {
			try {
				await ctx.editMessageText('тут ничего нет')
			} catch {}
		}

		await ctx.scene.enter(link)
	}
}
