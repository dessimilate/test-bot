import { Context } from '@/types/context.interface'
import { PrismaClient } from '@prisma/client'
import { closeButton } from '@/buttons/close/button'
import { sampleSize, shuffle } from 'lodash'
import { SCENES_ID } from '@/constants/scenes'

export const checkTest = async (
	id: string,
	ctx: Context,
	prisma: PrismaClient
) => {
	const test = await prisma.test.findUnique({
		where: { id }
	})

	if (test) {
		const testStats = await prisma.testStats.findUnique({
			where: { testId_userId: { testId: test.id, userId: ctx.from.id } }
		})

		if (testStats?.isDone) {
			await ctx.reply('вы уже прошли этот тест', closeButton())
			ctx.session.testId = undefined
			return
		}

		ctx.session.testId = test.id

		await ctx.scene.enter(SCENES_ID.TEST_SCENE)
	} else {
		await ctx.reply(`тест не найден - ${id}`, closeButton())
		ctx.session.testId = undefined
	}
}
