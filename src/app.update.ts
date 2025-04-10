import { type Context } from '@/types/context.interface'
import { Update } from 'nestjs-telegraf/dist/decorators/core/update.decorator'
import { Start } from 'nestjs-telegraf/dist/decorators/listeners/start.decorator'
import { Ctx } from 'nestjs-telegraf/dist/decorators/params/context.decorator'
import { Command } from 'nestjs-telegraf/dist/decorators/listeners/command.decorator'
import { BOT_COMMANDS } from './constants/bot-commands'
import { SCENES_ID } from './constants/scenes'
import { Action, Hears, InlineQuery } from 'nestjs-telegraf'
import { LecturerService } from './services/lecturer.service'
import { BUTTON_NAMES as BUTTON_NAMES_L } from './buttons/lecturer-menu/button-names'
import { BUTTON_NAMES as BUTTON_NAMES_S } from './buttons/student-menu/button-names'
import { MainService } from './services/main.service'
import { StudentService } from './services/student.service'
import { CLOSE } from './buttons/close/button-name'
import { closeWindow } from './buttons/close/button'
import { checkTest } from './utils/check-test'
import { PrismaService } from './prisma.service'

@Update()
export class AppUpdate {
	constructor(
		private readonly mainService: MainService,
		private readonly lecturerService: LecturerService,
		private readonly prisma: PrismaService
	) {}

	@Start()
	async startBot(@Ctx() ctx: Context) {
		try {
			await ctx.deleteMessage(ctx.update.message.message_id)
		} catch {}

		await this.mainService.updateUserInfo(ctx)

		if ([SCENES_ID.TEST_SCENE].includes(ctx.session.__scenes.current)) {
			ctx.session.__scenes.current = null
		}

		if (ctx.startPayload) {
			if (ctx.startPayload.startsWith('test-')) {
				await this.lecturerService.chosenTestStats(
					ctx,
					ctx.startPayload.slice('test-'.length)
				)
				return
			}

			await checkTest(ctx.startPayload, ctx, this.prisma)
			return
		}

		await ctx.scene.enter(ctx.session.__scenes.current || SCENES_ID.MAIN_SCENE)
	}

	@InlineQuery(new RegExp(`^${BUTTON_NAMES_L.ENTER_NAME.NAME}.*`))
	async onChangeName(@Ctx() ctx: Context) {
		await this.mainService.onChangeName(ctx)
	}

	@Hears(new RegExp(`^${BUTTON_NAMES_L.ENTER_NAME.NAME}.+`))
	async changeName(@Ctx() ctx: Context) {
		await this.mainService.changeName(ctx)
	}

	@Action(CLOSE)
	async close(@Ctx() ctx: Context) {
		await closeWindow(ctx)
	}

	@Command(BOT_COMMANDS.TEST)
	async testScene(@Ctx() ctx: Context) {
		await ctx.scene.enter(SCENES_ID.TEST_SCENE)
	}
}
