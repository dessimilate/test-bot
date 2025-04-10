import { Context } from '@/types/context.interface'
import { PrismaClient } from '@prisma/client'
import { closeButton } from '@/buttons/close/button'
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
		ctx.session.testId = test.id

		await ctx.scene.enter(SCENES_ID.TEST_SCENE)
	} else {
		await ctx.reply(`тест не найден - ${id}`, closeButton())
		ctx.session.testId = undefined
	}
}
