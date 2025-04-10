import { BUTTON_NAMES } from '@/buttons/lecturer-menu/button-names'
import {
	sendLecturerMenu,
	sendViewTestMenu
} from '@/buttons/lecturer-menu/send-buttons'
import { PrismaService } from '@/prisma.service'
import { IQuestion, type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InputJsonValue } from '@prisma/client/runtime/library'
import axios from 'axios'
import WordExtractor from 'word-extractor'
import { closeButton } from '@/buttons/close/button'
import { createCanvas } from 'canvas'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Test } from '@prisma/client'
import { deepLink } from '@/constants/deep-link'

@Injectable()
export class LecturerService {
	constructor(private readonly prisma: PrismaService) {}

	async getLecturerMenu(ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.session.main_menu_id)
		} catch {
			try {
				await ctx.deleteMessage(ctx.session.lecturer_menu_id)
			} catch {}
		}

		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		await sendLecturerMenu(ctx)
	}

	async getTestStats(ctx: Context, test: any) {
		const questions = test.questions as unknown as IQuestion[]

		const questionsNumber = Math.round(questions.length / 2)

		const stats: {
			name: string
			percentage: number
			questionsNumber: number
			correct: number
		}[] = test.testStats.map(el => ({
			name: el.user.name,
			correct: el.correct,
			questionsNumber,
			percentage: Math.round((el.correct * 100) / questionsNumber)
		}))

		const rowHeight = 40
		const headerHeight = 50
		const canvasWidth = 600
		const canvasHeight = headerHeight + stats.length * rowHeight + 20

		const canvas = createCanvas(canvasWidth, canvasHeight)
		const ctxCanvas = canvas.getContext('2d')

		ctxCanvas.fillStyle = '#000000'
		ctxCanvas.font = '20px Arial'
		ctxCanvas.textAlign = 'left'

		ctxCanvas.fillText('Статистика студентов:', 10, 30)

		ctxCanvas.font = '18px Arial'
		ctxCanvas.fillText('Имя', 10, headerHeight)
		ctxCanvas.fillText('Процент', 200, headerHeight)
		ctxCanvas.fillText('Правильных', 320, headerHeight)
		ctxCanvas.fillText('Всего', 480, headerHeight)

		ctxCanvas.strokeStyle = '#000000'
		ctxCanvas.lineWidth = 1
		ctxCanvas.beginPath()
		ctxCanvas.moveTo(10, headerHeight + 5)
		ctxCanvas.lineTo(canvasWidth - 10, headerHeight + 5)
		ctxCanvas.stroke()

		stats.forEach((s, i) => {
			const y = headerHeight + 30 + i * rowHeight
			ctxCanvas.fillText(s.name, 10, y)
			ctxCanvas.fillText(`${s.percentage}%`, 200, y)
			ctxCanvas.fillText(`${s.correct}`, 320, y)
			ctxCanvas.fillText(`${s.questionsNumber}`, 480, y)
		})

		const buffer = canvas.toBuffer()

		await ctx.replyWithPhoto({ source: buffer })
	}

	async lastTestStats(ctx: Context) {
		const lastTest = await this.prisma.test.findUnique({
			where: { id: ctx.session.last_created_test_id },
			select: {
				testStats: { select: { correct: true, user: true } },
				questions: true
			}
		})

		if (!lastTest) {
			return
		}

		await this.getTestStats(ctx, lastTest)
	}

	async chosenTestStats(ctx: Context, id: string) {
		const test = await this.prisma.test.findUnique({
			where: { id },
			select: {
				testStats: { select: { correct: true, user: true } },
				questions: true
			}
		})

		if (!test) {
			return
		}

		await this.getTestStats(ctx, test)
	}

	async allTests(ctx: Context) {
		const tests = await this.prisma.test.findMany({
			where: { creatorId: ctx.from.id },
			select: {
				id: true,
				createdAt: true,
				testStats: { select: { user: true } }
			}
		})

		for (const test of tests) {
			const uniqueUsers = new Set(test.testStats.map(stat => stat.user.id))
			const countStudents = uniqueUsers.size

			const getStudentWord = (count: number) => {
				const lastDigit = count % 10
				const lastTwoDigits = count % 100

				if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
					return 'студентов'
				}

				if (lastDigit === 1) {
					return 'студент'
				}

				if (lastDigit >= 2 && lastDigit <= 4) {
					return 'студента'
				}

				return 'студентов'
			}

			await ctx.reply(
				[
					format(test.createdAt, 'dd.MM HH:mm', { locale: ru }),
					`${deepLink(ctx)}test-${test.id}`,
					`прошли тест - ${countStudents} ${getStudentWord(countStudents)}`
				].join('\n')
			)
		}
	}

	async backScene(ctx: Context, link: string) {
		try {
			await ctx.deleteMessage(ctx.session.lecturer_menu_id)
		} catch {}

		await ctx.scene.enter(link)
	}

	async processDocument(ctx: Context) {
		if (!ctx.session.name) {
			await ctx.reply('сначала введите имя')
			return
		}

		try {
			const { file_id, file_name } = ctx.update.message.document

			const {
				groups: { ext }
			} = file_name.match(/\.(?<ext>[a-z]+)$/)

			const { href: filepath } = await ctx.telegram.getFileLink(file_id)

			const { data } = await axios.get(filepath, {
				responseType: 'arraybuffer'
			})

			const buffer = Buffer.from(data)

			let questions: IQuestion[]

			switch (ext) {
				case 'pdf':
					questions = await this.processDocxPdf(buffer)
					break
				case 'docx':
					questions = await this.processDocxPdf(buffer)
					break
				default:
					await ctx.reply('данный формат не поддерживается')
			}

			const test = await this.prisma.test.create({
				data: {
					creatorId: ctx.from.id,
					questions: questions as unknown as InputJsonValue,
					filepath
				}
			})

			ctx.session.last_created_test_id = test.id

			sendViewTestMenu(ctx, test.id)
		} catch (e) {
			console.log(e)
		}
	}

	private textParser(text: string): IQuestion[] {
		const linesToFind = text.split('\n')

		const id = linesToFind.findIndex(el => /^ответы$/gi.test(el))

		const ans = linesToFind.slice(id + 1)

		const changedText = linesToFind.slice(0, id).join('\n')

		const lines = changedText
			.split('\n\n')
			.map(line => line.trim())
			.filter(Boolean)

		const result: IQuestion[] = []

		for (const [i, line] of Object.entries(lines)) {
			const parsedLines = line
				.split('\n')
				.map(line => line.trim())
				.filter(Boolean)

			result.push({
				question: parsedLines[0].replace(/\.|;|,$/gi, ''),
				answers: parsedLines.slice(1).map(el => el.replace(/\.|;|,$/gi, '')),
				correct: +ans[+i]
			})
		}

		// console.log(result)

		// let questionNumber = 1
		// const questionIds: number[] = []

		// for (const [i, line] of Object.entries(lines)) {
		// 	if (
		// 		new RegExp(`^${questionNumber}`).test(line) &&
		// 		new RegExp('^1').test(lines[+i + 1])
		// 	) {
		// 		questionNumber += 1
		// 		questionIds.push(+i)
		// 	}
		// }

		// for (const [i, questionId] of Object.entries(questionIds)) {
		// 	const replacer = (text: string) => text.replace(/^\d+\./gi, '').trim()

		// 	const el: IQuestion = {
		// 		question: replacer(lines[questionId]),
		// 		answers: (+i === questionIds.length - 1
		// 			? lines.slice(questionId + 1)
		// 			: lines.slice(questionId + 1, questionIds[+i + 1])
		// 		).map(el => replacer(el))
		// 	}

		// 	result.push(el)
		// }

		return result
	}

	private async processDocxPdf(buffer: Buffer): Promise<IQuestion[]> {
		const extractor = new WordExtractor()
		const doc = await extractor.extract(buffer)
		const text = doc.getBody()

		return this.textParser(text)
	}

	async viewQuestions(ctx: Context) {
		const id = ctx.match[0].slice(BUTTON_NAMES.VIEW_TEST.NAME.length)

		const test = await this.prisma.test.findUnique({
			where: { id }
		})

		if (test) {
			const questions = test.questions as unknown as IQuestion[]

			const text = questions
				.slice(0, 2)
				.map(
					el => `${el.question}\n${el.answers.map(el => ` - ${el}`).join('\n')}`
				)
				.join('\n\n')
				.slice(0, 3900)

			await ctx.reply('первые 2 вопроса\n\n' + text, closeButton())
		}
	}
}
