import { BUTTON_NAMES } from '@/buttons/main-menu/button-names'
import { SCENES_ID } from '@/constants/scenes'
import { MainService } from '@/services/main.service'
import { type Context } from '@/types/context.interface'
import { Injectable } from '@nestjs/common'
import { Action, Ctx, SceneEnter } from 'nestjs-telegraf'
import { Scene } from 'nestjs-telegraf/dist/decorators/core/scene.decorator'

@Injectable()
@Scene(SCENES_ID.MAIN_SCENE)
export class MainScene {
	constructor(private readonly mainService: MainService) {}

	@SceneEnter()
	async sceneEnter(@Ctx() ctx: Context) {
		await this.mainService.getMainMenu(ctx)
	}

	@Action(BUTTON_NAMES.CONTINUE_TEST.NAME)
	async studentScene(@Ctx() ctx: Context) {
		await ctx.scene.enter(SCENES_ID.TEST_SCENE)
	}

	@Action(BUTTON_NAMES.LECTURER.NAME)
	async lecturerScene(@Ctx() ctx: Context) {
		await ctx.scene.enter(SCENES_ID.LECTURER_SCENE)
	}
}
