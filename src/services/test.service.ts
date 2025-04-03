import { closeButton } from '@/buttons/close/button'
import { sendResultMenu, sendTestMenu } from '@/buttons/test-menu/send-buttons'
import { PrismaService } from '@/prisma.service'
import { Context, IQuestion } from '@/types/context.interface'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { sampleSize, shuffle } from 'lodash'

@Injectable()
export class TestService {
	constructor(private readonly prisma: PrismaService) {}

	async testStart(ctx: Context) {
		if (ctx.session.testId) {
			const testStats = await this.prisma.testStats.findUnique({
				where: {
					testId_userId: {
						testId: ctx.session.testId,
						userId: ctx.from.id
					}
				}
			})

			if (testStats) {
				ctx.session.questions = (
					testStats.shuffledQuestions as unknown as IQuestion[]
				).filter(el => !el.chosenAnswer)
				ctx.session.questionsAmount = ctx.session.questions.length
			} else {
				const test = await this.prisma.test.findUnique({
					where: { id: ctx.session.testId }
				})

				const q = test.questions as unknown as IQuestion[]
				const questions = shuffle(sampleSize(q, Math.round(q.length / 2)))

				await this.prisma.testStats.create({
					data: {
						shuffledQuestions: questions as any,
						questionsAmount: questions.length,
						testId: ctx.session.testId,
						userId: ctx.from.id
					}
				})

				ctx.session.questions = questions
				ctx.session.questionsAmount = questions.length
			}

			await this.getQuestion(ctx)
		} else {
			await ctx.reply('у вас нет запущенных тестов', closeButton())
		}
	}

	async getQuestion(ctx: Context) {
		await sendTestMenu(ctx, ctx.session.questions[0])
	}

	async setAnswer(ctx: Context) {
		const answer = ctx.match[0]

		const question = ctx.session.questions.shift()

		await this.prisma.testStats.update({
			where: {
				testId_userId: { testId: ctx.session.testId, userId: ctx.from.id }
			},
			data: { correct: { increment: +answer + 1 === question.correct ? 1 : 0 } }
		})

		if (+answer + 1 === question.correct) {
			ctx.session.correct++
		}

		const messageId = ctx.update.callback_query.message.message_id

		try {
			await ctx.deleteMessage(messageId)
		} catch {
			try {
				await ctx.editMessageText('тут ничего нет')
			} catch {}
		}

		if (!ctx.session.questions.length) {
			const text = `✅ правильных ответов ${ctx.session.correct}/${ctx.session.questionsAmount}
💥 процент ${Math.round((ctx.session.correct * 100) / ctx.session.questionsAmount)}%`

			await sendResultMenu(ctx, text)

			await this.prisma.testStats.update({
				where: {
					testId_userId: { testId: ctx.session.testId, userId: ctx.from.id }
				},
				data: { isDone: true }
			})

			ctx.session.testId = undefined
			ctx.session.questions = undefined
			ctx.session.questionsAmount = undefined
			ctx.session.correct = undefined

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
