import { IQuestion, type Context } from '@/types/context.interface'
import { buttonsQuestions, buttonsResult } from './buttons'

const title = ({ question }: IQuestion) => [question].join('\n')

export const sendTestMenu = async (ctx: Context, question: IQuestion) => {
	await ctx.reply(title(question), buttonsQuestions(question))
}

export const editTestMenu = async (ctx: Context, question: IQuestion) => {
	await ctx.editMessageText(title(question), buttonsQuestions(question))
}

export const sendResultMenu = async (ctx: Context, text: string) => {
	await ctx.reply(text, buttonsResult())
}
